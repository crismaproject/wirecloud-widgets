var entityTypes = [
    { id:  7, img: 'img/ambulance.svg',         dedicatedLayer: 'Ambulances'                   },
    { id:  8, img: 'img/ambulance_station.svg', dedicatedLayer: 'Amb. Stations'                },
    { id:  9, img: 'img/hospital.svg',          dedicatedLayer: 'Hospitals'                    },
    { id: 10, img: 'img/person.svg',
        hideIf: function (person) {
            // prop id 476: Patient-Is-Exposed
            // iff true, do not show as per request
            var hide = false;
            var properties = person.entityInstancesProperties;
            for (var i = 0; !hide && i < properties.length; i++) {
                if (properties[i].entityPropertyValue == 'false')
                    hide = true;
            }
            return hide;
        } },
    { id: 11, img: 'img/danger.svg',            dedicatedLayer: 'Danger',       inactive: true }
];