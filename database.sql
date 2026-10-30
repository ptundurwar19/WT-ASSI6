-- ====================================================
-- VIT SEMESTER RESULT PORTAL - DATABASE INITIALIZATION
-- ====================================================

-- 1. Create and switch to the database
CREATE DATABASE IF NOT EXISTS vit_result_db;
USE vit_result_db;

-- 2. Users Table (Managed automatically by Spring Boot JPA)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);

-- 3. Student Results Table (Managed automatically by Spring Boot JPA)
CREATE TABLE IF NOT EXISTS student_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    student_name VARCHAR(100) NOT NULL,
    prn VARCHAR(30) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    
    subject1 VARCHAR(100) NOT NULL,
    mse1 DOUBLE NOT NULL,
    ese1 DOUBLE NOT NULL,
    
    subject2 VARCHAR(100) NOT NULL,
    mse2 DOUBLE NOT NULL,
    ese2 DOUBLE NOT NULL,
    
    subject3 VARCHAR(100) NOT NULL,
    mse3 DOUBLE NOT NULL,
    ese3 DOUBLE NOT NULL,
    
    subject4 VARCHAR(100) NOT NULL,
    mse4 DOUBLE NOT NULL,
    ese4 DOUBLE NOT NULL
);

-- Note: Spring Boot's DataInitializer automatically creates default users and sample results upon startup:
-- Admin User: admin / admin123
-- Student User: student / student123
