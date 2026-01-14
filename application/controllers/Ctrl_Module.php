<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Ctrl_Module extends CI_Controller 
{
    function __construct()
    {
        parent::__construct();
    }

    public function module_manageQuiz()
    {
        $result["view"] = $this->load->view('modules/module_manage_quiz.html', "", true);
        echo json_encode($result);
    }
}