<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>KGS Training Portal</title>

    <!-- Preconnect to Google Fonts for faster loading -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Icons -->
    <link rel="apple-touch-icon" href="<?php echo base_url()?>assets/images/kelin.ico" type="image/x-icon" />
    <link rel="shortcut icon" href="<?php echo base_url()?>assets/images/kelin.ico" type="image/x-icon" /> 

    <!-- Font Awesome -->
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/plugins/fontawesome-free/css/all.min.css">

    <!-- Ionicons -->
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/plugins/ionicframework/ionicons.min.css">
    <!-- Tempusdominus Bootstrap 4 -->
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css">
    <!-- iCheck -->
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/plugins/icheck-bootstrap/icheck-bootstrap.min.css">
    <!-- JQVMap -->
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/plugins/jqvmap/jqvmap.min.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/dist/css/adminlte.min.css">
    <!-- overlayScrollbars -->
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
    <!-- Daterange picker -->
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/plugins/daterangepicker/daterangepicker.css">
    <!-- Summernote -->
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/plugins/summernote/summernote-bs4.min.css">
    <!-- Select2 -->
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/plugins/select2/css/select2.min.css">
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css">
    <!-- Bootstrap4 Duallistbox -->
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/plugins/bootstrap4-duallistbox/bootstrap-duallistbox.min.css">
    <!-- BS Stepper -->
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/plugins/bs-stepper/css/bs-stepper.min.css">
    <!-- dropzonejs -->
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/plugins/dropzone/min/dropzone.min.css">
    <!-- DataTables -->
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css">
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/plugins/datatables-responsive/css/responsive.bootstrap4.min.css">
    <link rel="stylesheet" href="<?php echo base_url()?>assets/custom_bootstrap/plugins/datatables-buttons/css/buttons.bootstrap4.min.css">

    <!-- Custom Styles -->
    <link rel="stylesheet" type="text/css" href="<?php echo base_url()?>assets/custom_css/custom_css.css">
    <link rel="stylesheet" type="text/css" href="<?php echo base_url()?>assets/custom_css/loading.css">
    <link rel="stylesheet" type="text/css" href="<?php echo base_url()?>assets/custom_css/main.css">

    <!-- Toastr CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/toastr/toastr.min.css'); ?>">

  
  </head>
  <body class="hold-transition sidebar-mini layout-fixed"  style="background-color: #dde6eb;" ng-app="kelin">
    <div class="wrapper">
      <!-- Preloader -->
      <div class="preloader flex-column justify-content-center align-items-center">
        <img class="animation__shake" src="<?php echo base_url()?>assets/images/kelin.webp" alt="Kelin Logo" height="200" width="400">
      </div>
      <main>
        <div ng-controller="ctrl_variables">
          <div ng-controller="ctrl_main" ng-init="load_view()">
            <div compile="section"></div>
          </div>  
        </div>   
      </main>
    </div>
    
    
    <!-- jQuery -->
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/jquery/jquery-3.7.1.js"></script>
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/jquery-ui/jquery-ui.min.js"></script>

    <!-- Bootstrap 4 -->
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
    
    <!-- DataTables and Plugin -->
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/datatables/jquery.dataTables.min.js"></script>
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js"></script>
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/datatables-responsive/js/dataTables.responsive.min.js"></script>
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/datatables-responsive/js/responsive.bootstrap4.min.js"></script>
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/datatables-buttons/js/dataTables.buttons.min.js"></script>
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/datatables-buttons/js/buttons.bootstrap4.min.js"></script>
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/jszip/jszip.min.js"></script>
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/pdfmake/pdfmake.min.js"></script>
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/pdfmake/vfs_fonts.js"></script>
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/datatables-buttons/js/buttons.html5.min.js"></script>
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/datatables-buttons/js/buttons.print.min.js"></script>
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/datatables-buttons/js/buttons.colVis.min.js"></script>

    <!-- overlayScrollbars -->
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
    <!-- Select2 -->
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/select2/js/select2.full.min.js"></script>
    <!-- Bootstrap4 Duallistbox -->
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/bootstrap4-duallistbox/jquery.bootstrap-duallistbox.min.js"></script>
    <!-- Moment JS -->
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/moment/moment.min.js"></script>
    <!-- InputMask -->
    <!-- <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/inputmask/jquery.inputmask.min.js"></script> -->
    <!-- date-range-picker -->
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/moment/moment.min.js"></script>
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/daterangepicker/daterangepicker.js"></script>
    <!-- ChartJS -->
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/chart.js/Chart.min.js"></script>
    <!-- bootstrap color picker -->
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.min.js"></script>
    <!-- Tempusdominus Bootstrap 4 -->
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js"></script>
    <!-- Bootstrap Switch -->
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/bootstrap-switch/js/bootstrap-switch.min.js"></script>
    <!-- BS-Stepper -->
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/bs-stepper/js/bs-stepper.min.js"></script>
    <!-- dropzonejs -->
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/dropzone/min/dropzone.min.js"></script>
    <!-- bs-custom-file-input -->
    <script src="<?php echo base_url()?>assets/custom_bootstrap/plugins/bs-custom-file-input/bs-custom-file-input.min.js"></script>
    <!-- AdminLTE App -->
    <script src="<?php echo base_url()?>assets/custom_bootstrap/dist/js/adminlte.min.js"></script>

    <!-- Toastr JS -->
    <script src="<?php echo base_url()?>assets/toastr/toastr.min.js"></script>

    <!-- Angular JS -->
    <script src="<?php echo base_url()?>assets/angular_js/angularjs_1.6.9.min.js"></script>

    <!-- Angular JS Datatable -->
    <script src="<?php echo base_url()?>assets/angular_js/angular-datatables.min.js"></script>

    <!-- Angular JS Excel Reader -->
    <script src="<?php echo base_url()?>assets/angular_js/xlsx-full-min.js"></script>

    <!-- Angular JS Main Module -->
    <script src="<?php echo base_url()?>assets/scripts/app_main.js"></script>

    <!-- Angular JS Scripts -->
    <script src="<?php echo base_url()?>assets/scripts/ctrl_variables.js"></script>
    <script src="<?php echo base_url()?>assets/scripts/ctrl_main.js"></script>
    <script src="<?php echo base_url()?>assets/scripts/ctrl_section_dashboard.js"></script>
    <script src="<?php echo base_url()?>assets/scripts/ctrl_module_manage_quiz.js"></script>
    <script src="<?php echo base_url()?>assets/scripts/ctrl_create_quiz.js"></script>
    <script src="<?php echo base_url()?>assets/scripts/ctrl_product_masterlist.js"></script>
    <script src="<?php echo base_url()?>assets/scripts/ctrl_feedback.js"></script>
    <script src="<?php echo base_url()?>assets/scripts/ctrl_browse_quiz.js"></script>
  </body>
</html>
