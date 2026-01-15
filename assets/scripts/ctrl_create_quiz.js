kelin.controller("ctrl_create_quiz",function ($scope, $http,) {

    $scope.quizDetails = {};

    // Essay Questions
    $scope.essayQuestions = [];
    $scope.essayInput = { question: '' };

    // Search Text (using object to avoid child scope issues with ng-if) for Essay Questions
    $scope.essaySearch = { text: '' };
    $scope.filteredEssayQuestions = $scope.essayQuestions;
    $scope.essayTotalQuestions = $scope.essayQuestions.length;
    $scope.quizDetails.total_questions = $scope.essayQuestions.length;

    // Pagination for Essay Questions
    $scope.essayPageCount = 0;
    $scope.essayCurrentPage = 1;
    $scope.essayItemsPerPage = 10;

    // Generate new code when modal opens
    $('#modal_create_quiz').on('shown.bs.modal', function() {
        $scope.$apply(function() {
            $scope.generateQuizCode();
            $scope.quizDetails.quiz_type = "0";
        });
    });

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

    // Add Essay Question
    $scope.addEssayQuestion = function() {
        $scope.loadingAddEssayQuestion = true;
        if (!$scope.essayInput.question || $scope.essayInput.question.trim() == "") {
            toastr.error("Please enter a question.");
            $scope.loadingAddEssayQuestion = false;
            return;
        }
        $scope.essayQuestions.push({ question: $scope.essayInput.question });
        $scope.essayInput.question = '';
        $scope.essayTotalQuestions = $scope.essayQuestions.length;
        $scope.quizDetails.total_questions = $scope.essayQuestions.length;
        toastr.success("Essay Question Added Successfully.");
        $scope.loadingAddEssayQuestion = false;
    }

    // Track selected essay question
    $scope.selectedEssayQuestion = null;

    // Edit Essay Question
    $scope.editEssayQuestion = function(question) {
        $scope.selectedEssayQuestion = question;
        $scope.essayInput.question = question.question;
    }

    // Reset Essay Question
    $scope.resetEssayQuestion = function() {
        $scope.selectedEssayQuestion = null;
        $scope.essayInput = { question: '' };
    }

    // Delete Essay Question
    $scope.deleteEssayQuestion = function() {
        $scope.essayQuestions = $scope.essayQuestions.filter(function(question) {
            return question.question !== $scope.selectedEssayQuestion.question;
        });
        $scope.selectedEssayQuestion = null;
        $scope.essayInput = { question: '' };
        $scope.applyEssayFilter();
        $scope.quizDetails.total_questions = $scope.essayQuestions.length;
    }

    // Update Essay Question
    $scope.updateEssayQuestion = function() {
        if (!$scope.essayInput.question || $scope.essayInput.question.trim() == "") {
            toastr.error("Please enter a question.");
            return;
        }
        $scope.selectedEssayQuestion.question = $scope.essayInput.question;
        $scope.selectedEssayQuestion = null;
        $scope.essayInput = { question: '' };
        $scope.applyEssayFilter();
        toastr.success("Essay Question Updated Successfully.");
    }

    // Filter function to apply search for Essay Questions
    $scope.applyEssayFilter = function() {
        if ($scope.essaySearch.text && $scope.essaySearch.text.trim() !== '') {
            $scope.filteredEssayQuestions = $scope.essayQuestions.filter(function(question) {
                return question.question.toLowerCase().includes($scope.essaySearch.text.toLowerCase());
            });
        } else {
            $scope.filteredEssayQuestions = $scope.essayQuestions;
        }
        $scope.essayTotalQuestions = $scope.filteredEssayQuestions.length;
    };

    // Watch for search text changes
    $scope.$watch('essaySearch.text', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.essayCurrentPage = 1;
            $scope.applyEssayFilter();
        }
    });

    // Watch for quiz type changes
    $scope.$watch('quizDetails.quiz_type', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            if (newVal == '2') { // Essay
                $scope.quizDetails.total_questions = $scope.essayQuestions.length;
            }
            else { // Multiple Choice & Blank
                $scope.quizDetails.total_questions = 0;
            }
        }
    });

    // Calculate total pages
    $scope.essayPageCount = function() {
        if (!$scope.filteredEssayQuestions) return 0;
        // Use filteredData if search is active, otherwise use tickets
        const dataToUse = $scope.essaySearch.text && $scope.essaySearch.text.trim() !== '' ? $scope.filteredEssayQuestions : $scope.essayQuestions;
        if (!dataToUse) return 0;
        return Math.ceil(dataToUse.length / $scope.essayItemsPerPage);
    };

    // Go to page
    $scope.setEssayPage = function(page) {
        $scope.essayCurrentPage = page;
    };

    // Previous page
    $scope.prevEssayPage = function() {
        if ($scope.essayCurrentPage > 1) {
          $scope.essayCurrentPage--;
        }
    };

    // Next page
    $scope.nextEssayPage = function() {
        if ($scope.essayCurrentPage < $scope.essayPageCount()) {
          $scope.essayCurrentPage++;
        }
    };

    // Get pages for pagination display with ellipsis
    $scope.getEssayPages = function() {
        let pages = [];
        const totalPages = $scope.essayPageCount();
        const currentPage = $scope.essayCurrentPage;
        
        if (totalPages <= 4) {
            // Show all pages if 4 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let startPage, endPage;
            
            // Near the end: show last 3 pages
            if (currentPage >= totalPages - 1) {
                startPage = Math.max(1, totalPages - 2);
                endPage = totalPages;
            }
            // Near the beginning: show first 3 pages
            else if (currentPage <= 2) {
                startPage = 1;
                endPage = 3;
            }
            // Pages 3-4: center around current (current-1, current, current+1)
            else if (currentPage <= 4) {
                startPage = currentPage - 1;
                endPage = currentPage + 1;
            }
            // Page 5+: show current-1, current, current+1
            else {
                startPage = currentPage - 1;
                endPage = currentPage + 1;
            }
            
            // Add the 3 pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            
            // Add ellipsis and last page if needed
            if (endPage < totalPages) {
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    // Create Quiz - Save / Submit
    $scope.create = function() {
        if ($scope.quizDetails.quiz_name == "" || $scope.quizDetails.quiz_type == "0" || $scope.quizDetails.total_questions == "") {
            toastr.error("Please fill up all the required fields.");
            return;
        }

        if($scope.quizDetails.quiz_type == "2") { // Essay
            if($scope.essayQuestions.length == 0) {
                toastr.error("Please add at least one essay question.");
                return;
            }
            
            $http({
                method: "POST",
                url: url + "create_essay_quiz",
                data: {
                    quizDetails: $scope.quizDetails,
                    essayQuestions: $scope.essayQuestions
                }
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
        else {
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
    }
});
