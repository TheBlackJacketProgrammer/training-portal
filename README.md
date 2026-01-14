# KGS Training Portal

A web-based training and assessment platform built for Kelin Graphics System (KGS) to manage employee training, quizzes, and performance tracking.

![PHP](https://img.shields.io/badge/PHP-5.6+-777BB4?style=flat-square&logo=php&logoColor=white)
![CodeIgniter](https://img.shields.io/badge/CodeIgniter-3.x-EF4223?style=flat-square&logo=codeigniter&logoColor=white)
![AngularJS](https://img.shields.io/badge/AngularJS-1.x-E23237?style=flat-square&logo=angularjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-5.7+-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-4.x-7952B3?style=flat-square&logo=bootstrap&logoColor=white)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Development](#-development)
- [License](#-license)

## ✨ Features

### User Management
- **Authentication** - Secure login/logout with session management
- **Registration** - Employee self-registration with ID verification
- **Password Recovery** - Account recovery functionality
- **User Profiles** - View and update personal information

### Quiz System
- **Product Matching Quiz** - Interactive quizzes for product knowledge testing
- **Quiz Browser** - Browse and take available quizzes
- **Quiz Management** - Create and manage quiz content (Admin)
- **Answer Sheet Records** - View historical quiz attempts

### Performance Tracking
- **Scoreboard** - Track quiz scores and rankings
- **Admin Dashboard** - Comprehensive score overview for administrators
- **User Dashboard** - Personal performance metrics

### Additional Modules
- **Product Master List** - Product catalog management
- **Employee Feedback** - Feedback system for employee development
- **Event Logging** - Quiz activity and event tracking

### Role-Based Access Control
- **Admin** - Full system access and management
- **Developer** - Development and testing features
- **GM (General Manager)** - Managerial oversight features
- **Employee** - Standard user access

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Backend** | PHP 5.6+, CodeIgniter 3.x |
| **Frontend** | AngularJS 1.x, jQuery 3.7.1 |
| **UI Framework** | AdminLTE 3.x, Bootstrap 4.x |
| **Database** | MySQL 5.7+ |
| **CSS Preprocessor** | SASS |
| **Notifications** | Toastr.js |
| **Server** | Apache (XAMPP/LAMP/WAMP) |

## 📦 Prerequisites

Before installation, ensure you have:

- **PHP** >= 5.6 (7.x recommended)
- **MySQL** >= 5.7
- **Apache** with `mod_rewrite` enabled
- **Node.js** >= 14.x (for SASS compilation)
- **Composer** (optional, for dependencies)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/training-portal.git
cd training-portal
```

### 2. Configure Web Server

Place the project in your web server's document root:
- **XAMPP**: `C:\xampp\htdocs\training-portal`
- **WAMP**: `C:\wamp\www\training-portal`
- **LAMP**: `/var/www/html/training-portal`

### 3. Install Node Dependencies

```bash
npm install
```

### 4. Database Setup

1. Create a MySQL database named `db_training_portal`
2. Import the database schema (if available)
3. Update database credentials in `application/config/database.php`

### 5. Configure Application

Update the base URL in `application/config/config.php`:

```php
$config['base_url'] = 'http://localhost/training-portal/';
```

### 6. Set Permissions (Linux/Mac)

```bash
chmod -R 755 application/cache
chmod -R 755 application/logs
```

## ⚙️ Configuration

### Database Configuration

Edit `application/config/database.php`:

```php
$db['default'] = array(
    'hostname' => 'localhost',
    'username' => 'your_username',
    'password' => 'your_password',
    'database' => 'db_training_portal',
    'dbdriver' => 'mysqli',
    // ... other settings
);
```

### Environment Settings

Set the environment in `index.php`:

```php
// Development
define('ENVIRONMENT', 'development');

// Production
define('ENVIRONMENT', 'production');
```

## 📁 Project Structure

```
training-portal/
├── application/
│   ├── config/          # Configuration files
│   ├── controllers/     # PHP Controllers
│   │   ├── Ctrl_Main.php
│   │   ├── Ctrl_Quiz.php
│   │   ├── Ctrl_Product.php
│   │   └── ...
│   ├── models/          # Database models
│   │   ├── Model_Main.php
│   │   ├── Model_Quiz.php
│   │   └── ...
│   └── views/           # View templates
│       ├── sections/    # Main section views
│       ├── modules/     # Module views
│       ├── modals/      # Modal dialogs
│       └── quiz_templates/
├── assets/
│   ├── angular_js/      # AngularJS library
│   ├── custom_bootstrap/# AdminLTE & Bootstrap
│   ├── custom_css/      # Compiled CSS
│   ├── images/          # Image assets
│   ├── jquery/          # jQuery library
│   ├── sass/            # SASS source files
│   ├── scripts/         # JavaScript controllers
│   └── toastr/          # Notification library
├── products/            # Product images
├── system/              # CodeIgniter core
├── index.php            # Application entry point
├── package.json         # Node.js dependencies
└── composer.json        # PHP dependencies
```

## 💻 Usage

### Accessing the Application

1. Start your web server (Apache & MySQL)
2. Navigate to `http://localhost/training-portal/`
3. Log in with your employee credentials

### User Roles

| Role | Access Level |
|------|--------------|
| Admin | Full access to all modules, user management, quiz creation |
| Developer | Development dashboard and testing tools |
| GM | Managerial reports and oversight features |
| Employee | Quiz taking, scoreboard, profile management |

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ctrl_main/authenticate` | User login |
| POST | `/ctrl_main/logout` | User logout |
| POST | `/ctrl_main/register` | User registration |
| POST | `/ctrl_main/verify_account` | Verify account for recovery |

### Quiz Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ctrl_quiz/get_quizlist` | Get all quizzes |
| POST | `/ctrl_quiz/insert_quiz` | Create new quiz |

### User & Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ctrl_main/fetch_userprofile` | Get user profile |
| POST | `/ctrl_main/update_employee` | Update user info |

## 🧑‍💻 Development

### SASS Compilation

Compile SASS to CSS:

```bash
# One-time compilation
npm run sass

# Watch mode (auto-compile on changes)
npm run sass:watch
```

### SASS Structure

```
assets/sass/
├── _variables.scss      # Global variables
├── _layouts.scss        # Layout styles
├── _login.scss          # Login page styles
├── _dashboard.scss      # Dashboard styles
├── _module-manage-quiz.scss
├── _answer-sheet-records.scss
├── main.scss            # Main entry file
└── modal/
    └── _modal-create-quiz.scss
```

### Adding New Features

1. Create controller in `application/controllers/`
2. Create model in `application/models/`
3. Add views in `application/views/`
4. Add routes in `application/config/routes.php`
5. Create AngularJS controller in `assets/scripts/`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](license.txt) file for details.

---

## 👨‍💻 Developer

**Marvin V. Bergado**  
- **Full Stack Web Developer**
- **Specialization** - PHP, JavaScript, Modern Web Technologies
- **Architecture** - MVC Pattern, RESTful APIs, Responsive Design


---

<p align="center">
  <strong>Copyright © 2024 KGS-MIS. All rights reserved.</strong>
</p>
