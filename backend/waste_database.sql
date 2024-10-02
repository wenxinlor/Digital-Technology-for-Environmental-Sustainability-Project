SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- Database: DTES Database
-- (Replace 'YourDatabaseName' with the desired name of your database)
CREATE DATABASE IF NOT EXISTS dtes_database DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
-- Table structure for table malls

USE dtes_database;
DROP TABLE IF EXISTS malls;
CREATE TABLE IF NOT EXISTS malls (
  mall_id CHAR(3) NOT NULL,
  mall_name VARCHAR(20) NOT NULL,
  PRIMARY KEY (mall_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table malls
INSERT INTO malls (mall_id, mall_name) VALUES 
('PSG', 'Plaza Singapura');

-- Table structure for table tenants
DROP TABLE IF EXISTS tenants;
CREATE TABLE IF NOT EXISTS tenants (
    tenant_id INT NOT NULL,
    tenant_name VARCHAR(20) NOT NULL,
    mall_id CHAR(3) NOT NULL,
    PRIMARY KEY (tenant_id),
    FOREIGN KEY (mall_id) REFERENCES malls(mall_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table tenants
INSERT INTO tenants (tenant_id, tenant_name, mall_id) VALUES 
(1, '2ft. Orthotics', 'PSG'),
(2, '6IXTY8IGHT', 'PSG'),
(3, '7 Eleven', 'PSG'),
(4, '85 Redhill Teochew Fishball Noodle', 'PSG'),
(5, 'Acai Beach Club', 'PSG'),
(6, 'AIBI', 'PSG'),
(7, 'AKEMI', 'PSG'),
(8, 'Aki Sushi & Grill', 'PSG'),
(9, 'Akimitsu', 'PSG'),
(10, 'ALDO', 'PSG');

-- Table structure for table waste
DROP TABLE IF EXISTS waste;
CREATE TABLE IF NOT EXISTS waste (
    waste_id CHAR(2) NOT NULL,
    waste_stream VARCHAR(20) NOT NULL,
    PRIMARY KEY (waste_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table waste
INSERT INTO waste (waste_id, waste_stream) VALUES 
('FW', 'Food Waste'),
('GL', 'Glass'),
('GW', 'General Waste'),
('MT', 'Metal'),
('PL', 'Plastic'),
('PP', 'Paper');

-- Table structure for table audits
DROP TABLE IF EXISTS audits;
CREATE TABLE IF NOT EXISTS audits (
    audit_id INT NOT NULL AUTO_INCREMENT,
    audit_status VARCHAR(20) NOT NULL,
    mall_id CHAR(3) NOT NULL,
    PRIMARY KEY (audit_id),
    FOREIGN KEY (mall_id) REFERENCES malls(mall_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table audits
INSERT INTO audits (audit_id, audit_status, mall_id) VALUES 
(1, 'Completed', 'PSG'),
(2, 'Incomplete', 'PSG'),
(3, 'In-Progress', 'PSG');

-- Table structure for table scanned_entries
DROP TABLE IF EXISTS scanned_entries;
CREATE TABLE IF NOT EXISTS scanned_entries (
    entry_id INT NOT NULL AUTO_INCREMENT,
    mall_id CHAR(3) NOT NULL,
    tenant_id INT NOT NULL,
    audit_date DATETIME,
    waste_id CHAR(2) NOT NULL,
    weight DECIMAL(8, 4),
    PRIMARY KEY (entry_id),
    FOREIGN KEY (mall_id) REFERENCES malls(mall_id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table scanned_entries
INSERT INTO scanned_entries (entry_id, mall_id, tenant_id, audit_date, waste_id, weight) VALUES
(100, 'PSG', 1, '2024-03-20 09:30:00', 'PL', 20.3520),
(101, 'PSG', 1, '2024-03-20 10:00:00', 'PP', 5.2300);

COMMIT;
