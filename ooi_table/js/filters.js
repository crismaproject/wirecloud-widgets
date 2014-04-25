var ooiTypeFilters = {
    7: function show(ambulance) {
        var properties = ambulance.entityInstancesProperties;
        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];
            // Check target availability time; 0 = now, >0 = later, <0 = never; hide unavailable
            if (property.entityTypePropertyId == 312)
                return property.entityPropertyValue === 0 || property.entityPropertyValue === '0';
        }
        return true;
    }
};