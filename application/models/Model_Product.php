<?php
class Model_Product extends CI_Model 
{
	// Fetch Product List
	public function fetch_productList()
	{
		$str = "SELECT P.id, P.product_name, P.product_description, P.product_img, C.category
				FROM tbl_product AS P
				INNER JOIN tbl_category AS C
				ON P.product_categoryId = C.id";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Fetch Category List
	public function fetch_listCategory()
	{
		$str = "SELECT DISTINCT(category) FROM tbl_product_master_list";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Fetch Item Class List
	public function fetch_listItemClass(){
		$str = "SELECT DISTINCT(item_class) FROM tbl_product_master_list";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Insert Category
	public function insert_category($data){
		$category['category'] = $data['category'];
        $this->db->insert('tbl_category',$category);
        return true;
	}

	// Update Category
	public function update_category($data){
        $this->db->set('category', $data['category']);
        $this->db->where('id',$data['id']);
        $this->db->update('tbl_category');
        return true;
	}

	// Delete Product
	public function delete_category($id){
		// Change Category as Non Catogrized
		$this->db->set('product_categoryId', 10);
        $this->db->where('product_categoryId',$id);
        $this->db->update('tbl_product');

        // Delete Category
		$this->db->where('id', $id);
		$this->db->delete('tbl_category');
		return true;
	}

	// Insert Product
	public function insert_productdetails($data)
	{
        $this->db->insert('tbl_product',$data);
        return true;
	}

	// Update Product
	public function update_productdetails($data,$id)
	{
		$this->db->set('product_name', $data['product_name']);
		$this->db->set('product_description', $data['product_description']);
		$this->db->set('product_categoryId', $data['product_categoryId']);
		$this->db->where('id',$id);
        $this->db->update('tbl_product',$data);
        return true;
	}

	// Update Product with Image
	public function update_productdetailsImg($data,$id)
	{
		$this->db->set('product_name', $data['product_name']);
		$this->db->set('product_description', $data['product_description']);
		$this->db->set('product_categoryId', $data['product_categoryId']);
		$this->db->set('product_img', $data['product_img']);
		$this->db->where('id',$id);
        $this->db->update('tbl_product',$data);
        return true;
	}

	// Delete Product
	public function delete_productdetails($id){
		$this->db->where('id', intval($id));
		$this->db->delete('tbl_product');
		return true;
	}

	// Fetch Filtered Product List
	public function fetch_filteredProductList($data){
		$str = "CALL `db_quiztest`.`fetch_filteredProductList`('".$data["category"]."', '".$data["item_class"]."')";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Fetch Product List
	public function fetch_productMasterList(){
		$str = "SELECT * FROM tbl_product_master_list";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

}

// =========================================================================================
// Developer: Bergado, Marvin V.
// Position: Senior IT Developer - MIS Head
// Company: Kelin Graphics System
// Department: KGS-MIS
// Creation Datetime: 11/2/2023 2:00 PM

// Description:
// Product Model of the Kelin Product Quiz Web Application.