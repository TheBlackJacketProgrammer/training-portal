kelin.controller("ctrl_main",function ($scope, $http,) {
    $scope.load_view = function()
    {
        $http({
            method: "POST",
            url: url + "loadview"
        }).then(function successCallback(response) {
           $scope.section = response.data["view"];
        });
    }
});
