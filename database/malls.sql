SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
--
-- Database: Malls
--
CREATE DATABASE IF NOT EXISTS malls DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE malls;
--
-- Table structure for table malls
--
DROP TABLE IF EXISTS malls;
CREATE TABLE IF NOT EXISTS malls (
  mall_id CHAR(3) NOT NULL,
  mall_name VARCHAR(20) NOT NULL,
  PRIMARY KEY (mall_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
--
-- Dumping data for table malls
--
INSERT INTO malls (mall_id, mall_name) VALUES 
('PSG', 'Plaza Singapura');
COMMIT;