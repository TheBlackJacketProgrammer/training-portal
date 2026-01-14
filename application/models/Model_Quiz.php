<?php
class Model_Quiz extends CI_Model 
{
	public function get_quizlist()
    {
		$query = $this->db->query("CALL sp_GetQuizList()");
        return $query->result_array();
	}
}

// =========================================================================================
// Developer: Bergado, Marvin V.
// Creation Datetime: 01/14/2026 10:55 AM

// Description:
// Quiz Model of the Training Portal Web Application.`