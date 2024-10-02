SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
--
-- Database: Scanned Entries
--
CREATE DATABASE IF NOT EXISTS scanned_entries DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE scanned_entries;
--
-- Table structure for table scanned_entries
--
DROP TABLE IF EXISTS scanned_entries;
CREATE TABLE IF NOT EXISTS scanned_entries (
    entry_id INT NOT NULL AUTO_INCREMENT,
    mall_id CHAR(3) NOT NULL,
    tenant_id INT NOT NULL,
    audit_date DATETIME NOT NULL
    waste_id CHAR(2) NOT NULL,
    weight DECIMAL(8, 4),
    PRIMARY KEY (entry_id),
    FOREIGN KEY (mall_id) REFERENCES malls(mall_id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
--
-- Dumping data for table scanned_entries
--
INSERT INTO scanned_entries (entry_id, mall_id, tenant_id, audit_date, waste_id, weight) VALUES
(100, 'PSG', 1, '2024-03-20 10:30:00', 'PL', 20.3520),
(101, 'PSG', 1, '2024-03-20 10:40:00', 'PP', 5.2300);
COMMIT;
