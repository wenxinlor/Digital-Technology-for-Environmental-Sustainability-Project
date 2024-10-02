SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
--
-- Database: Audits
--
CREATE DATABASE IF NOT EXISTS audits DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE audits;
--
-- Table structure for table audits
--
DROP TABLE IF EXISTS audits;
CREATE TABLE IF NOT EXISTS audits (
    audit_id CHAR(1) NOT NULL,
    audit_status VARCHAR(20) NOT NULL,
    PRIMARY KEY (audit_id)
    FOREIGN KEY (mall_id) REFERENCES malls(mall_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
--
-- Dumping data for table audits
--
INSERT INTO audits (audit_id, audit_status, mall_id) VALUES 
('C', 'Completed', 'PSG'),
('I', 'Incomplete', 'PSG'),
('P', 'In-Progress', 'PSG');
COMMIT;
