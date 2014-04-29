angular.module('worldStateSaver.helper', ['worldStateSaver.ooiwsr', 'worldStateSaver.icmm', 'worldStateSaver.wps'])
    .constant('emptyWorldState', {
        simulationId: null,
        worldStateParentId: null,
        description: '',
        dateTime: null
    })
    .service('worldStateUpdater', ['$q', 'emptyWorldState', 'ooiwsr', 'icmm', 'wps', function($q, emptyWorldState, ooiwsr, icmm, wps) {
        return {
            finalizeWorldState: function (activeWorldState, commands, knownOOIs) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var $me = this;

                $me.createWorldState(activeWorldState, commands)
                    .then(function (worldState) {
                        deferred.notify({status: 'World state registered (OOI-WSR)', data: worldState, progress: 1});
                        $.whenAll($me.createNewOOIs(knownOOIs))
                            .then(function() {
                                deferred.notify({status: 'New OOIs have been registered (OOI-WSR)', data: knownOOIs, progress: 2});
                                knownOOIs = $me.applyCommands(knownOOIs, commands);
                                $.when(
                                    $me.createOOIPropertiesUpdates(worldState.worldStateId, knownOOIs),
                                    $me.createOOIGeometryUpdates(worldState.worldStateId, knownOOIs))
                                    .then(function () {
                                        deferred.notify({status: 'Entities have been updated (OOI-WSR)', data: knownOOIs, progress: 3});
                                        icmm.insertWorldState(worldState, activeWorldState)
                                            .then(function (icmmId) {
                                                worldState['$icmm'] = { id: icmmId };
                                                deferred.notify({status: 'ICMM has been updated', data: worldState, progress: 4});
                                                //deferred.resolve(worldState);
                                                wps
                                                    .executeProcess('AgentsResourceModel', { ICMMworldstateURL: icmm.icmm_direct + '/CRISMA.worldstates/' + icmmId })
                                                    .then(function() {
                                                        deferred.notify({status: 'Agent model has been invoked', data: worldState, progress: 5});
                                                        deferred.resolve(worldState);
                                                    });
                                            });
                                    });
                            });
                    });

                return promise;
            },

            /** @private */
            commandsToString: function (commands) {
                return commands
                    .filter(function (x) { return x.command.hasOwnProperty('log'); })
                    .map(function (x) { return x.command.log; })
                    .join('; ');
            },

            /** @private */
            buildWorldState: function (activeWorldState, commands) {
                return $.extend({}, emptyWorldState, {
                    simulationId: activeWorldState.simulationId,
                    worldStateParentId: activeWorldState.worldStateId,
                    dateTime: activeWorldState.dateTime,
                    description: this.commandsToString(commands)
                });
            },

            /** @private */
            createWorldState: function (activeWorldState, commands) {
                var worldStateObj = this.buildWorldState(activeWorldState, commands);
                return ooiwsr.insertWorldState(worldStateObj);
            },

            /** @private */
            createNewOOIs: function (oois) {
                return oois
                    .filter(function (ooi) { return !ooi.hasOwnProperty('entityId') || ooi.entityId < 0; })
                    .map(function (x) {
                        return ooiwsr.insertEntity({
                            entityName: x.entityName || 'New OOI',
                            entityTypeId: x.entityTypeId || 14,
                            entityDescription: x.entityDescription || ''
                        }).then(function (entity) {
                            x._replacedByEntityId = entity.entityId;
                            oois.push(entity);
                        });
                    });
            },

            /** @private */
            applyCommands: function (oois, commands) {
                var ooiMappings = { };
                oois
                    .filter(function (x) { return x.hasOwnProperty('_replacedByEntityId'); })
                    .forEach(function (x) { ooiMappings[x.entityId] = x._replacedByEntityId; });

                commands
                    .filter(function (x) { return x.affected.length && x.command.hasOwnProperty('setProperties') })
                    .forEach(function(command) {
                        command.affected.forEach(function(affectedId) {
                            if (affectedId < 0) // target is a newly created OOI. Look up the ID
                                affectedId = ooiMappings[affectedId];
                            var changes = command.command.setProperties;
                            for (var key in changes) {
                                var value = changes[key];
                                if (typeof value === 'number' && value < 0)
                                    value = ooiMappings[value];
                                else if (typeof value === 'string')
                                    value = value.replace(/^-[1-9][0-9]*$/, function (v) {
                                        return ooiMappings[parseInt(v)];
                                    });
                                setProperty(oois, affectedId, key, value);
                            }
                        });
                    });

                return oois;
            },

            createOOIPropertiesUpdates: function (worldStateId, oois) {
                var updates = oois
                    .filter(function (x) { return x.hasOwnProperty('entityInstancesProperties') && x.entityInstancesProperties.length; })
                    .map(function (ooi) {
                        return ooi.entityInstancesProperties.map(function (x) {
                            return {
                                entityId: ooi.entityId,
                                entityTypePropertyId: x.entityTypePropertyId,
                                entityPropertyValue: x.entityPropertyValue,
                                worldStateId: worldStateId
                            }
                        });
                    }).flatten();

                return ooiwsr.insertEntityProperties(updates);
            },

            /**
             * Sends all geometries to the OOI-WSR for the specified OOIs and the specified world state.
             * @param {number} worldStateId the world state's unique identifier
             * @param {object[]} oois all OOIs belonging to the current world state.
             * @returns {jQuery.Promise}
             */
            createOOIGeometryUpdates: function (worldStateId, oois) {
                var updates = oois
                    .filter(function (x) { return x.hasOwnProperty('entityInstancesGeometry') && x.entityInstancesGeometry.length; })
                    .map(function (ooi) {
                        var entityInstanceGeometry = ooi.entityInstancesGeometry[0];
                        return {
                            entityId: ooi.entityId,
                            worldStateId: worldStateId,
                            geometry: {
                                geometry: {
                                    coordinateSystemId: 4326,
                                    wellKnownText: entityInstanceGeometry.geometry.geometry.wellKnownText
                                }
                            }
                        };
                    }).flatten();

                return ooiwsr.insertEntityGeometries(updates);
            }
        }
    }]);

jQuery.extend({
    /**
     * @param {jQuery.Promise[]} array
     */
    whenAll: function(array) {
        var deferred = new $.Deferred();
        var remaining = array.length;
        if (!remaining) deferred.resolve();
        for (var i = 0; i < array.length; i++)
            array[i].then(function () {
                if (--remaining == 0) deferred.resolve();
            }, deferred.reject);
        return deferred.promise();
    }
});

Array.prototype.flatten = function() {
    var result = [];
    for (var i = 0; i < this.length; i++)
        result = result.concat(this[i]);
    return result;
};