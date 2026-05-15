CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS organizations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS organization_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  user_id INT NOT NULL,
  organization_id INT NOT NULL,
  role_id INT NOT NULL,

  employee_code VARCHAR(20) UNIQUE,

  designation VARCHAR(100),
  department VARCHAR(100),
  
  phone VARCHAR(15),
  profile_pic VARCHAR(255),
  
  skills TEXT,
  bio TEXT,

  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive') DEFAULT 'active',

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,

  INDEX idx_employee_code (employee_code),
  INDEX idx_organization (organization_id),
  INDEX idx_user (user_id)
);
CREATE TABLE IF NOT EXISTS reporting_structure (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  manager_id INT,
  FOREIGN KEY (employee_id) REFERENCES organization_users(id),
  FOREIGN KEY (manager_id) REFERENCES organization_users(id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  assigned_to INT,
  created_by INT,
  status ENUM('pending','in_progress','completed'),
  completion_status ENUM('pending','approved','rejected'),
  priority ENUM('low','medium','high') DEFAULT 'low',
  deadline DATETIME,
  completed_at DATETIME,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES organization_users(id),
  FOREIGN KEY (created_by) REFERENCES organization_users(id)
);

CREATE TABLE IF NOT EXISTS work_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  task_id INT,
  description TEXT,
  hours_spent FLOAT,
  work_date DATE,
  attachment_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_employee_task (employee_id, task_id),
  FOREIGN KEY (employee_id) REFERENCES organization_users(id),
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

CREATE TABLE IF NOT EXISTS task_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT,
  employee_id INT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (employee_id) REFERENCES organization_users(id)
);
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  reviewer_id INT,
  task_id INT,
  rating INT,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES organization_users(id),
  FOREIGN KEY (reviewer_id) REFERENCES organization_users(id),
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

CREATE TABLE IF NOT EXISTS performance_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  productivity_score FLOAT,
  consistency_score FLOAT,
  deadline_score FLOAT,
  manager_rating_avg FLOAT,
  final_score FLOAT,
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES organization_users(id)
);

CREATE TABLE IF NOT EXISTS ai_feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  strengths TEXT,
  weaknesses TEXT,
  insights TEXT,
  growth_plan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES organization_users(id)
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES organization_users(id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT,
  sender ENUM('user','ai'),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
);

CREATE TABLE IF NOT EXISTS chat_memory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  key_name VARCHAR(100),
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES organization_users(id)
);

CREATE TABLE IF NOT EXISTS knowledge_base (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organization_id INT,
  title VARCHAR(255),
  content TEXT,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS knowledge_embeddings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  knowledge_id INT,
  chunk_text TEXT,
  embedding_vector TEXT,
  FOREIGN KEY (knowledge_id) REFERENCES knowledge_base(id)
);

CREATE TABLE IF NOT EXISTS ai_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  prompt TEXT,
  response TEXT,
  model_used VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES organization_users(id)
);
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  price FLOAT,
  stock_quantity INT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  handled_by INT,
  total_amount FLOAT,
  status ENUM('placed','delivered','returned'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (handled_by) REFERENCES organization_users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  price FLOAT,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS returns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  requested_by INT,
  reason TEXT,
  status ENUM('requested','approved','rejected'),
  refund_amount FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (requested_by) REFERENCES organization_users(id)
);

CREATE TABLE IF NOT EXISTS sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  order_id INT,
  amount FLOAT,
  date DATE,
  FOREIGN KEY (employee_id) REFERENCES organization_users(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS user_sessions (

  id INT AUTO_INCREMENT PRIMARY KEY,

  user_id INT,

  token VARCHAR(500),

  session_id VARCHAR(255),

  is_active BOOLEAN DEFAULT TRUE,

  device_info TEXT,

  ip_address VARCHAR(100),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  expires_at DATETIME,

  FOREIGN KEY (user_id)
  REFERENCES users(id)

);



CREATE TABLE IF NOT EXISTS ai_chat_history (

  id INT PRIMARY KEY AUTO_INCREMENT,

  employee_id INT,

  role VARCHAR(20),

  message TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS  employee_certificates (

  id INT AUTO_INCREMENT PRIMARY KEY,

  employee_id INT,

  certificate_id VARCHAR(100) UNIQUE,

  award_title VARCHAR(255),

  issued_by_manager INT,

  issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  verification_token VARCHAR(255),

  certificate_url TEXT,

  qr_code_url TEXT,

  status VARCHAR(50) DEFAULT 'valid'

);