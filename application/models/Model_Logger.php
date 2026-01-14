<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Model_Logger extends CI_Model 
{
	public function insert_log($params){
		$data['quiz_id'] = $params['quiz_id'];
		$data['account_id'] = $params['account_id'];
		$data['log_details'] = $params['log_details'];
		$data['quiz_status'] = $params['quiz_status'];
		$data['datetime_taken'] = $params['datetime_taken'];
        $this->db->insert('tbl_quiz_eventlogs',$params);
	}

	public function fetch_logslist(){
		$str = "SELECT	Q.quiz_name, 
						CONCAT(A.firstname, '', IF(ISNULL(A.middlename) = 1, '', CONCAT(' ', A.middlename, ' ')), A.lastname) AS fullname,
						L.log_details,
						L.quiz_status,
						L.datetime_taken
				FROM tbl_quiz_eventlogs AS L
				JOIN tbl_account AS A ON L.account_id = A.id
				JOIN tbl_quizmaster AS Q ON L.quiz_id = Q.quiz_id";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}
}

// Created by: MVB
// Date Created: 4-30-2024 3:59 PM