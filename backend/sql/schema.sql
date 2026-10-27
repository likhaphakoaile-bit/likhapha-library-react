CREATE DATABASE IF NOT EXISTS community_library;
USE community_library;
CREATE TABLE IF NOT EXISTS users (
 id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL,
 membership_id VARCHAR(40) NOT NULL UNIQUE, role ENUM('Admin','Librarian','Member') NOT NULL DEFAULT 'Member',
 password_hash VARCHAR(255) NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS books (
 id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(200) NOT NULL, author VARCHAR(150) NOT NULL,
 genre VARCHAR(100) NOT NULL, isbn VARCHAR(30) NOT NULL UNIQUE,
 quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS transactions (
 id INT AUTO_INCREMENT PRIMARY KEY, book_id INT NOT NULL, type ENUM('add','deduct') NOT NULL,
 quantity INT NOT NULL CHECK (quantity > 0), balance_after INT NOT NULL,
 processed_by VARCHAR(120) NOT NULL, note VARCHAR(255) DEFAULT '',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE RESTRICT
);
INSERT IGNORE INTO users (name,membership_id,role) VALUES ('Administrator','ADMIN001','Admin'),('Demo Librarian','LIB001','Librarian');
INSERT IGNORE INTO books (title,author,genre,isbn,quantity) VALUES ('Things Fall Apart','Chinua Achebe','Fiction','9780385474542',4),('The Alchemist','Paulo Coelho','Fiction','9780061122415',1),('Introduction to Computing','Community Library','Technology','9780000000001',3);
