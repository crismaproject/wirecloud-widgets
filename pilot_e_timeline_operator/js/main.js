(function () {

    'use strict';

    var pushIndicatorFilter = function pushIndicatorFilter() {

        var filterArray = [
			{
				id: 'Last_RED_Evacuated',
				color: '#ff0000',
				enabled: false,
				displayText: "Red Patients (T1)"
			},
			/*
			{
				id: 'First_RED_Pre-Triaged',
				color: '#ff0000',
				enabled: false,
				displayText: "First Pre-Triaged"
			},
			{
				id: 'Last_RED_Pre-Triaged',
				color: '#ff0000',
				enabled: false,
				displayText: "Last Pre-Triaged"
			},
			{
				id: 'In_RED_Pre-Triaged',
				color: '#ff0000',
				enabled: false,
				displayText: "First to last pre-triaged"
			},
			*/
			{
				id: 'First_RED_Treated',
				color: '#b2b2b2',
				enabled: false,
				displayText: "Unaided"
			},
			/*
			{
				id: 'Last_RED_Treated',
				color: '#ff0000',
				enabled: false,
				displayText: "Last Treated"
			},
			*/
			{
				id: 'In_RED_Treated',
				color: '#b2b2b2',
				enabled: false,
				displayText: "Treatment received"
			},
			/*
			{
				id: 'First_RED_Evacuating',
				color: '#ff0000',
				enabled: false,
				displayText: "First Evacuating"
			},
			{
				id: 'Last_RED_Evacuating',
				color: '#ff0000',
				enabled: false,
				displayText: "Last Evacuating"
			},
			*/
			{
				id: 'In_RED_Evacuating',
				color: '#b2b2b2',
				enabled: false,
				displayText: "On evacuation"
			},
			/*
			{
				id: 'First_RED_Evacuated',
				color: '#ff0000',
				enabled: false,
				displayText: "First Evacuated"
			},
			{
				id: 'In_RED_Evacuated',
				color: '#ff0000',
				enabled: false,
				displayText: "First to last evacuated"
			},
			*/
			
			{
				id: 'Last_YELLOW_Evacuated',
				color: '#ffe303',
				enabled: false,
				displayText: "Yellow Patients (T2)"
			},
			/*
			{
				id: 'First_YELLOW_Pre-Triaged',
				color: '#ffff00',
				enabled: false,
				displayText: "First Pre-Triaged"
			},
			{
				id: 'Last_YELLOW_Pre-Triaged',
				color: '#ffff00',
				enabled: false,
				displayText: "Last Pre-Triaged"
			},
			{
				id: 'In_YELLOW_Pre-Triaged',
				color: '#ffff00',
				enabled: false,
				displayText: "First to last pre-triaged"
			},
			*/
			{
				id: 'First_YELLOW_Treated',
				color: '#b2b2b2',
				enabled: false,
				displayText: "Unaided"
			},
			/*
			{
				id: 'Last_YELLOW_Treated',
				color: '#ffff00',
				enabled: false,
				displayText: "Last Treated"
			},
			*/
			{
				id: 'In_YELLOW_Treated',
				color: '#b2b2b2',
				enabled: false,
				displayText: "Treatment received"
			},
			/*
			{
				id: 'First_YELLOW_Evacuating',
				color: '#ffff00',
				enabled: false,
				displayText: "First Evacuating"
			},
			{
				id: 'Last_YELLOW_Evacuating',
				color: '#ffff00',
				enabled: false,
				displayText: "Last Evacuating"
			},
			*/
			{
				id: 'In_YELLOW_Evacuating',
				color: '#b2b2b2',
				enabled: false,
				displayText: "On evacuation"
			},
			/*
			{
				id: 'First_YELLOW_Evacuated',
				color: '#ffff00',
				enabled: false,
				displayText: "First Evacuated"
			},
			{
				id: 'In_YELLOW_Evacuated',
				color: '#ffff00',
				enabled: false,
				displayText: "First to last evacuated"
			},
			*/
			
			{
				id: 'Last_GREEN_Evacuated',
				color: '#00ff00',
				enabled: false,
				displayText: "Green Patients (T3)"
			},
			/*
			{
				id: 'First_GREEN_Pre-Triaged',
				color: '#00ff00',
				enabled: false,
				displayText: "First Pre-Triaged"
			},
			{
				id: 'Last_GREEN_Pre-Triaged',
				color: '#00ff00',
				enabled: false,
				displayText: "Last Pre-Triaged"
			},
			{
				id: 'In_GREEN_Pre-Triaged',
				color: '#00ff00',
				enabled: false,
				displayText: "First to last pre-triaged"
			},
			*/
			{
				id: 'First_GREEN_Treated',
				color: '#b2b2b2',
				enabled: false,
				displayText: "Unaided"
			},
			/*
			{
				id: 'Last_GREEN_Treated',
				color: '#00ff00',
				enabled: false,
				displayText: "Last Treated"
			},
			*/
			{
				id: 'In_GREEN_Treated',
				color: '#b2b2b2',
				enabled: false,
				displayText: "Treatment received"
			},
			/*
			{
				id: 'First_GREEN_Evacuating',
				color: '#00ff00',
				enabled: false,
				displayText: "First Evacuating"
			},
			{
				id: 'Last_GREEN_Evacuating',
				color: '#00ff00',
				enabled: false,
				displayText: "Last Evacuating"
			},
			*/
			{
				id: 'In_GREEN_Evacuating',
				color: '#b2b2b2',
				enabled: false,
				displayText: "On evacuation"
			},
			/*
			{
				id: 'First_GREEN_Evacuated',
				color: '#00ff00',
				enabled: false,
				displayText: "First Evacuated"
			},
			{
				id: 'In_GREEN_Evacuated',
				color: '#00ff00',
				enabled: false,
				displayText: "First to last evacuated"
			},
			*/
			
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