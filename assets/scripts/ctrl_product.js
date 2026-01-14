kelin.controller("ctrl_product",
    // function ($scope, $http, $interval, $sce, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder)
    function ($scope, $http, $filter, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder)
    {
        $scope.filter_category = "";
        $scope.filter_itemClass = "";

        // Product List from Database
        $scope.productList = [];

        $scope.initiateProductData = function(){
            $scope.fetch_categoryList();
        }

        $scope.getUploadedProductImages = function(){
            $http({
                method: "POST",
                url: url + "ctrl_product/getUploadedProductImages"
            }).then(function successCallback(response) {
                $scope.productlist = response.data;
            },
            function errorCallback(data) {

            });
        }

        $scope.insert_category = function(){
            $http({
                method: "POST",
                url: url + "ctrl_product/insert_category",
                data: $scope.categorydetails
            }).then(function successCallback(response) {
                $scope.fetch_categoryList();
                $scope.cancel_editCategory();
            },
            function errorCallback(data) {

            });
        }

        $scope.edit_category = function(row){
            $scope.categorydetails = {
                id: row.id,
                category: row.category
            };
            $scope.editCategory = true;
        }

        $scope.cancel_editCategory = function(row){
            $scope.categorydetails = {
                id: null,
                category: ""
            };
            $scope.editCategory = false;
        }

        $scope.update_category = function(){
            $http({
                method: "POST",
                url: url + "ctrl_product/update_category",
                data: $scope.categorydetails
            }).then(function successCallback(response) {
                $scope.fetch_categoryList();
                $scope.cancel_editCategory();
                $scope.refreshList();
            },
            function errorCallback(data) {

            });
        }

        $scope.delete_category = function(){
            $http({
                method: "POST",
                url: url + "ctrl_product/delete_category",
                data: $scope.categorydetails
            }).then(function successCallback(response) {
                //$scope.fetch_categoryList();
                $scope.cancel_editCategory();
                $scope.refreshList();
            },
            function errorCallback(data) {

            });
        }

        $scope.fetch_productList = function(){
            $http({
                method: "POST",
                url: url + "ctrl_product/fetch_productList"
            }).then(function successCallback(response) {
                $scope.productlist = response.data;
                $scope.tbl_productlist = response.data;
            },
            function errorCallback(data) {

            });
        }

        $scope.fetch_updateProductList = function(){
            $http({
                method: "POST",
                url: url + "ctrl_product/fetch_productList"
            }).then(function successCallback(response) {
                $scope.tbl_productlist = response.data;
            },
            function errorCallback(data) {

            });
        }

        $scope.insert_productdetails = function(){
            var formData = new FormData();
            formData.append('product_name', $scope.productdetails.product_name);
            formData.append('product_description', $scope.productdetails.product_description);
            formData.append('product_category', $scope.productdetails.product_category.category);
            formData.append('product_categoryId', $scope.productdetails.product_category.id);
            formData.append('product_img', $scope.productdetails.product_img);
            $http({
                method: "POST",
                url: url + "ctrl_product/insert_productdetails",
                headers: {'Content-Type': undefined},
                data: formData,
            }).then(function successCallback(response){ 
                console.log("Status: " + response.data['status']);
                $scope.clearAddProductDetails();
                $scope.fetch_productList();
            });
        }

        $scope.delete_productdetails = function(){
            var formData = new FormData();
            formData.append('id', $scope.productdetails.id);
            $http({
                method: "POST",
                url: url + "ctrl_product/delete_productdetails",
                headers: {'Content-Type': undefined},
                data: formData,
            }).then(function successCallback(response){ 
                console.log("Delete Status: " + response.data['status']);
                $scope.clearAddProductDetails();
                $scope.fetch_productList();
                $("#modal_editproduct").modal('hide');
            });
        }

        // Clear Add Product Details
        $scope.clearAddProductDetails = function(){
            formData = new FormData();
            $scope.productdetails.product_category = $scope.categorylist[0];
            $("#lblFilename").text("Choose File");
            $scope.productdetails = [];
        }

        $scope.refreshList = function(){
            $scope.fetch_productList();
            $scope.fetch_categoryList();
        }

        $scope.editProductDetails = function(index, row){
            $scope.tempIndex = index;
            $scope.productdetails = {
                id: row.id,
                product_name : row.product_name,
                product_description : row.product_description,
                product_category : row.category,
                product_img : row.product_img
            };
            $scope.tempImgLoc = row.product_img;
            var foundRow = $filter('filter')($scope.categorylist, { category: row.category }, true)[0];
            $scope.productdetails.product_category = foundRow;
            $("#modal_editproduct").modal({ backdrop: 'static', keyboard: true });
        }

        $scope.update_productdetails = function(){
            var formData = new FormData();
            formData.append('id', $scope.productdetails.id);
            formData.append('product_name', $scope.productdetails.product_name);
            formData.append('product_description', $scope.productdetails.product_description);
            formData.append('product_category', $scope.productdetails.product_category.category);
            formData.append('product_categoryId', $scope.productdetails.product_category.id);
            if($scope.tempImgLoc == $scope.productdetails.product_img)
            {
                formData.append('product_img', "");
                formData.append('product_img_old', $scope.tempImgLoc);
                $scope.tbl_productlist[$scope.tempIndex]["product_img"] = $scope.tempImgLoc;
            }
            else
            {
                formData.append('product_img_old', $scope.tempImgLoc);
                formData.append('product_img', $scope.productdetails.product_img);
            }

            $http({
                method: "POST",
                url: url + "ctrl_product/update_productdetails",
                headers: {'Content-Type': undefined},
                data: formData,
            }).then(function successCallback(response){ 
                //console.log("Status: " + response.data['status']);
                $scope.tbl_productlist[$scope.tempIndex]['product_name'] = $scope.productdetails.product_name;
                $scope.tbl_productlist[$scope.tempIndex]['product_description'] = $scope.productdetails.product_description;
                $scope.tbl_productlist[$scope.tempIndex]['product_category'] = $scope.productdetails.category;
                $scope.tbl_productlist[$scope.tempIndex]['id'] = $scope.productdetails.id;
                $scope.tbl_productlist[$scope.tempIndex]["product_img"] = response.data['product_img'];
                $scope.clearAddProductDetails();
                $("#modal_editproduct").modal('hide');
            });
        }

        // Get Category Id
        $scope.get_categoryId = function(category){
            var isDuplicate = $scope.hasDuplicate(category);
            if(isDuplicate == false){
                $scope.listCategory.push(category); 
            }
            else{
                // Remove Duplicate Category
                var index = $scope.listCategory.indexOf(category);
                $scope.listCategory.splice(index, 1);  
            }
            $scope.load_filtered();
        }

        $scope.load_filtered = function(){
            console.log($scope.listCategory.length);
            if($scope.listCategory.length == 0){
                console.log("Empty Category List");
                $scope.tbl_productlist = $scope.productlist;
            }
            else{
                $scope.tbl_productlist = $scope.productlist.filter(function(item) {
                    return $scope.listCategory.includes(item.category);
                });   
            }
        }

        // Fetch Category
        $scope.fetch_categoryList = function(){
            $http({
                method: "POST",
                url: url + "ctrl_product/fetch_categoryList"
            }).then(function successCallback(response) {
                $scope.categorylist = [];
                $scope.categorylist = response.data;
            },
            function errorCallback(data) {

            });
        }

        // Fetch Item Class
        $scope.fetch_itemClass = function(){
            $http({
                method: "POST",
                url: url + "ctrl_product/fetch_itemClass",
                data: {category : $scope.filter_category}
            }).then(function successCallback(response) {
                $scope.itemClassList = [];
                $scope.productList = [];
                $scope.itemClassList = response.data["itemClass"];
                $scope.productList = response.data["productList"];
                for (let index = 0; index < $scope.productList.length; index++) 
                {
                    $scope.productList[index]["selected"] = ($scope.productList[index]["selected"] == "0") ? false : true;
                }
            },
            function errorCallback(data) {

            });
        }

        // Function to toggle all checkboxes
        // $scope.toggleAll = function() {
        //     $scope.selectAll = false;
        //     if($("#chk_all").prop('checked'))
        //     {
        //         $scope.selectAll = true;
        //     }
        //     for (let index = 0; index < $scope.productList.length; index++) 
        //     {
        //         $scope.productList[index]["selected"] = $scope.selectAll;
        //     }
        // };

        // Add Product
        $scope.add_product = function(product){
            $("#modal_product").modal({ backdrop: 'static', keyboard: true });
        }

        // Edit Products
        $scope.edit_product = function(product){
            $scope.productDetails = angular.copy(product);
            $("#modal_product").modal({ backdrop: 'static', keyboard: true });
        }

    });
