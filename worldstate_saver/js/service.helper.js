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
                        $.when($me.createNewOOIs(knownOOIs))
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
                                                wps
                                                    .executeProcess('AgentsResourceModel', { ICMMworldstateURL: icmm.icmm_direct + '/CRISMA.worldstates/' + icmmId })
                                                    .then(function() {
                                                        deferred.notify({status: 'Agent model has been invoked', data: worldState, progress: 5});
                                                        deferred.resolve(worldState);
                                                    }, function () { deferred.reject('Failed to invoke Agent Model'); });
                                            }, function () { deferred.reject('Failed to create world state in ICMM'); });
                                    }, function () { deferred.reject('Failed to update OOI properties'); });
                            }, function () { deferred.reject('Failed to create new OOIs'); });
                    }, function () { deferred.reject('Failed to create new OOIWSR world state'); });

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
                    //description: this.commandsToString(commands)
                    description: 'generated by Wirecloud'
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
                var $self = this;
                oois.forEach(function (x, i) {
                    ooiMappings[x.entityId] = i;
                    if (x.hasOwnProperty('_replacedByEntityId'))
                        ooiMappings[x._replacedByEntityId] = i;
                });

                var propUpdates = commands.filter(function (x) { return x.affected.length && x.command.hasOwnProperty('setProperties') });
                for (var i = 0; i < propUpdates.length; i++) {
                    var command = propUpdates[i];
                    for (var j = 0; j < command.affected.length; j++) {
                        var affectedId = ooiMappings[command.affected[j]];
                        var changes = command.command.setProperties;
                        for (var key in changes) {
                            var value = changes[key];
                            if (typeof value === 'number' && value < 0)
                                value = ooiMappings[value];
                            else if (typeof value === 'string')
                                value = value.replace(/^-[1-9][0-9]*$/, function (v) {
                                    return ooiMappings[parseInt(v)];
                                });

                            var index = -1;
                            if (typeof key === 'string') key = parseInt(key);
                            for (var k = 0; index == -1 && k < oois[affectedId].entityInstancesProperties.length; k++)
                                if (oois[affectedId].entityInstancesProperties[k].entityTypePropertyId == key)
                                    index = k;

                            if (index != -1)
                                oois[affectedId].entityInstancesProperties[index].entityPropertyValue = value;
                            else
                                oois[affectedId].entityInstancesProperties.push({entityTypePropertyId: key, entityPropertyValue: value});
                        }
                    }
                }

                var geoUpdates = commands.filter(function (x) { return x.affected.length && x.command.hasOwnProperty('setGeometry') });
                for (var i = 0; i < geoUpdates.length; i++) {
                    var command = geoUpdates[i];
                    for (var j = 0; j < command.affected.length; j++) {
                        var affectedId = ooiMappings[command.affected[j]];
                        var changes = command.command.setGeometry;
                        oois[affectedId].geometry = {
                            geometry: {
                                coordinateSystemId: 4326,
                                wellKnownText: 'POINT ('+changes.lat+' '+changes.lon+')'
                            }
                        }
                    }
                }

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

Array.prototype.flatten = function() {
    var result = [];
    for (var i = 0; i < this.length; i++)
        result = result.concat(this[i]);
    return result;
};