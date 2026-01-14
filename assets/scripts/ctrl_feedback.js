kelin.controller("ctrl_feedback",
    function ($scope, $http, $filter, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, Excel)
    {
        $scope.filter_branch = "";
        $scope.filter_department = "";
        $scope.toBeEdit = false;
        $scope.indx = null;

        $scope.dtOptions_employee = {
            dom: "<'row'<'col-sm-4 fonts-sm'l><'col-sm-8 fonts-sm'f>>" +
                 "<'row'<'col-sm-12 fonts-sm'tr>>" +
                 "<'row'<'col-sm-12'<'p-2 text-center fonts-sm'i>>>" +
                 "<'row'<'col-sm-12'<'p-2 fonts-sm'p>>>",
            responsive: true,
            paging: true,
            ordering: true,
            order: [[0, 'asc']]
        };

        $scope.dtOptions_feedback = {
            dom: "<'row'<'col-sm-12 fonts-sm'B>>" +
                 "<'row'<'col-sm-12 fonts-sm'f>>" +
                 "<'row'<'col-sm-12 fonts-sm'tr>>" +
                 "<'row'<'col-sm-4 fonts-sm'l><'col-sm-8 fonts-sm'p>>" +
                 "<'row'<'col-sm-12'<'p-2 fonts-sm text-center'i>>>",
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Export to Excel',
                    className: 'btn btn-sm fonts-sm',
                    filename: "Feedback Report",
                    title: "Feedback Report",
                    exportOptions: {
                        columns: [0, 1, 2]
                    }
                }
            ],
            responsive: true,
            paging: true,
            ordering: true,
            order: [[0, 'asc']]
        };

        $scope.load_data_feedback = function(){
            $("html").addClass("loading");
            $http({
                method: "POST",
                url: url + "ctrl_main/fetch_employeeList"
            }).then(function successCallback(response) {
                $("html").removeClass("loading");
                $scope.list_employee = [];
                $scope.table_employee = [];
                $scope.list_branches = [];
                $scope.list_departments = [];
                $scope.list_employee = response.data["list"];
                $scope.table_employee = response.data["list"];
                $scope.list_branches = response.data["branch"];
                $scope.list_departments = response.data["department"];
                console.log("Data Load.");
            },
            function errorCallback(data) {

            });
        }

        $scope.fetch_feedback = function(employee){
            // console.log("Employee Data => ", employee);
            $("html").addClass("loading");
            $scope.details_employee = angular.copy(employee);
            $scope.list_feedback = [];
            $scope.details_feedback = {
                data_id: null,
                employee_id: "",
                date_created: "",
                creator_employee_id: "",
                feedback: "",
                remark: null
            }
            $http({
                method: "POST",
                url: url + "ctrl_main/fetch_feedback",
                data: {employee_id : $scope.details_employee.ee_id_no}
            }).then(function successCallback(response) {
                $("html").removeClass("loading");
                $scope.list_feedback = response.data;
            },
            function errorCallback(data) {

            });
        }

        // Save Feedback
        $scope.save_feedback = function(){
            $("html").addClass("loading");
            $scope.details_feedback.date_created = $scope.dateFormatter();
            $scope.details_feedback.employee_id = $scope.details_employee.ee_id_no;
            $http({
                method: "POST",
                url: url + "ctrl_main/save_feedback",
                data: $scope.details_feedback
            }).then(function successCallback(response) {
                $("html").removeClass("loading");
                $scope.list_feedback = response.data;
                // Clear
                $scope.details_feedback = {
                    data_id: null,
                    employee_id: "",
                    date_created: "",
                    creator_employee_id: "",
                    feedback: "",
                    remark: null
                }
            },
            function errorCallback(data) {

            });
        }

        // Edit Feedback
        $scope.edit_feedback = function(idx, feedback){
            // $scope.clear();
            $scope.details_feedback = [];
            $scope.details_feedback = angular.copy(feedback);
            $scope.indx = idx;
            $scope.toBeEdit = true;
        }

        // Remove Feedback
        $scope.remove_feedback = function(idx, data_id){
            $("html").addClass("loading");
            $http({
                method: "POST",
                url: url + "ctrl_main/remove_feedback",
                data: {data_id: data_id}
            }).then(function successCallback(response) {
                $scope.list_feedback.splice(idx, 1);
                $("html").removeClass("loading");
            },
            function errorCallback(data) {

            });
        }

        // Update Feedback
        $scope.update_feedback = function(){
            $("html").addClass("loading");
            $http({
                method: "POST",
                url: url + "ctrl_main/update_feedback",
                data: $scope.details_feedback
            }).then(function successCallback(response) {
                $scope.list_feedback[$scope.indx] = [];
                $scope.list_feedback[$scope.indx] = angular.copy($scope.details_feedback);
                $scope.details_feedback = {
                    data_id: null,
                    employee_id: "",
                    date_created: "",
                    creator_employee_id: "",
                    feedback: "",
                    remark: null
                }
                $scope.toBeEdit = false;
                $("html").removeClass("loading");
            },
            function errorCallback(data) {
    
            });
        }
        

        $scope.$watch(function(){
            return [$scope.filter_branch, $scope.filter_department];
        },function(){
            $scope.table_employee = [];
            $scope.details_employee = [];
            if($scope.filter_branch != "" && $scope.filter_department == ""){
                $scope.table_employee = $filter('filter')($scope.list_employee, { division: $scope.filter_branch });
            }
            else if($scope.filter_branch == "" && $scope.filter_department != ""){
                $scope.table_employee = $filter('filter')($scope.list_employee, { department: $scope.filter_department });
            }
            else if($scope.filter_branch != "" && $scope.filter_department != ""){
                $scope.table_employee = $filter('filter')($scope.list_employee, { department: $scope.filter_department, division: $scope.filter_branch });
            }
            else{
                $scope.table_employee = angular.copy($scope.list_employee);
            }
            console.log("Filtered Product List Loaded");
        }, true);

        // Clear
        $scope.clear = function(){
            $scope.details_employee = [];
            $scope.list_feedback = [];
            $scope.details_feedback = {
                data_id: null,
                employee_id: "",
                date_created: "",
                creator_employee_id: "",
                feedback: "",
                remark: null
            }
            $scope.toBeEdit = false;
            $scope.indx = null;
        }

        // Fetch All Feedbacks
        $scope.fetch_all_feedbacks = function(){
            $("html").addClass("loading");
            $http({
                method: "POST",
                url: url + "ctrl_main/fetch_all_feedbacks"
            }).then(function successCallback(response) {
                let formattedData = response.data.map(function (item) {
                    return {
                        'Branch'  : item.branch,
                        'Date Created' : item.date_created,
                        'Employee' : item.fullname,
                        'Feedback' : item.feedback,
                        'Remarks' : item.remark,
                        'Feedback Creator' : item.feedback_creator
                    };
                });
                var ws = XLSX.utils.json_to_sheet(formattedData);
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                XLSX.writeFile(wb, "Report.xlsx");
                $("html").removeClass("loading");
            },
            function errorCallback(data) {
    
            });
        }

    });
