SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
--
-- Database: Tenants
--
CREATE DATABASE IF NOT EXISTS tenants DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE tenants;
--
-- Table structure for table tenants
--
DROP TABLE IF EXISTS tenants;
CREATE TABLE IF NOT EXISTS tenants (
    tenant_id INT NOT NULL,
    tenant_name VARCHAR(20) NOT NULL,
    mall_id CHAR(3) NOT NULL,
    PRIMARY KEY (tenant_id),
    FOREIGN KEY (mall_id) REFERENCES malls(mall_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
--
-- Dumping data for table tenants
--
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
COMMIT;