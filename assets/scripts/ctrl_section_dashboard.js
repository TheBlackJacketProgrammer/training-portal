kelin.controller("ctrl_section_dashboard", function ($scope, $http) {

	$scope.module_manageQuiz = function() {
        $http({
            method: "POST",
            url: url + "manage_quiz"
        }).then(function successCallback(response) {
           $scope.module = response.data["view"];
        });
	}

});
