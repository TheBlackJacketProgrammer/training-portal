kelin.controller("ctrl_create_quiz",function ($scope, $http,) {

    $scope.quizDetails = {};

    // Close Modal
    $scope.closeModal = function() {
        // Remove focus from modal elements before hiding to prevent aria-hidden accessibility warning
        document.activeElement.blur();
        $scope.quizDetails = {};
        $('#modal_create_quiz').modal('hide');
    }

    // Generate Quiz Code (Format: QMMDDYYNNNNN)
    $scope.generateQuizCode = function() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const year = String(now.getFullYear()).slice(-2);
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let random = '';
        for (let i = 0; i < 5; i++) {
            random += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        $scope.quizDetails.quiz_code = "Q" + month + day + year + random;
    }

    // Create Quiz
    $scope.create = function() {
        if ($scope.quizDetails.quiz_name == "" || $scope.quizDetails.quiz_type == "0" || $scope.quizDetails.total_questions == "") {
            alert("Please fill up all the required fields.");
            return;
        }

        $http({
            method: "POST",
            url: url + "create_quiz",
            data: $scope.quizDetails
        }).then(function successCallback(response) {
            if(response.data.success == true) {
                toastr.success(response.data.message);
                $scope.closeModal();
            } else {
                toastr.error(response.data.message);
            }
        }).finally(function() {
            $scope.closeModal();
        });
    }

    // Generate new code when modal opens
    $('#modal_create_quiz').on('shown.bs.modal', function() {
        $scope.$apply(function() {
            $scope.generateQuizCode();
            $scope.quizDetails.quiz_type = "0";
        });
    });
});
