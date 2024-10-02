SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
--
-- Database: Waste
--
CREATE DATABASE IF NOT EXISTS waste DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE waste;
--
-- Table structure for table waste
--
DROP TABLE IF EXISTS waste;
CREATE TABLE IF NOT EXISTS waste (
    waste_id CHAR(2) NOT NULL,
    waste_stream VARCHAR(20) NOT NULL,
    PRIMARY KEY (waste_id),
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
--
-- Dumping data for table waste
--
INSERT INTO waste (waste_id, waste_stream) VALUES 
('FW', 'Food Waste'),
('GL', 'Glass'),
('GW', 'General Waste'),
('MT', 'Metal'),
('PL', 'Plastic'),
('PP', 'Paper');
COMMIT;