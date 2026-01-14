<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Ctrl_Product extends CI_Controller 
{
	function __construct()
	{
	   parent::__construct();
	}
	
	public function getUploadedProductImages()
	{
	    $imageDirectory = './products/';
	    $result = array();
	    $temp = array();
	    $count = 1;
	    if (is_dir($imageDirectory)) 
	    {
		    $files = scandir($imageDirectory);
		    foreach ($files as $file) 
		    {
		    	if ((pathinfo($file, PATHINFO_EXTENSION) == 'PNG' || pathinfo($file, PATHINFO_EXTENSION) == 'png')) 
		    	{
		    		$temp = array(
						"id" => $count, 
						"product_name" => pathinfo($file, PATHINFO_FILENAME),
						"product_description" => "None",
						"product_category" => "Not Yet Categorized",
						"product_img" => base_url()  . "products/" . $file
		    		);
		        	$count++;
		        	$result[] = $temp;
		      	}
		    }
		} 
		else 
		{
			$result = "" ;
		}
		echo json_encode($result);
	}

	// Insert Category
	public function insert_category(){
		$data = json_decode(file_get_contents('php://input'),true);
		$result = $this->model_product->insert_category($data);
        return $result;
	}

	// Update Category
	public function update_category(){
		$data = json_decode(file_get_contents('php://input'),true);
		$result = $this->model_product->update_category($data);
        return $result;
	}

	// Delete Category
	public function delete_category(){
		$data = json_decode(file_get_contents('php://input'),true);
		$result = $this->model_product->delete_category($data["id"]);
        return $result;
	}

	// Fetch Product List
	public function fetch_productList(){
		$result = $this->model_product->fetch_productList();
		echo json_encode($result);
	}

	// Insert Product
	public function insert_productdetails(){
		$data['product_name'] = $this->input->post('product_name');
		$data['product_description'] = $this->input->post('product_description');
		$data['product_categoryId'] = $this->input->post('product_categoryId');
		
		$category = $this->input->post('product_category');
		$imgname = $_FILES['product_img']['name'];
		$filename = "KGS-".$category."-".$imgname;
		$location = "./products/".$filename;

		if(file_exists($location))
		{
			$response["status"] = 'File already exists: ' . $location;
		}
		else
		{
			// Upload File    
			if(move_uploaded_file($_FILES['product_img']['tmp_name'], $location))
			{   
				$data['product_img'] = $location;
				$this->model_product->insert_productdetails($data); 
				$response["status"] = "Product Details Added!";
			}
		}

		echo json_encode($response);
	}

	// Update Product
	public function update_productdetails(){
		$id = $this->input->post('id');
		$data['product_name'] = $this->input->post('product_name');
		$data['product_description'] = $this->input->post('product_description');
		$data['product_categoryId'] = $this->input->post('product_categoryId');

		if (empty($_FILES['product_img']['name'])) 
		{
		    $this->model_product->update_productdetails($data,$id); 
			$response["status"] = "Product Details Updated With Same Img";
			$response['product_img'] = $this->input->post('product_img_old');
		} 
		else 
		{
			$oldImg = $this->input->post('product_img_old');
			if (unlink($oldImg)) {
		        $response["imgStatus"] = "File has been successfully deleted.";
		    } 
		    else 
		    {
		        $response["imgStatus"] = "Failed to delete the file '$filename'.";
		    }

		    $category = $this->input->post('product_category');
			$imgname = $_FILES['product_img']['name'];
			$filename = "KGS-".$category."-".$imgname;
			$location = "./products/".$filename;

			if(file_exists($location))
			{
				$response["status"] = 'File already exists: ' . $location;
			}
			else
			{
				// Upload File    
				if(move_uploaded_file($_FILES['product_img']['tmp_name'], $location))
				{   
					$data['product_img'] = $location;
					$this->model_product->update_productdetailsImg($data,$id); 
					$response["status"] = "Product Details Updated!";
					$response['product_img'] = $location;
				}
			}
		}
		echo json_encode($response);
	}

	// Delete Product
	public function delete_productdetails(){
		$productId = $this->input->post('id');
		$result = $this->model_product->delete_productdetails($productId);
		echo json_encode($result);
	}

	// Fetch Category List
	public function fetch_categoryList(){
		$result = $this->model_product->fetch_categoryList();
		echo json_encode($result);
	}

	// Fetch Item Class List
	public function fetch_productData(){
		$data = json_decode(file_get_contents('php://input'),true);
		$result["list"] = $this->model_product->fetch_productMasterList();
		$result["category"] = $this->model_product->fetch_listCategory();
		$result["item_class"] = $this->model_product->fetch_listItemClass();
		echo json_encode($result);
	}

	// Fetch Filtered Product List
	public function fetch_filteredProductList(){
		$data = json_decode(file_get_contents('php://input'),true);
		$result = $this->model_product->fetch_filteredProductList($data);
		echo json_encode($result);
	}

}

// =========================================================================================
// Developer: Bergado, Marvin V.
// Position: Senior IT Developer - MIS Head
// Company: Kelin Graphics System
// Department: KGS-MIS
// Creation Datetime: 11/2/2023 2:13 PM

// Description:
// Product Controller of the Kelin Product Quiz Web Application.