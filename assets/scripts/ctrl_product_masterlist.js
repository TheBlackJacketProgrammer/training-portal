kelin.controller("ctrl_product_masterlist",
    // function ($scope, $http, $interval, $sce, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder)
    function ($scope, $http, $filter, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder)
    {
        $scope.filter_category = "";
        $scope.filter_itemClass = "";

        $scope.load_data = function(){
            $scope.list_category = [];
            $scope.list_itemClass = [];
            $scope.table_product = [];
            $scope.productList = [];
            $http({
                method: "POST",
                url: url + "ctrl_product/fetch_productData"
            }).then(function successCallback(response) {
                $scope.productList = response.data["list"];
                $scope.table_product = response.data["list"];
                $scope.list_category = response.data["category"];
                $scope.list_itemClass = response.data["item_class"];
                $("html").removeClass("loading");
            },
            function errorCallback(data) {

            });
        }

        $scope.dtOptions_products = {
                responsive: true,
                paging: true,
                ordering: true,
                order: [[0, 'desc']]
        };

        // Add Product
        $scope.add_product = function(product){
            $("#modal_product").modal({ backdrop: 'static', keyboard: true });
        }

        // Edit Products
        $scope.edit_product = function(product){
            $scope.productDetails = angular.copy(product);
            $("#modal_product").modal({ backdrop: 'static', keyboard: true });
        }

        // $scope.$watch('filter_category', function(){
        //     $scope.fetch_filteredProductList();
        // });

        // $scope.$watch('filter_itemClass', function(){
        //     $scope.fetch_filteredProductList();
        // });

        $scope.$watch(function(){
            return [$scope.filter_category, $scope.filter_itemClass];
        },function(){
            $("html").addClass("loading");
            $scope.table_product = [];
            if($scope.filter_category != "" && $scope.filter_itemClass == ""){
                $scope.table_product = $filter('filter')($scope.productList, { category: $scope.filter_category });
            }
            else if($scope.filter_category == "" && $scope.filter_itemClass != ""){
                $scope.table_product = $filter('filter')($scope.productList, { item_class: $scope.filter_itemClass });
            }
            else if($scope.filter_category != "" && $scope.filter_itemClass != ""){
                $scope.table_product = $filter('filter')($scope.productList, { category: $scope.filter_category, item_class: $scope.filter_itemClass });
            }
            else{
                $scope.table_product = angular.copy($scope.productList);
            }
            $("html").removeClass("loading");
        }, true);

        $scope.fetch_filteredProductList = function(){
            $http({
                method: "POST",
                url: url + "ctrl_product/fetch_filteredProductList",
                data: {category : $scope.filter_category, item_class : $scope.filter_itemClass}
            }).then(function successCallback(response) {
                $scope.productList = [];
                $scope.productList = response.data;
                $("html").removeClass("loading");
                console.log("Filtered Product List Loaded");
            },
            function errorCallback(data) {

            });
        }

    });
