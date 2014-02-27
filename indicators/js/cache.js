Storage.prototype.produce = function (key, factory) {
    var $storage = this;
    var deferred = $.Deferred();
    var value = this.getItem(key);
    if (value === null) {
        $.when(factory()).done(function (factoryResult) {
            if (typeof factoryResult !== 'undefined' && factoryResult !== null) {
                $storage.setItem(key, JSON.stringify(factoryResult));
                deferred.resolveWith($storage, [ factoryResult ]);
            } else deferred.reject();
        });
    } else deferred.resolveWith($storage, [ JSON.parse(value) ]);

    return deferred.promise();
};