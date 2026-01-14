kelin.controller("ctrl_module_manage_quiz", function($scope, $http) 
{
    $scope.loadingQuizList = true;

    // Search
    $scope.searchText = '';
    $scope.filteredData = [];

    // Pagination
    $scope.currentPage = 1;
    $scope.itemsPerPage = 5;
    $scope.pageCount = 0;

    $scope.initiate = function() {
        // Get Quiz List
        $scope.getQuizList();
    };

    $scope.getQuizList = function() {
        $scope.loadingQuizList = true;
        $http({
            method: "POST",
            url: url + "get_quizlist",
        }).then(function successCallback(response) {
            $scope.quizList = response.data.quizlist;
            $scope.loadingQuizList = false;
        }).finally(function() {
            $scope.loadingQuizList = false;
        });
    }

    // Filter function to apply search
    $scope.applyFilter = function() {
        if ($scope.searchText && $scope.searchText.trim() !== '') {
            $scope.filteredData = $scope.quizList.filter(function(item) {
                return (
                    (item.quiz_id && item.quiz_id.toString().includes($scope.searchText)) ||
                    (item.quiz_code && item.quiz_code.toLowerCase().includes($scope.searchText.toLowerCase())) ||
                    (item.quiz_name && item.quiz_name.toLowerCase().includes($scope.searchText.toLowerCase())) ||
                    (item.quiz_type && item.quiz_type.toLowerCase().includes($scope.searchText.toLowerCase())) ||
                    (item.status && item.status.toLowerCase().includes($scope.searchText.toLowerCase()))
                );
            });
        } else {
            $scope.filteredData = $scope.quizList;
        }
    };

    // Calculate total pages
    $scope.pageCount = function() {
        if (!$scope.tickets) return 0;
        // Use filteredData if search is active, otherwise use tickets
        const dataToUse = $scope.searchText && $scope.searchText.trim() !== '' ? $scope.filteredData : $scope.tickets;
        if (!dataToUse) return 0;
        return Math.ceil(dataToUse.length / $scope.itemsPerPage);
    };

    // Go to page
    $scope.setPage = function(page) {
        $scope.currentPage = page;
    };

    // Previous page
    $scope.prevPage = function() {
        if ($scope.currentPage > 1) {
          $scope.currentPage--;
        }
    };

    // Next page
    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.pageCount()) {
          $scope.currentPage++;
        }
    };

    // Get pages for pagination display with ellipsis
    $scope.getPages = function() {
        let pages = [];
        const totalPages = $scope.pageCount();
        const currentPage = $scope.currentPage;
        
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


    $scope.closeModule = function() {
        $scope.$parent.module = "";
    }
});

// =========================================================================================
// Developer: Bergado, Marvin V.
// Creation Datetime: 01/14/2026 11:48 AM

// Description:
// Manage Quiz Controller AngularJS of the Training Portal Web Application.