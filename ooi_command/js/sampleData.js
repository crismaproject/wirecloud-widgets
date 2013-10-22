/*
 * This is sample data that can be used to populate the widget with something to show for demonstrational purposes,
 * or for developers to inspect the inner workings and output without having to deploy stuff to the Mashup Platform.
 */

setObjectsOfInterestTypes([
    {
        "entityTypeId": 7,
        "entityTypeName": "Ambulance",
        "entityTypeDescription": "Generic Ambulance vehicle",
        "entityTypeParentId": null,
        "entityTypeProperties": [
            {
                "entityTypeId": 7,
                "entityTypePropertyId": 15,
                "entityTypePropertyName": "Ambulance-Type",
                "entityTypePropertyDescription": "type of the ambulance ",
                "entityTypePropertyType": 2
            },
            {
                "entityTypeId": 7,
                "entityTypePropertyId": 19,
                "entityTypePropertyName": "Ambulance-Capacity",
                "entityTypePropertyDescription": "Medical equipment & materials for treating patients, initially 100, decreasing while treating the patients.",
                "entityTypePropertyType": 2
            },
            {
                "entityTypeId": 7,
                "entityTypePropertyId": 21,
                "entityTypePropertyName": "Ambulance-Max speed",
                "entityTypePropertyDescription": " max speed for the vehicle",
                "entityTypePropertyType": 1
            },
            {
                "entityTypeId": 7,
                "entityTypePropertyId": 22,
                "entityTypePropertyName": "Ambulance-Given speed",
                "entityTypePropertyDescription": "speed (given by an operator/commander)",
                "entityTypePropertyType": 1
            },
            {
                "entityTypeId": 7,
                "entityTypePropertyId": 28,
                "entityTypePropertyName": "Ambulance-Max patients",
                "entityTypePropertyDescription": "max # of patients transported by the ambulance",
                "entityTypePropertyType": 1
            },
            {
                "entityTypeId": 7,
                "entityTypePropertyId": 29,
                "entityTypePropertyName": "Ambulance-Num of patients",
                "entityTypePropertyDescription": "# of patients currently in the ambulance",
                "entityTypePropertyType": 1
            },
            {
                "entityTypeId": 7,
                "entityTypePropertyId": 30,
                "entityTypePropertyName": "Ambulance-Health increase percent",
                "entityTypePropertyDescription": "the improvement rate of patients’ \"life%\" in 10 minutes",
                "entityTypePropertyType": 1
            },
            {
                "entityTypeId": 7,
                "entityTypePropertyId": 31,
                "entityTypePropertyName": "Ambulance-Target arrival time",
                "entityTypePropertyDescription": "The time, needed to cover the distance to the next target point (i.e. not only to the Patient, but also to the Hospital, back to the Ambulance Station, etc).",
                "entityTypePropertyType": 7
            }
        ]
    },
    {
        "entityTypeId": 8,
        "entityTypeName": "Ambulance Station",
        "entityTypeDescription": "Generic Ambulance Station Building",
        "entityTypeParentId": null,
        "entityTypeProperties": [
            {
                "entityTypeId": 8,
                "entityTypePropertyId": 32,
                "entityTypePropertyName": "Ambulance Station-Number of ambulances",
                "entityTypePropertyDescription": "total # of ambulances in a station",
                "entityTypePropertyType": 1
            },
            {
                "entityTypeId": 8,
                "entityTypePropertyId": 34,
                "entityTypePropertyName": "Ambulance Station-Ambulances in station\t",
                "entityTypePropertyDescription": " a # of “ready to go�? ambulances in a station",
                "entityTypePropertyType": 1
            },
            {
                "entityTypeId": 8,
                "entityTypePropertyId": 37,
                "entityTypePropertyName": " Ambulance Station-To be expelled",
                "entityTypePropertyDescription": " a # of initially deployed ambulances (sent to a place of accident)",
                "entityTypePropertyType": 1
            }
        ]
    },
    {
        "entityTypeId": 9,
        "entityTypeName": "Hospital",
        "entityTypeDescription": "Generic Ambulance Hospital Building",
        "entityTypeParentId": null,
        "entityTypeProperties": [
            {
                "entityTypeId": 9,
                "entityTypePropertyId": 38,
                "entityTypePropertyName": "Hospital-Number of total beds",
                "entityTypePropertyDescription": "total # of beds in the hospital",
                "entityTypePropertyType": 1
            },
            {
                "entityTypeId": 9,
                "entityTypePropertyId": 39,
                "entityTypePropertyName": "Hospital-Number of free beds\t",
                "entityTypePropertyDescription": "# of free beds in the hospital (capacity for new patients)",
                "entityTypePropertyType": 1
            },
            {
                "entityTypeId": 9,
                "entityTypePropertyId": 40,
                "entityTypePropertyName": "Hospital- Health increase percent",
                "entityTypePropertyDescription": "# of free beds in the hospital (capacity for new patients)",
                "entityTypePropertyType": 1
            }
        ]
    },
    {
        "entityTypeId": 10,
        "entityTypeName": "Patient ",
        "entityTypeDescription": "Generic Patient Human",
        "entityTypeParentId": null,
        "entityTypeProperties": [
            {
                "entityTypeId": 10,
                "entityTypePropertyId": 41,
                "entityTypePropertyName": "Patient-id",
                "entityTypePropertyDescription": "a unique identifier, ",
                "entityTypePropertyType": 2
            },
            {
                "entityTypeId": 10,
                "entityTypePropertyId": 42,
                "entityTypePropertyName": "Patient-life",
                "entityTypePropertyDescription": "Patient’s \"life%\"",
                "entityTypePropertyType": 1
            },
            {
                "entityTypeId": 10,
                "entityTypePropertyId": 43,
                "entityTypePropertyName": "Patient-category",
                "entityTypePropertyDescription": "Patient’s \"category\" - \"young\", \"elderly\", \"short\", etc",
                "entityTypePropertyType": 2
            },
            {
                "entityTypeId": 10,
                "entityTypePropertyId": 44,
                "entityTypePropertyName": "Patient-place",
                "entityTypePropertyDescription": "Patient’s location. \"zone\", \"ambulance\", \"hospital\", \"healthy\", “dead�?",
                "entityTypePropertyType": 2
            },
            {
                "entityTypeId": 10,
                "entityTypePropertyId": 45,
                "entityTypePropertyName": "Patient-Place_id",
                "entityTypePropertyDescription": "and identifier for Patient’s location",
                "entityTypePropertyType": 2
            },
            {
                "entityTypeId": 10,
                "entityTypePropertyId": 46,
                "entityTypePropertyName": "Patient-Lifechangetime",
                "entityTypePropertyDescription": "virtual time, when the Patient’s “life%�? was checked/recalculated",
                "entityTypePropertyType": 3
            },
            {
                "entityTypeId": 10,
                "entityTypePropertyId": 47,
                "entityTypePropertyName": "Patient-Placechangetime",
                "entityTypePropertyDescription": "virtual time, when the Patient’s location (or status) changed (including when died or treated 100% healthy)",
                "entityTypePropertyType": 3
            }
        ]
    },
    {
        "entityTypeId": 11,
        "entityTypeName": "Incident",
        "entityTypeDescription": "Generic Incident Zone - Represent the incident zone as a red circle on the map",
        "entityTypeParentId": null,
        "entityTypeProperties": [
            {
                "entityTypeId": 11,
                "entityTypePropertyId": 48,
                "entityTypePropertyName": "Incident-Number of patients",
                "entityTypePropertyDescription": "number of Patients in the zone ",
                "entityTypePropertyType": 1
            },
            {
                "entityTypeId": 11,
                "entityTypePropertyId": 49,
                "entityTypePropertyName": "Incident-Health decrease percent",
                "entityTypePropertyDescription": "life% decay in 10 minutes.",
                "entityTypePropertyType": 1
            }
        ]
    },
    {
        "entityTypeId": 12,
        "entityTypeName": "Indicator Results",
        "entityTypeDescription": "Holds indicator result",
        "entityTypeParentId": null,
        "entityTypeProperties": [
            {
                "entityTypeId": 12,
                "entityTypePropertyId": 60,
                "entityTypePropertyName": "Indicator-Results-Patients-health",
                "entityTypePropertyDescription": "JSON represent Patients-health",
                "entityTypePropertyType": 2
            }
        ]
    },
    {
        "entityTypeId": 13,
        "entityTypeName": "Simulation Setup",
        "entityTypeDescription": "Represent Incident configuration info",
        "entityTypeParentId": null,
        "entityTypeProperties": []
    },
    {
        "entityTypeId": 14,
        "entityTypeName": "Area",
        "entityTypeDescription": "Generic Geographic Area",
        "entityTypeParentId": null,
        "entityTypeProperties": [
            {
                "entityTypeId": 14,
                "entityTypePropertyId": 54,
                "entityTypePropertyName": "Area-Category",
                "entityTypePropertyDescription": "Area Category - \"incident\", \"staging\", etc",
                "entityTypePropertyType": 2
            }
        ]
    },
    {
        "entityTypeId": 1000,
        "entityTypeName": "CDM zone",
        "entityTypeDescription": "This is a description",
        "entityTypeParentId": null,
        "entityTypeProperties": [
            {
                "entityTypeId": 1000,
                "entityTypePropertyId": 1001,
                "entityTypePropertyName": "Required ressources",
                "entityTypePropertyDescription": "Ressources required to start working. E.g. \"2 ambulances\"",
                "entityTypePropertyType": 2
            },
            {
                "entityTypeId": 1000,
                "entityTypePropertyId": 1002,
                "entityTypePropertyName": "setup time",
                "entityTypePropertyDescription": "time needed to set up the area once the ressources arrive.",
                "entityTypePropertyType": 1
            },
            {
                "entityTypeId": 1000,
                "entityTypePropertyId": 1003,
                "entityTypePropertyName": "input",
                "entityTypePropertyDescription": "what does this area accept? It's people:any or people:* or patients:any I guess",
                "entityTypePropertyType": 2
            },
            {
                "entityTypeId": 1000,
                "entityTypePropertyId": 1004,
                "entityTypePropertyName": "output",
                "entityTypePropertyDescription": "Fun",
                "entityTypePropertyType": 2
            }
        ]
    },
    {
        "entityTypeId": 1111,
        "entityTypeName": "My OOI",
        "entityTypeDescription": "Just a test",
        "entityTypeParentId": null,
        "entityTypeProperties": [
            {
                "entityTypeId": 1111,
                "entityTypePropertyId": 1234,
                "entityTypePropertyName": "Aaabbb",
                "entityTypePropertyDescription": "Aaa",
                "entityTypePropertyType": 2
            },
            {
                "entityTypeId": 1111,
                "entityTypePropertyId": 11111,
                "entityTypePropertyName": "My Property 1",
                "entityTypePropertyDescription": "My Property 1",
                "entityTypePropertyType": 1
            }
        ]
    }
]);
setObjectsOfInterest([
    {
        "entityId": 1,
        "entityTypeId": 7,
        "entityName": "Ambulance-1",
        "entityDescription": "Description of Ambulance-1",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3815,
                "entityId": 1,
                "entityTypePropertyId": 15,
                "entityPropertyValue": "Basic",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3816,
                "entityId": 1,
                "entityTypePropertyId": 19,
                "entityPropertyValue": "100",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3817,
                "entityId": 1,
                "entityTypePropertyId": 21,
                "entityPropertyValue": "80",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3818,
                "entityId": 1,
                "entityTypePropertyId": 28,
                "entityPropertyValue": "2",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3819,
                "entityId": 1,
                "entityTypePropertyId": 22,
                "entityPropertyValue": "40",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3820,
                "entityId": 1,
                "entityTypePropertyId": 29,
                "entityPropertyValue": "0",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3821,
                "entityId": 1,
                "entityTypePropertyId": 30,
                "entityPropertyValue": "1",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3822,
                "entityId": 1,
                "entityTypePropertyId": 31,
                "entityPropertyValue": "0",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": [
            {
                "entityId": 1,
                "worldStateId": 17,
                "geometry": {
                    "geometry": {
                        "coordinateSystemId": 4326,
                        "wellKnownText": "POINT (31.77068 34.62826)"
                    }
                }
            }
        ]
    },
    {
        "entityId": 2,
        "entityTypeId": 7,
        "entityName": "Ambulance-2",
        "entityDescription": "Description of Ambulance-2",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3823,
                "entityId": 2,
                "entityTypePropertyId": 15,
                "entityPropertyValue": "Basic",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3824,
                "entityId": 2,
                "entityTypePropertyId": 19,
                "entityPropertyValue": "100",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3825,
                "entityId": 2,
                "entityTypePropertyId": 21,
                "entityPropertyValue": "80",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3826,
                "entityId": 2,
                "entityTypePropertyId": 28,
                "entityPropertyValue": "2",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3827,
                "entityId": 2,
                "entityTypePropertyId": 22,
                "entityPropertyValue": "40",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3828,
                "entityId": 2,
                "entityTypePropertyId": 29,
                "entityPropertyValue": "0",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3829,
                "entityId": 2,
                "entityTypePropertyId": 30,
                "entityPropertyValue": "1",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3830,
                "entityId": 2,
                "entityTypePropertyId": 31,
                "entityPropertyValue": "0",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": [
            {
                "entityId": 2,
                "worldStateId": 17,
                "geometry": {
                    "geometry": {
                        "coordinateSystemId": 4326,
                        "wellKnownText": "POINT (31.77068 34.62869)"
                    }
                }
            }
        ]
    },
    {
        "entityId": 3,
        "entityTypeId": 7,
        "entityName": "Ambulance-3",
        "entityDescription": "Description of Ambulance-3",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3831,
                "entityId": 3,
                "entityTypePropertyId": 15,
                "entityPropertyValue": "Basic",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3832,
                "entityId": 3,
                "entityTypePropertyId": 19,
                "entityPropertyValue": "100",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3833,
                "entityId": 3,
                "entityTypePropertyId": 21,
                "entityPropertyValue": "80",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3834,
                "entityId": 3,
                "entityTypePropertyId": 28,
                "entityPropertyValue": "2",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3835,
                "entityId": 3,
                "entityTypePropertyId": 22,
                "entityPropertyValue": "40",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3836,
                "entityId": 3,
                "entityTypePropertyId": 29,
                "entityPropertyValue": "0",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3837,
                "entityId": 3,
                "entityTypePropertyId": 30,
                "entityPropertyValue": "1",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3838,
                "entityId": 3,
                "entityTypePropertyId": 31,
                "entityPropertyValue": "0",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": [
            {
                "entityId": 3,
                "worldStateId": 17,
                "geometry": {
                    "geometry": {
                        "coordinateSystemId": 4326,
                        "wellKnownText": "POINT (31.77093 34.62802)"
                    }
                }
            }
        ]
    },
    {
        "entityId": 4,
        "entityTypeId": 8,
        "entityName": "Ambulance Station-1",
        "entityDescription": "Description of Ambulance Station-1",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3812,
                "entityId": 4,
                "entityTypePropertyId": 32,
                "entityPropertyValue": "3",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3813,
                "entityId": 4,
                "entityTypePropertyId": 34,
                "entityPropertyValue": "3",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3814,
                "entityId": 4,
                "entityTypePropertyId": 37,
                "entityPropertyValue": "3",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": [
            {
                "entityId": 4,
                "worldStateId": 17,
                "geometry": {
                    "geometry": {
                        "coordinateSystemId": 4326,
                        "wellKnownText": "POINT (31.77068 34.62826)"
                    }
                }
            }
        ]
    },
    {
        "entityId": 5,
        "entityTypeId": 9,
        "entityName": "Hospital-1",
        "entityDescription": "Description of Hospital-1",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3839,
                "entityId": 5,
                "entityTypePropertyId": 39,
                "entityPropertyValue": "100",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3840,
                "entityId": 5,
                "entityTypePropertyId": 40,
                "entityPropertyValue": "10",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3841,
                "entityId": 5,
                "entityTypePropertyId": 38,
                "entityPropertyValue": "100",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": [
            {
                "entityId": 5,
                "worldStateId": 17,
                "geometry": {
                    "geometry": {
                        "coordinateSystemId": 4326,
                        "wellKnownText": "POINT (31.77384 34.64444)"
                    }
                }
            }
        ]
    },
    {
        "entityId": 6,
        "entityTypeId": 10,
        "entityName": "Patient-1",
        "entityDescription": "Description of Patient-1",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3842,
                "entityId": 6,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient001",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3843,
                "entityId": 6,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "youngster",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3844,
                "entityId": 6,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "89",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3845,
                "entityId": 6,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3846,
                "entityId": 6,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3847,
                "entityId": 6,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3848,
                "entityId": 6,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 7,
        "entityTypeId": 10,
        "entityName": "Patient-2",
        "entityDescription": "Description of Patient-2",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3849,
                "entityId": 7,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient002",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3850,
                "entityId": 7,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3851,
                "entityId": 7,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "85",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3852,
                "entityId": 7,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3853,
                "entityId": 7,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3854,
                "entityId": 7,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3855,
                "entityId": 7,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 8,
        "entityTypeId": 10,
        "entityName": "Patient-3",
        "entityDescription": "Description of Patient-3",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3856,
                "entityId": 8,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient003",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3857,
                "entityId": 8,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "youngster",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3858,
                "entityId": 8,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "67",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3859,
                "entityId": 8,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3860,
                "entityId": 8,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3861,
                "entityId": 8,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3862,
                "entityId": 8,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 9,
        "entityTypeId": 10,
        "entityName": "Patient-4",
        "entityDescription": "Description of Patient-4",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3863,
                "entityId": 9,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient004",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3864,
                "entityId": 9,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "short",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3865,
                "entityId": 9,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "73",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3866,
                "entityId": 9,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3867,
                "entityId": 9,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3868,
                "entityId": 9,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3869,
                "entityId": 9,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 10,
        "entityTypeId": 10,
        "entityName": "Patient-5",
        "entityDescription": "Description of Patient-5",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3870,
                "entityId": 10,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient005",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3871,
                "entityId": 10,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "elderly",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3872,
                "entityId": 10,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "65",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3873,
                "entityId": 10,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3874,
                "entityId": 10,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3875,
                "entityId": 10,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3876,
                "entityId": 10,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 11,
        "entityTypeId": 10,
        "entityName": "Patient-6",
        "entityDescription": "Description of Patient-6",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3877,
                "entityId": 11,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient006",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3878,
                "entityId": 11,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3879,
                "entityId": 11,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "46",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3880,
                "entityId": 11,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3881,
                "entityId": 11,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3882,
                "entityId": 11,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3883,
                "entityId": 11,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 12,
        "entityTypeId": 10,
        "entityName": "Patient-7",
        "entityDescription": "Description of Patient-7",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3884,
                "entityId": 12,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient007",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3885,
                "entityId": 12,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3886,
                "entityId": 12,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "74",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3887,
                "entityId": 12,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3888,
                "entityId": 12,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3889,
                "entityId": 12,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3890,
                "entityId": 12,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 13,
        "entityTypeId": 10,
        "entityName": "Patient-8",
        "entityDescription": "Description of Patient-8",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3891,
                "entityId": 13,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient008",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3892,
                "entityId": 13,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "youngster",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3893,
                "entityId": 13,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "85",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3894,
                "entityId": 13,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3895,
                "entityId": 13,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3896,
                "entityId": 13,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3897,
                "entityId": 13,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 14,
        "entityTypeId": 10,
        "entityName": "Patient-9",
        "entityDescription": "Description of Patient-9",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3898,
                "entityId": 14,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient009",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3899,
                "entityId": 14,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3900,
                "entityId": 14,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "52",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3901,
                "entityId": 14,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3902,
                "entityId": 14,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3903,
                "entityId": 14,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3904,
                "entityId": 14,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 15,
        "entityTypeId": 10,
        "entityName": "Patient-10",
        "entityDescription": "Description of Patient-10",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3905,
                "entityId": 15,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient010",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3906,
                "entityId": 15,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "short",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3907,
                "entityId": 15,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "61",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3908,
                "entityId": 15,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3909,
                "entityId": 15,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3910,
                "entityId": 15,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3911,
                "entityId": 15,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 16,
        "entityTypeId": 10,
        "entityName": "Patient-11",
        "entityDescription": "Description of Patient-11",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3912,
                "entityId": 16,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient011",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3913,
                "entityId": 16,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3914,
                "entityId": 16,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "81",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3915,
                "entityId": 16,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3916,
                "entityId": 16,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3917,
                "entityId": 16,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3918,
                "entityId": 16,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 17,
        "entityTypeId": 10,
        "entityName": "Patient-12",
        "entityDescription": "Description of Patient-12",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3919,
                "entityId": 17,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient012",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3920,
                "entityId": 17,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3921,
                "entityId": 17,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "60",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3922,
                "entityId": 17,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3923,
                "entityId": 17,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3924,
                "entityId": 17,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3925,
                "entityId": 17,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 18,
        "entityTypeId": 10,
        "entityName": "Patient-13",
        "entityDescription": "Description of Patient-13",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3926,
                "entityId": 18,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient013",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3927,
                "entityId": 18,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3928,
                "entityId": 18,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "65",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3929,
                "entityId": 18,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3930,
                "entityId": 18,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3931,
                "entityId": 18,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3932,
                "entityId": 18,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 19,
        "entityTypeId": 10,
        "entityName": "Patient-14",
        "entityDescription": "Description of Patient-14",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3933,
                "entityId": 19,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient014",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3934,
                "entityId": 19,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "elderly",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3935,
                "entityId": 19,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "67",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3936,
                "entityId": 19,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3937,
                "entityId": 19,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3938,
                "entityId": 19,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3939,
                "entityId": 19,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 20,
        "entityTypeId": 10,
        "entityName": "Patient-15",
        "entityDescription": "Description of Patient-15",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3940,
                "entityId": 20,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient015",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3941,
                "entityId": 20,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "youngster",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3942,
                "entityId": 20,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "88",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3943,
                "entityId": 20,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3944,
                "entityId": 20,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3945,
                "entityId": 20,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3946,
                "entityId": 20,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 21,
        "entityTypeId": 10,
        "entityName": "Patient-16",
        "entityDescription": "Description of Patient-16",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3947,
                "entityId": 21,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient016",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3948,
                "entityId": 21,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3949,
                "entityId": 21,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "85",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3950,
                "entityId": 21,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3951,
                "entityId": 21,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3952,
                "entityId": 21,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3953,
                "entityId": 21,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 22,
        "entityTypeId": 10,
        "entityName": "Patient-17",
        "entityDescription": "Description of Patient-17",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3954,
                "entityId": 22,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient017",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3955,
                "entityId": 22,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3956,
                "entityId": 22,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "71",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3957,
                "entityId": 22,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3958,
                "entityId": 22,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3959,
                "entityId": 22,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3960,
                "entityId": 22,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 23,
        "entityTypeId": 10,
        "entityName": "Patient-18",
        "entityDescription": "Description of Patient-18",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3961,
                "entityId": 23,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient018",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3962,
                "entityId": 23,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3963,
                "entityId": 23,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "44",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3964,
                "entityId": 23,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3965,
                "entityId": 23,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3966,
                "entityId": 23,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3967,
                "entityId": 23,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 24,
        "entityTypeId": 10,
        "entityName": "Patient-19",
        "entityDescription": "Description of Patient-19",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3968,
                "entityId": 24,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient019",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3969,
                "entityId": 24,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "elderly",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3970,
                "entityId": 24,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "67",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3971,
                "entityId": 24,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3972,
                "entityId": 24,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3973,
                "entityId": 24,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3974,
                "entityId": 24,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 25,
        "entityTypeId": 10,
        "entityName": "Patient-20",
        "entityDescription": "Description of Patient-20",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3975,
                "entityId": 25,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient020",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3976,
                "entityId": 25,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "elderly",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3977,
                "entityId": 25,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "81",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3978,
                "entityId": 25,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3979,
                "entityId": 25,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3980,
                "entityId": 25,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3981,
                "entityId": 25,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 26,
        "entityTypeId": 10,
        "entityName": "Patient-21",
        "entityDescription": "Description of Patient-21",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3982,
                "entityId": 26,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient021",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3983,
                "entityId": 26,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3984,
                "entityId": 26,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "86",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3985,
                "entityId": 26,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3986,
                "entityId": 26,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3987,
                "entityId": 26,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3988,
                "entityId": 26,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 27,
        "entityTypeId": 10,
        "entityName": "Patient-22",
        "entityDescription": "Description of Patient-22",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3989,
                "entityId": 27,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient022",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3990,
                "entityId": 27,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "elderly",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3991,
                "entityId": 27,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "42",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3992,
                "entityId": 27,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3993,
                "entityId": 27,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3994,
                "entityId": 27,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3995,
                "entityId": 27,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 28,
        "entityTypeId": 10,
        "entityName": "Patient-23",
        "entityDescription": "Description of Patient-23",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3996,
                "entityId": 28,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient023",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3997,
                "entityId": 28,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "short",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3998,
                "entityId": 28,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "74",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3999,
                "entityId": 28,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4000,
                "entityId": 28,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4001,
                "entityId": 28,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4002,
                "entityId": 28,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 29,
        "entityTypeId": 10,
        "entityName": "Patient-24",
        "entityDescription": "Description of Patient-24",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4003,
                "entityId": 29,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient024",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4004,
                "entityId": 29,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "short",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4005,
                "entityId": 29,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "64",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4006,
                "entityId": 29,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4007,
                "entityId": 29,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4008,
                "entityId": 29,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4009,
                "entityId": 29,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 30,
        "entityTypeId": 10,
        "entityName": "Patient-25",
        "entityDescription": "Description of Patient-25",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4010,
                "entityId": 30,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient025",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4011,
                "entityId": 30,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "youngster",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4012,
                "entityId": 30,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "61",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4013,
                "entityId": 30,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4014,
                "entityId": 30,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4015,
                "entityId": 30,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4016,
                "entityId": 30,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 31,
        "entityTypeId": 10,
        "entityName": "Patient-26",
        "entityDescription": "Description of Patient-26",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4017,
                "entityId": 31,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient026",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4018,
                "entityId": 31,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "short",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4019,
                "entityId": 31,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "79",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4020,
                "entityId": 31,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4021,
                "entityId": 31,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4022,
                "entityId": 31,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4023,
                "entityId": 31,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 32,
        "entityTypeId": 10,
        "entityName": "Patient-27",
        "entityDescription": "Description of Patient-27",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4024,
                "entityId": 32,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient027",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4025,
                "entityId": 32,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "youngster",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4026,
                "entityId": 32,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "85",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4027,
                "entityId": 32,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4028,
                "entityId": 32,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4029,
                "entityId": 32,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4030,
                "entityId": 32,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 33,
        "entityTypeId": 10,
        "entityName": "Patient-28",
        "entityDescription": "Description of Patient-28",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4031,
                "entityId": 33,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient028",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4032,
                "entityId": 33,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "youngster",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4033,
                "entityId": 33,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "56",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4034,
                "entityId": 33,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4035,
                "entityId": 33,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4036,
                "entityId": 33,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4037,
                "entityId": 33,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 34,
        "entityTypeId": 10,
        "entityName": "Patient-29",
        "entityDescription": "Description of Patient-29",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4038,
                "entityId": 34,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient029",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4039,
                "entityId": 34,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "youngster",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4040,
                "entityId": 34,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "60",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4041,
                "entityId": 34,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4042,
                "entityId": 34,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4043,
                "entityId": 34,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4044,
                "entityId": 34,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 35,
        "entityTypeId": 10,
        "entityName": "Patient-30",
        "entityDescription": "Description of Patient-30",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4045,
                "entityId": 35,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient030",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4046,
                "entityId": 35,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4047,
                "entityId": 35,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "68",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4048,
                "entityId": 35,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4049,
                "entityId": 35,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4050,
                "entityId": 35,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4051,
                "entityId": 35,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 36,
        "entityTypeId": 10,
        "entityName": "Patient-31",
        "entityDescription": "Description of Patient-31",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4052,
                "entityId": 36,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient031",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4053,
                "entityId": 36,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "youngster",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4054,
                "entityId": 36,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "76",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4055,
                "entityId": 36,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4056,
                "entityId": 36,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4057,
                "entityId": 36,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4058,
                "entityId": 36,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 37,
        "entityTypeId": 10,
        "entityName": "Patient-32",
        "entityDescription": "Description of Patient-32",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4059,
                "entityId": 37,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient032",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4060,
                "entityId": 37,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "elderly",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4061,
                "entityId": 37,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "68",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4062,
                "entityId": 37,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4063,
                "entityId": 37,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4064,
                "entityId": 37,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4065,
                "entityId": 37,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 38,
        "entityTypeId": 10,
        "entityName": "Patient-33",
        "entityDescription": "Description of Patient-33",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4066,
                "entityId": 38,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient033",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4067,
                "entityId": 38,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4068,
                "entityId": 38,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "42",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4069,
                "entityId": 38,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4070,
                "entityId": 38,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4071,
                "entityId": 38,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4072,
                "entityId": 38,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 39,
        "entityTypeId": 10,
        "entityName": "Patient-34",
        "entityDescription": "Description of Patient-34",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4073,
                "entityId": 39,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient034",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4074,
                "entityId": 39,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "elderly",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4075,
                "entityId": 39,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "52",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4076,
                "entityId": 39,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4077,
                "entityId": 39,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4078,
                "entityId": 39,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4079,
                "entityId": 39,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 40,
        "entityTypeId": 10,
        "entityName": "Patient-35",
        "entityDescription": "Description of Patient-35",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4080,
                "entityId": 40,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient035",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4081,
                "entityId": 40,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4082,
                "entityId": 40,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "87",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4083,
                "entityId": 40,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4084,
                "entityId": 40,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4085,
                "entityId": 40,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4086,
                "entityId": 40,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 41,
        "entityTypeId": 10,
        "entityName": "Patient-36",
        "entityDescription": "Description of Patient-36",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4087,
                "entityId": 41,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient036",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4088,
                "entityId": 41,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "elderly",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4089,
                "entityId": 41,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "56",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4090,
                "entityId": 41,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4091,
                "entityId": 41,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4092,
                "entityId": 41,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4093,
                "entityId": 41,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 42,
        "entityTypeId": 10,
        "entityName": "Patient-37",
        "entityDescription": "Description of Patient-37",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4094,
                "entityId": 42,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient037",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4095,
                "entityId": 42,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4096,
                "entityId": 42,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "67",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4097,
                "entityId": 42,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4098,
                "entityId": 42,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4099,
                "entityId": 42,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4100,
                "entityId": 42,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 43,
        "entityTypeId": 10,
        "entityName": "Patient-38",
        "entityDescription": "Description of Patient-38",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4101,
                "entityId": 43,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient038",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4102,
                "entityId": 43,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "elderly",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4103,
                "entityId": 43,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "80",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4104,
                "entityId": 43,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4105,
                "entityId": 43,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4106,
                "entityId": 43,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4107,
                "entityId": 43,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 44,
        "entityTypeId": 10,
        "entityName": "Patient-39",
        "entityDescription": "Description of Patient-39",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4108,
                "entityId": 44,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient039",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4109,
                "entityId": 44,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "elderly",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4110,
                "entityId": 44,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "82",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4111,
                "entityId": 44,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4112,
                "entityId": 44,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4113,
                "entityId": 44,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4114,
                "entityId": 44,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 45,
        "entityTypeId": 10,
        "entityName": "Patient-40",
        "entityDescription": "Description of Patient-40",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4115,
                "entityId": 45,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient040",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4116,
                "entityId": 45,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "youngster",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4117,
                "entityId": 45,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "53",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4118,
                "entityId": 45,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4119,
                "entityId": 45,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4120,
                "entityId": 45,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4121,
                "entityId": 45,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 46,
        "entityTypeId": 10,
        "entityName": "Patient-41",
        "entityDescription": "Description of Patient-41",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4122,
                "entityId": 46,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient041",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4123,
                "entityId": 46,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "youngster",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4124,
                "entityId": 46,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "89",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4125,
                "entityId": 46,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4126,
                "entityId": 46,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4127,
                "entityId": 46,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4128,
                "entityId": 46,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 47,
        "entityTypeId": 10,
        "entityName": "Patient-42",
        "entityDescription": "Description of Patient-42",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4129,
                "entityId": 47,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient042",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4130,
                "entityId": 47,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "elderly",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4131,
                "entityId": 47,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "74",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4132,
                "entityId": 47,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4133,
                "entityId": 47,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4134,
                "entityId": 47,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4135,
                "entityId": 47,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 48,
        "entityTypeId": 10,
        "entityName": "Patient-43",
        "entityDescription": "Description of Patient-43",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4136,
                "entityId": 48,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient043",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4137,
                "entityId": 48,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4138,
                "entityId": 48,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "43",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4139,
                "entityId": 48,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4140,
                "entityId": 48,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4141,
                "entityId": 48,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4142,
                "entityId": 48,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 49,
        "entityTypeId": 10,
        "entityName": "Patient-44",
        "entityDescription": "Description of Patient-44",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4143,
                "entityId": 49,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient044",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4144,
                "entityId": 49,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4145,
                "entityId": 49,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "78",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4146,
                "entityId": 49,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4147,
                "entityId": 49,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4148,
                "entityId": 49,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4149,
                "entityId": 49,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 50,
        "entityTypeId": 10,
        "entityName": "Patient-45",
        "entityDescription": "Description of Patient-45",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4150,
                "entityId": 50,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient045",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4151,
                "entityId": 50,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4152,
                "entityId": 50,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "65",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4153,
                "entityId": 50,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4154,
                "entityId": 50,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4155,
                "entityId": 50,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4156,
                "entityId": 50,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 51,
        "entityTypeId": 10,
        "entityName": "Patient-46",
        "entityDescription": "Description of Patient-46",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4157,
                "entityId": 51,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient046",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4158,
                "entityId": 51,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4159,
                "entityId": 51,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "40",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4160,
                "entityId": 51,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4161,
                "entityId": 51,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4162,
                "entityId": 51,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4163,
                "entityId": 51,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 52,
        "entityTypeId": 10,
        "entityName": "Patient-47",
        "entityDescription": "Description of Patient-47",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4164,
                "entityId": 52,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient047",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4165,
                "entityId": 52,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4166,
                "entityId": 52,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "88",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4167,
                "entityId": 52,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4168,
                "entityId": 52,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4169,
                "entityId": 52,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4170,
                "entityId": 52,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 53,
        "entityTypeId": 10,
        "entityName": "Patient-48",
        "entityDescription": "Description of Patient-48",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4171,
                "entityId": 53,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient048",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4172,
                "entityId": 53,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "normal",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4173,
                "entityId": 53,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "46",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4174,
                "entityId": 53,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4175,
                "entityId": 53,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4176,
                "entityId": 53,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4177,
                "entityId": 53,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 54,
        "entityTypeId": 10,
        "entityName": "Patient-49",
        "entityDescription": "Description of Patient-49",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4178,
                "entityId": 54,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient049",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4179,
                "entityId": 54,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "short",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4180,
                "entityId": 54,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "82",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4181,
                "entityId": 54,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4182,
                "entityId": 54,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4183,
                "entityId": 54,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4184,
                "entityId": 54,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 55,
        "entityTypeId": 10,
        "entityName": "Patient-50",
        "entityDescription": "Description of Patient-50",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 4185,
                "entityId": 55,
                "entityTypePropertyId": 41,
                "entityPropertyValue": "Patient050",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4186,
                "entityId": 55,
                "entityTypePropertyId": 43,
                "entityPropertyValue": "short",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4187,
                "entityId": 55,
                "entityTypePropertyId": 42,
                "entityPropertyValue": "51",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4188,
                "entityId": 55,
                "entityTypePropertyId": 44,
                "entityPropertyValue": "zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4189,
                "entityId": 55,
                "entityTypePropertyId": 45,
                "entityPropertyValue": "Red Zone",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4190,
                "entityId": 55,
                "entityTypePropertyId": 46,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 4191,
                "entityId": 55,
                "entityTypePropertyId": 47,
                "entityPropertyValue": "1.01.0001 0:00:00",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 56,
        "entityTypeId": 11,
        "entityName": "Incident -1",
        "entityDescription": "Description of Incident -1",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 3810,
                "entityId": 56,
                "entityTypePropertyId": 48,
                "entityPropertyValue": "50",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 3811,
                "entityId": 56,
                "entityTypePropertyId": 49,
                "entityPropertyValue": "1",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": [
            {
                "entityId": 56,
                "worldStateId": 17,
                "geometry": {
                    "geometry": {
                        "coordinateSystemId": 4326,
                        "wellKnownText": "POINT (31.80027 34.64723)"
                    }
                }
            }
        ]
    },
    {
        "entityId": 100,
        "entityTypeId": 14,
        "entityName": "Area-1",
        "entityDescription": "Description of Area 1",
        "entityInstancesProperties": [],
        "entityInstancesGeometry": []
    },
    {
        "entityId": 101,
        "entityTypeId": 12,
        "entityName": "Indicators OOI",
        "entityDescription": "Hold Indicators data per WS",
        "entityInstancesProperties": [
            {
                "entityPropertyId": 55390,
                "entityId": 101,
                "entityTypePropertyId": 60,
                "entityPropertyValue": "{'dead': 0, 'sum': 50, 'green': 10, 'red': 7, 'yellow': 33}",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            },
            {
                "entityPropertyId": 55391,
                "entityId": 101,
                "entityTypePropertyId": 60,
                "entityPropertyValue": "{'dead': 0, 'sum': 50, 'green': 10, 'red': 7, 'yellow': 33}",
                "worldStateId": 17,
                "entityTypeProperty": null,
                "worldState": null
            }
        ],
        "entityInstancesGeometry": []
    }
]);