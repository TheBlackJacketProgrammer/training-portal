<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$route['default_controller'] = 'ctrl_main';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;

// Custom routes 
$route['authenticate'] = 'Ctrl_Main/authenticate';
$route['loadview'] = 'Ctrl_Main/load_view';

// Module Routes
$route['manage_quiz'] = 'Ctrl_Module/module_manageQuiz';

// Quiz Routes
$route['get_quizlist'] = 'Ctrl_Quiz/get_quizlist';