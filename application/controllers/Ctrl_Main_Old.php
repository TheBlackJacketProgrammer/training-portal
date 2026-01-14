<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Ctrl_Main_Old extends CI_Controller {

	public function index()
	{
		$this->load->view('page_main');
	}

	// Fetch Total New Leads
	public function fetch_productList()
	{
		$response = $this->mdl_main->fetch_productList();
		echo json_encode($response);
	}

	public function scoreboard()
	{
		$response = $this->mdl_main->scoreboard();
		echo json_encode($response);
	}

	// Save Player and Score
	public function saveResults(){
		$data = json_decode(file_get_contents('php://input'),true); 
		$response = $this->mdl_main->saveResults($data);
		echo json_encode($response);
	}

	public function getRandomImages() {
       // Define the directory where your image files are stored
	    $imageDirectory = './products/';

	    // Create an array to store matching image file names
	    $matchingImages = [];

	    if (is_dir($imageDirectory)) 
	    {
		    // Scan the directory for image files and check if they match the query
		    $files = scandir($imageDirectory);
		
		    foreach ($files as $file) 
		    {
		    	if ((pathinfo($file, PATHINFO_EXTENSION) == 'PNG' || pathinfo($file, PATHINFO_EXTENSION) == 'png')) 
		    	{
		        	// You can customize the file extension as per your requirements
		        	$images[] = base_url()  . "products/" . $file;
		        	$filename[] = pathinfo($file, PATHINFO_FILENAME);
		      	}
		    }
		    $matchingImages['image'] = $images;
		    $matchingImages['filename'] = $filename;

		} 
		else 
		{
			$matchingImages[] = base_url()  . "products/" ;
		}

	    

	    // Send the matching image file names back to the AngularJS frontend
	    echo json_encode($matchingImages); 
    }

	public function searchImages() {
    $data = json_decode(file_get_contents('php://input'),true); 

    // Define the directory where your image files are stored
    $imageDirectory = './products/';

    // Create an array to store matching image file names
    $matchingImages = [];

    if (is_dir($imageDirectory)) 
    {
	    // Scan the directory for image files and check if they match the query
	    $files = scandir($imageDirectory);
	
	    foreach ($files as $file) 
	    {
	    	if ((pathinfo($file, PATHINFO_EXTENSION) == 'PNG' || pathinfo($file, PATHINFO_EXTENSION) == 'png') && strpos($file, $data['query']) !== false) 
	    	{
	        	// You can customize the file extension as per your requirements
	        	$matchingImages[] = base_url()  . "products/" . $file;
	      	}
	    }
	} 
	else 
	{
		$matchingImages[] = base_url()  . "products/" ;
	}

    

    // Send the matching image file names back to the AngularJS frontend
    echo json_encode($matchingImages);
  	}
}
