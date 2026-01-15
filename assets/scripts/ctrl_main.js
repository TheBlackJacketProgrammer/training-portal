kelin.controller("ctrl_main",function ($scope, $http,) {
    //Load View
    $scope.load_view = function()
    {
        $http({
            method: "POST",
            url: url + "loadview"
        }).then(function successCallback(response) {
           $scope.section = response.data["view"];
        });
    }

    // Authenticate User
    $scope.authenticate = function() {
        
        if($scope.credentials.employeeId == "" || $scope.credentials.password == "") {
            toastr.error("Please fill in all fields");
            return;
        }

        $("html").addClass("loading");
        $http({
            method: "POST",
            url: url + "authenticate",
            data: $scope.credentials
        }).then(function successCallback(response) {
            if(response.data.status == "success") {
                toastr.success(response.data.message);
                $scope.load_view();
                $("html").removeClass("loading");
            } 
            else {
                toastr.error(response.data.message);
            }
        });
    }

    // Logout
    $scope.logout = function() {
        $http({
            method: "POST",
            url: url + "logout"
        }).then(function successCallback(response) {
           window.location.href = url;
        });
    }
});
