<?php
class Model_Quiz extends CI_Model 
{
	public function get_quizlist()
    {
		$query = $this->db->query("CALL sp_GetQuizList()");
        return $query->result_array();
	}

	// Insert Quiz
	public function insert_quiz($data)
	{
		$this->db->insert('tbl_quiz', $data);
		return ['success' => true, 'message' => 'Quiz created successfully.'];
	}

	// Insert Essay Quiz
	public function insert_essay_question($data)
	{
		$this->db->insert('tbl_quiz_questionaire', $data);
		return ['success' => true, 'message' => 'Essay quiz created successfully.'];
	}
}

// =========================================================================================
// Developer: Bergado, Marvin V.
// Creation Datetime: 01/14/2026 10:55 AM

// Description:
// Quiz Model of the Training Portal Web Application.`