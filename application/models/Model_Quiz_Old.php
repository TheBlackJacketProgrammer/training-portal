<?php
class Model_Quiz extends CI_Model 
{
	// Fetch Category List
	public function fetch_categoryList()
	{
		$str = "SELECT * FROM tbl_category";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Fetch Category List
	public function fetch_productList()
	{
		$str = "SELECT * FROM tbl_product";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Save Exam Result
	public function insert_examResult($data){
		$this->db->insert('tbl_score',$data);
        return true;
	}

	public function insert_essay($data){
		$this->db->insert('tbl_essay',$data);
        return true;
	}

	public function fetch_essaylist(){
		$currentDate = date("m/d/Y");
		$str = "SELECT A.id, A.firstname, A.middlename, A.lastname, A.branch, A.department, S.score
				FROM tbl_essay AS E
				JOIN tbl_account AS A ON E.account_id = A.id
				JOIN tbl_score AS S ON S.account_id = A.id
				WHERE (A.usertype != 'Admin')
					AND E.datetime_taken LIKE '".$currentDate."%'
				GROUP BY A.id
				ORDER BY S.score DESC";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	
	public function fetch_answerlist($data){
		$str = "SELECT E.id, E.account_id, E.questionNumber, E.answer, E.datetime_taken, E.is_correct, E.quiz_id, E.answer_score, CONCAT(A.lastname,', ', A.firstname, ' ', A.middlename ) AS fullname, E.remarks
				FROM tbl_essay AS E
				JOIN tbl_account AS A ON E.account_id = A.id
				WHERE A.usertype != 'Admin'
				AND E.account_id IN (".$data["ids"].")
				AND E.quiz_id = '".$data["quiz_id"]."'
				AND E.datetime_taken LIKE '".$data["date_taken"]."%'
				ORDER BY E.account_id, E.questionNumber";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	public function validateAnswer($data)
	{
		$this->db->set('is_correct', $data['is_correct']);
        $this->db->where('id',$data['id']);
        $this->db->update('tbl_essay');
        return true;
	}

	public function fetch_userscore($data){
		$str = "SELECT EXISTS(SELECT id FROM tbl_score WHERE quiz_id = '".$data['quiz_id']."' AND account_id = ".$data['account_id'].") AS TOKEN";
        $query = $this->db->query($str); 
        foreach ($query->result() as $row)
        {
            $token =  $row->TOKEN;
        }
		return $token;
	}

	public function insert_score($data){
		$tblScore['score'] = $data['score'];
		$tblScore['quiz_id'] = $data['quiz_id'];
		$tblScore['account_id'] = $data['account_id'];
		$tblScore['datetime_taken'] = $data['datetime_taken'];
		// $tblScore['remarks'] = $data['remarks'];
        $this->db->insert('tbl_score',$tblScore);
        return $tblScore['score'];
	}

	public function fetch_currentUserScore($data){
		$str = "SELECT * FROM tbl_score WHERE account_id = ".$data['account_id']." AND quiz_id = '".$data['quiz_id']."'";
        $query = $this->db->query($str); 
        $result = ($query->result() != null) ? $query->result() : false;
		return $result;
	}

	public function update_score($data, $scoreData){
		$points = ($data['is_correct'] == 1) ? $data['score'] : 0;
		$tblScore['score'] = $scoreData[0]->score + $points;
		$this->db->where('id',$scoreData[0]->id);
        $this->db->update('tbl_score',$tblScore);
        return $tblScore['score'];
	}

	public function update_answerscore($data){
		$this->db->set('answer_score', $data['score']);
		$this->db->set('remarks', $data['remarks']);
        $this->db->where('id',$data['id']);
        $this->db->update('tbl_essay');
	}

	public function revert_answerscore($data){
		$this->db->set('answer_score', 0);
		$this->db->set('is_correct', 2);
        $this->db->where('id',$data['id']);
        $this->db->update('tbl_essay');
	}

	public function revert_score($data, $scoreData){
		$tblScore['score'] = $data["currentScore"];
		$this->db->where('id',$scoreData[0]->id);
        $this->db->update('tbl_score',$tblScore);
        return $tblScore['score'];
	}

	// Essay
	public function save_quizDetails($data){
		$tbl_quizmaster['quiz_id'] = $data['quiz_id'];
		$tbl_quizmaster['quiz_name'] = $data['quiz_name'];
		$tbl_quizmaster['quiz_type'] = $data['quiz_type'];
		$tbl_quizmaster['date_created'] = $data['date_created'];
		$tbl_quizmaster['quiz_totalitems'] = $data['quiz_totalitems'];
		$tbl_quizmaster['is_active'] = $data['is_active'];
        $this->db->insert('tbl_quizmaster',$data);
        return true;
	}

	public function update_quizDetails($data){
		$tbl_quizmaster['quiz_id'] = $data['quiz_id'];
		$tbl_quizmaster['quiz_name'] = $data['quiz_name'];
		$tbl_quizmaster['quiz_type'] = $data['quiz_type'];
		$tbl_quizmaster['date_created'] = $data['date_created'];
		$tbl_quizmaster['quiz_totalitems'] = $data['quiz_totalitems'];
		$tbl_quizmaster['is_active'] = $data['is_active'];
		$this->db->where('id', $data['id']);
        $this->db->update('tbl_quizmaster', $tbl_quizmaster);
        return true;
	}

	public function fetch_quizId($quizId){
		$str = "SELECT id FROM tbl_quizmaster WHERE quiz_id = '".$quizId."'";
        $query = $this->db->query($str); 
        foreach ($query->result() as $row)
        {
            $id =  $row->id;
        }
		return $id;
	}

	public function save_questionSet($data){
		$tbl_quizessay['quiz_id'] = $data['quiz_id'];
		$tbl_quizessay['question_num'] = $data['question_num'];
		$tbl_quizessay['question'] = $data['question'];
		$tbl_quizessay['question_pts'] = $data['question_pts'];
        $this->db->insert('tbl_quizessay', $tbl_quizessay);
        return true;
	}

	public function update_questionSet($data){
		$tbl_quizessay['quiz_id'] = $data['quiz_id'];
		$tbl_quizessay['question_num'] = $data['question_num'];
		$tbl_quizessay['question'] = $data['question'];
		$tbl_quizessay['question_pts'] = $data['question_pts'];
		$this->db->where('id', $data['id']);
        $this->db->update('tbl_quizessay', $tbl_quizessay);
        return true;
	}

	// Create Quiz - tbl_quizmaster
	public function createQuiz($data){
		$this->db->insert('tbl_quizmaster', $data);
		return true;
	}

	// Create Question - Multiple Choice tbl_quizmultiple
	public function createQuestion($data){
		$this->db->insert('tbl_quizmultiple', $data);
		$str = "SELECT id FROM tbl_quizmultiple WHERE quiz_id = '".$data["quiz_id"]."'";
        $query = $this->db->query($str); 
        foreach ($query->result() as $row)
        {
            $id =  $row->id;
        }
		return $id;
	}

	public function saveQuestionDetails($data){
		$data["question"] = str_replace(array("'", '"', '`'), array('\'', '\"', '\`'), $data["question"]);
		$this->db->insert('tbl_quizquestion', $data);
	}

	// Save Item Choice
	public function saveItemChoices($data){
		//$this->db->insert('tbl_quizitemchoice', $data);
		$this->db->insert('tbl_quizitemchoice', $data);
	}

	// Search Quiz Id / Quiz Code
	public function quizSearch($quizId){
		$str = "SELECT *
				FROM tbl_quizmaster
				WHERE quiz_id = '".$quizId."'";
        $query = $this->db->query($str); 
        $result = ($query->result() != null) ? $query->result() : false;
        // $result = $query->result();
        return $result;
	}

	// Fetch Question Set - MC
	public function fetchQuestionSet($quizId){
		$str = "SELECT *
				FROM tbl_quizquestion
				WHERE qm_id = '".$quizId."'";
        $query = $this->db->query($str); 
        $result = ($query->result() != null) ? $query->result() : false;
        // $result = $query->result();
        return $result;
	}

	// Fetch Question Set - Essay
	public function fetchEssayQuestionSet($quizId){
		$str = "SELECT * 
				FROM tbl_quizessay
				WHERE quiz_id = '".$quizId."'";
        $query = $this->db->query($str); 
        $result = ($query->result() != null) ? $query->result() : false;
        // $result = $query->result();
        return $result;
	}

	// Fetch Item Choices Set
	public function fetchItemChoicesSet($questionId){
		$str = "SELECT * 
				FROM tbl_quizitemchoice
				WHERE q_id = '".$questionId."'";
        $query = $this->db->query($str); 
        $result = ($query->result() != null) ? $query->result() : false;
        // $result = $query->result();
        return $result;
	}

	public function submitquiz($data){
		$this->db->insert('tbl_userscore', $data);
	}

	public function submitEssayAnswer($data){
		$this->db->insert('tbl_essay', $data);
	}

	public function updateBlankQuizQuestionAnswer($data){
		$this->db->where('id', $data['id']);
        $this->db->update('tbl_essay', $data);
        return true;
	}

	public function fetch_examDates(){
		$str = "SELECT DATE_FORMAT(STR_TO_DATE(E.datetime_taken, '%m/%d/%Y'), '%m/%d/%Y') AS DATETAKEN 
				FROM tbl_essay AS E
				JOIN tbl_quizmaster AS QM ON E.quiz_id = QM.quiz_id
				GROUP BY DATETAKEN
				ORDER BY DATETAKEN DESC";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Fetch User Answer List by Quiz Date
	public function fetchAnswerListbyDateFilter($data){
		if($data["qtype"] == "EB")
		{
			$str = "SELECT A.id, A.firstname, A.middlename, A.lastname, A.branch, A.department,
					(	SELECT COALESCE(score, 0) 
						FROM tbl_score
						WHERE account_id = A.id
					) AS score
					FROM tbl_essay AS E
					JOIN tbl_account AS A ON E.account_id = A.id
					WHERE (A.usertype != 'Admin')
					AND E.datetime_taken LIKE '".$data["filterdate"]."%'
					GROUP BY A.id
					ORDER BY A.lastname";
		}
		else
		{
			$str = "SELECT A.id, A.firstname, A.middlename, A.lastname, A.branch, A.department, E.score
					FROM tbl_userscore AS E
					JOIN tbl_account AS A ON E.account_id = A.id
					WHERE (A.usertype != 'Admin')
					AND E.date_taken LIKE '".$data["filterdate"]."%'
					GROUP BY A.id
					ORDER BY A.lastname";
		}
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Fetch Score List by Date Filter
	public function fetchScoreListbyDateFilter($data){
		if($data["qtype"] == "EB")
		{
			$str = "SELECT A.id, A.firstname, A.middlename, A.lastname, A.branch, A.department, 
					(	SELECT COALESCE(score, 0) 
						FROM tbl_score
						WHERE account_id = A.id
					) AS score
					FROM tbl_essay AS E
					JOIN tbl_account AS A ON E.account_id = A.id
					WHERE (A.usertype != 'Admin')
					AND E.datetime_taken LIKE '".$data["filterdate"]."%'
					GROUP BY A.id
					ORDER BY A.lastname";
		}
		else
		{
			$str = "SELECT A.id, A.firstname, A.middlename, A.lastname, A.branch, A.department, E.score
					FROM tbl_userscore AS E
					JOIN tbl_account AS A ON E.account_id = A.id
					WHERE (A.usertype != 'Admin')
					AND E.date_taken LIKE '".$data["filterdate"]."%'
					GROUP BY A.id
					ORDER BY A.lastname";
		}
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	public function fetch_quizmaster(){
		$str = "SELECT * FROM tbl_quizmaster WHERE is_active != 0";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Fetch Quiz Details
	public function fetch_quizDetails($quizId){
		$str = "SELECT * FROM tbl_quizmaster WHERE quiz_id = '".$quizId."'";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Fetch Quiz Question
	public function fetch_question($data){
		$table = ($data["quizType"] == "Essay") ? "tbl_quizessay" : "tbl_quizquestion";
		$conditions = ($data["quizType"] == "Essay") ? "quiz_id = '".$data["quizId"]."'" : "qm_id = '".$data["quizId"]."'";
		$str = "SELECT * FROM ".$table." WHERE ".$conditions;
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Fetch Quiz Question
	public function fetch_itemChoices($data){
		$str = "SELECT * FROM tbl_quizitemchoice WHERE q_id LIKE '".$data["quizId"]."%'";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	public function deactivate_quizId($quizID){
		$this->db->set('is_active', 0);
		$this->db->where('quiz_id',$quizID);
        $this->db->update('tbl_quizmaster');
        return true;
	}

	public function saveBlankQuiz($data){
		$this->db->insert('tbl_quizmaster', $data);
		return true;
	}

	public function getAnswerSheetBlankQuiz($data){
		$str = "SELECT * FROM tbl_essay WHERE quiz_id = '".$data["quiz_id"]."' AND account_id = ".$data["account_id"]."";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	public function fetchDateList($data){
		if($data["qtype"] == "1")
		{
			$str = "SELECT DATE_FORMAT(STR_TO_DATE(datetime_taken, '%m/%d/%Y'), '%m/%d/%Y') AS DATETAKEN 
				FROM tbl_essay
				GROUP BY DATETAKEN
				ORDER BY DATETAKEN DESC";
		}
		else
		{
			$str = "SELECT DATE_FORMAT(STR_TO_DATE(date_taken, '%m/%d/%Y'), '%m/%d/%Y') AS DATETAKEN 
				FROM tbl_userscore
				GROUP BY DATETAKEN
				ORDER BY DATETAKEN DESC";
		}
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	public function fetchQuizNameList($data){
		$str = "SELECT Q.quiz_name, Q.quiz_id
				FROM tbl_essay AS E
				INNER JOIN tbl_quizmaster AS Q ON E.quiz_id = Q.quiz_id
				WHERE E.datetime_taken LIKE '".$data["datefilter"]."%'
				GROUP BY Q.quiz_id, Q.quiz_name";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Fetch User Answer List by Quiz Date
	public function fetchFilteredAnswerList($data){
		if($data["qtype"] == "EB")
		{
			$str = "SELECT A.id, A.firstname, A.middlename, A.lastname, A.branch, A.department,
					(	SELECT COALESCE(score, 0) 
						FROM tbl_score
						WHERE account_id = A.id  AND quiz_id = '".$data["quizId"]."'
					) AS score
					FROM tbl_essay AS E
					JOIN tbl_account AS A ON E.account_id = A.id
					WHERE (A.usertype != 'Admin')
					AND E.datetime_taken LIKE '".$data["datefilter"]."%'
					AND E.quiz_id = '".$data["quizId"]."'
					GROUP BY A.id
					ORDER BY A.lastname";
		}
		else
		{
			$str = "SELECT A.id, A.firstname, A.middlename, A.lastname, A.branch, A.department, E.score
					FROM tbl_userscore AS E
					JOIN tbl_account AS A ON E.account_id = A.id
					WHERE (A.usertype != 'Admin')
					AND E.date_taken LIKE '".$data["datefilter"]."%'
					AND E.quiz_id = '".$data["quizId"]."'
					GROUP BY A.id
					ORDER BY A.lastname";
		}
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	public function fetchFilteredScoreList($data){
		if($data["qtype"] == "EB")
		{
			$str = "SELECT A.id, A.firstname, A.middlename, A.lastname, A.branch, A.department, 
					(	SELECT COALESCE(score, 0) 
						FROM tbl_score
						WHERE account_id = A.id  AND quiz_id = '".$data["quizId"]."'
					) AS score
					FROM tbl_essay AS E
					JOIN tbl_account AS A ON E.account_id = A.id
					WHERE (A.usertype != 'Admin')
					AND E.datetime_taken LIKE '".$data["datefilter"]."%'
					AND E.quiz_id = '".$data["quizId"]."'
					GROUP BY A.id
					ORDER BY A.lastname";
		}
		else
		{
			$str = "SELECT A.id, A.firstname, A.middlename, A.lastname, A.branch, A.department, E.score
					FROM tbl_userscore AS E
					JOIN tbl_account AS A ON E.account_id = A.id
					WHERE (A.usertype != 'Admin')
					AND E.date_taken LIKE '".$data["datefilter"]."%'
					AND E.quiz_id = '".$data["quizId"]."'
					ORDER BY A.lastname";
		}
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
// Creation Datetime: 11/4/2023 8:41 AM

// Description:
// Quiz Model of the Kelin Product Quiz Web Application.