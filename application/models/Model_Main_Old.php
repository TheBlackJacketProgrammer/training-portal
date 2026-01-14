<?php
class Model_Main extends CI_Model 
{
	// Authenticate User
	public function authenticate($data)
	{
		$str = "SELECT * FROM tbl_account WHERE employee_id = '".$data['employeeId']."' AND password = '".$data['password']."'";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Fetch Scoreboard - Admin
	public function fetch_scoreboardAdmin()
	{
		$str = "SELECT 	S.id, 
						S.datetime_taken, 
						S.score, S.quiz_id, 
						S.account_id, 
						A.employee_id, 
						A.department, 
						A.branch, 
						CONCAT(A.lastname,', ', A.firstname, ' ', A.middlename ) AS fullname 
				FROM tbl_score AS S
				INNER JOIN tbl_account AS A
				ON A.id = S.account_id 
				ORDER BY S.score DESC";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Fetch Scoreboard 
	public function fetch_scoreboard($id)
	{
		$str = "SELECT S.account_id, QM.quiz_name, QM.quiz_id, S.datetime_taken, S.score
				FROM tbl_score AS S
				JOIN tbl_quizmaster AS QM ON QM.quiz_id = S.quiz_id
				WHERE S.account_id = ".$id."";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Insert Product
	public function insert_employee($data)
	{
		$this->db->insert('tbl_account',$data);
		return true;
	}

	// Check Employee if Exist
	public function check_employee($employeeId)
	{
        $str = "SELECT EXISTS(SELECT id FROM tbl_account WHERE employee_id = '".$employeeId."') AS TOKEN";
        $query = $this->db->query($str); 
        // $result = $query->result();
        foreach ($query->result() as $row)
        {
            $status =  intval($row->TOKEN);
        }
        return $status;
		
	}

	public function module_userProfile($id)
	{
		$str = "SELECT * FROM tbl_account WHERE id = ".$id."";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Update Category
	public function update_employee($data){
        $this->db->set('employee_id', $data['employee_id']);
        $this->db->set('firstname', $data['firstname']);
        $this->db->set('lastname', $data['lastname']);
        $this->db->set('middlename', $data['middlename']);
        $this->db->set('password', $data['password']);
        $this->db->set('department', $data['department']);
        $this->db->set('branch', $data['branch']);
        $this->db->where('id',$data['id']);
        $this->db->update('tbl_account');
        return true;
	}

	// SELECT DISTINCT(quiz_id) FROM tbl_score

	public function fetch_quizName(){
		$str = "SELECT DISTINCT(quiz_id) FROM tbl_score";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}
	
	// Check if the Employee Id exist
	public function verifyEmployee($eeIdNo)
	{
		$dbkgs = $this->load->database('db_kgs', TRUE);  
		$dbkgs->where('ee_id_no', $eeIdNo);
		$query = $dbkgs->get('tbl_employee');
		$isExist = $query->num_rows();
        return $isExist;
	}
	
	// Check if account is exist
	public function checkAccount($employeeId)
	{
		$query = $this->db->get_where('tbl_account', array('employee_id' => $employeeId));
		$count = $query->num_rows(); 
		return $count;
	}
	
	// Get Employee Data
	public function getEmployeeData($eeIdNo)
	{
		$dbkgs = $this->load->database('db_kgs', TRUE);
		$str = "SELECT	E.id,
						E.ee_id_no, 
						E.lastname, 
				        E.firstname, 
				        E.middlename,
				        DS.designation,
				        E.designation_id,
				        DV.division,
				        E.division_id,
				        DP.department,
				        E.department_id,
				        E.is_active
				FROM db_kgs.tbl_employee AS E
				JOIN db_kgs.tbl_designation AS DS
				ON DS.id = E.designation_id 
				JOIN db_kgs.tbl_division AS DV
				ON DV.id = E.division_id
				JOIN db_kgs.tbl_department AS DP
				ON DP.id = E.department_id
				WHERE E.ee_id_no = '".$eeIdNo."'
				ORDER BY E.lastname DESC";
        $query = $dbkgs->query($str); 
        $result = $query->result();
		$employeeDetails = $query->result();
        return $employeeDetails;
	}

	// Verify Account
	public function verify_account($data){
		$str = "SELECT id 
				FROM tbl_account 
				WHERE employee_id = '".$data['employee_id']."' 
					AND firstname = '".$data['firstname']."' 
					AND middlename = '".$data['middlename']."' 
					AND lastname = '".$data['lastname']."'";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Update Password
	public function update_password($data){
		$this->db->set('password', $data['new_password']);
        $this->db->where('id',$data['id']);
        $this->db->update('tbl_account');
        return true;
	}

	// Fetch Employees 
	public function fetch_employeeList($params)
	{
		$dbkgs = $this->load->database('db_kgs', TRUE);  
		$str = "CALL fetch_employeeList('".$params["employee_id"]."')";
        $query = $dbkgs->query($str); 
        $result = $query->result();
        return $result;
	}

	// Fetch Branches
	public function fetch_branches($params)
	{
		$dbkgs = $this->load->database('db_kgs', TRUE);  
		$str = "CALL fetch_division('".$params["employee_id"]."')";
        $query = $dbkgs->query($str); 
        $result = $query->result();
        return $result;
	}

	// Fetch Departments
	public function fetch_departments($params){
		$dbkgs = $this->load->database('db_kgs', TRUE);  
		$str = "CALL fetch_department('".$params["employee_id"]."')";
        $query = $dbkgs->query($str); 
        $result = $query->result();
        return $result;
	}

	// Fetch Feedback List by Specific Employee
	public function fetch_feedback($params){
		$str = "SELECT * FROM tbl_feedback WHERE employee_id = '".$params["employee_id"]."' AND is_active = 1";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// Save Feedback
	public function save_feedback($params){
		$tbl_feedback['employee_id'] = $params['employee_id'];
		$tbl_feedback['date_created'] = $params['date_created'];
		$tbl_feedback['creator_employee_id'] = $params['creator_employee_id'];
		$tbl_feedback['feedback'] = $params['feedback'];
		$tbl_feedback['remark'] = $params['remark'];
        $this->db->insert('tbl_feedback',$tbl_feedback);
	}

	// Remove Feedback
	public function remove_feedback($params){
		$this->db->set('is_active', 0);
        $this->db->where('data_id',$params['data_id']);
        $this->db->update('tbl_feedback');
	}

	// Update Feedback
	public function update_feedback($params){
		$this->db->set('feedback', $params['feedback']);
		$this->db->set('remark', $params['remark']);
        $this->db->where('data_id',$params['data_id']);
        $this->db->update('tbl_feedback');
        return true;
	}

	// Fetch All Feedbacks 
	public function fetch_all_feedbacks()
	{
		$str = "CALL fetch_all_feedbacks()";
        $query = $this->db->query($str); 
        $result = $query->result();
        return $result;
	}

	// API Update Password
	public function api_update_pass($params)
	{
		$this->db->set('password', $params['password']);
        $this->db->where('employee_id',$params['employee_id']);
        $this->db->update('tbl_account');
	}

	// Fetch Quiz Result
	public function fetch_quizDetails($params){
		$str = "SELECT * 
				FROM tbl_essay
				WHERE account_id = ".$params["account_id"]." AND quiz_id = '".$params["quiz_id"]."'";
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
// Creation Datetime: 11/2/2023 11:15 AM

// Description:
// Main Model of the Kelin Product Quiz Web Application.