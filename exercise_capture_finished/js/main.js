angular.module('exerciseCaptureFinishedApp', [
			'ngResource',
			'exerciseCaptureFinishedApp.wirecloud',
			'exerciseCaptureFinishedApp.icmm'
	])
    .controller('exerciseCaptureFinishedController', ['$scope', 'wirecloud', 'icmm', '$timeout', function ($scope, wirecloud, icmm, $timeout) {
		$scope.ws_template = null;
		$scope.status = 'initializing';
		
		$scope.load = function() {
			if ($scope.ws_template != null) {
				$scope.status = 'loading';
				wirecloud.send('ws_template_out', $scope.ws_template);
			}
		};
		$scope.finished = function() {
			$scope.status = 'finished';
			wirecloud.send('setEditing', false);
		};
 		wirecloud.on('ws_template_in', function (ws) {
			$scope.ws_template = JSON.parse(ws);
		});
 		wirecloud.on('ws_data', function (ws_data) {
			if ($scope.ws_data == undefined) {
				$scope.ws_data = {
					name: '',
					description: '',
					incidentTime: null,
					referenceTime: null					
				}
			}
			$scope.ws_data = JSON.parse(ws_data);
		});
 		wirecloud.on('isEditing', function (isEditing) {
			if (isEditing && isEditing === 'false' && $scope.ws_template != null) {
				if ($scope.status !== 'editing') {
					wirecloud.send('setEditing', true);
					$scope.status = 'editing';
				}
			}
		});
 		wirecloud.on('dataitem', function (dataitem) {
			if ($scope.ws_template != null) {
				$scope.dataitem = JSON.parse(dataitem);
				// create new icmm worldstate based on the ws_template
				// + append dataitem to new worldstate
				// + store worldstate in icmm as child of ws_template
				// icmm.insertWorldState($scope.ws_template, $scope.ws_data, $scope.dataitem, $scope.ws_template.id);
				icmm.insertWorldState($scope.ws_template, $scope.ws_data, $scope.dataitem, $scope.ws_template.id).then (
					function(status) {
						// worldstate inserted successfully => send event
						wirecloud.send('wsCreated', true);
					}
				);
				$scope.ws_template = null;
			}
		});
   }]);
