(function () {

    'use strict';

    var pushIndicatorFilter = function pushIndicatorFilter() {

        var filterArray = [
			{
				id: 'Last_Evacuated',
				color: '#7094B8',
				enabled: false,
				displayText: "Mission"
			},
			{
				id: 'BuildingAreas',
				color: '#b2b2b2',
				enabled: false,
				displayText: "Spatial Planning"
			},
			{
				id: 'In_Pre-Triaged',
				color: '#b2b2b2',
				enabled: false,
				displayText: "Pre-Triage"
			},
			{
				id: 'In_Triaged',
				color: '#b2b2b2',
				enabled: false,
				displayText: "Triage"
			},
			{
				id: 'In_Treated',
				color: '#b2b2b2',
				enabled: false,
				displayText: "Treatment"
			},
			{
				id: 'In_Evacuating',
				color: '#b2b2b2',
				enabled: false,
				displayText: "Evacuation"
			},
			{
				id: 'In_Evacuated',
				color: '#b2b2b2',
				enabled: false,
				displayText: "Hospitals & Shelter"
			},
		];
		//Push the data through the wiring
		if (typeof MashupPlatform !== 'undefined') {
			console.log(JSON.stringify(filterArray));
			MashupPlatform.wiring.pushEvent('indicator_filter', JSON.stringify(filterArray));
		} else {
			console.warn('Wirecloud was not detected. Logging indicators into the JS console instead.');
			console.log(JSON.stringify(filterArray));
		}
    };

    // MashupPlatform.prefs.registerCallback(pushIndicatorFilter);

    // Start the execution
    pushIndicatorFilter();

})();