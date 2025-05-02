-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cards
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `setlegalityrel`
--

DROP TABLE IF EXISTS `setlegalityrel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `setlegalityrel` (
  `set_id` varchar(50) NOT NULL,
  `format_id` int NOT NULL,
  PRIMARY KEY (`set_id`,`format_id`),
  KEY `setlegalityrel_ibfk_2` (`format_id`),
  CONSTRAINT `setlegalityrel_ibfk_1` FOREIGN KEY (`set_id`) REFERENCES `card_set` (`set_id`) ON DELETE CASCADE,
  CONSTRAINT `setlegalityrel_ibfk_2` FOREIGN KEY (`format_id`) REFERENCES `legality` (`format_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setlegalityrel`
--

LOCK TABLES `setlegalityrel` WRITE;
/*!40000 ALTER TABLE `setlegalityrel` DISABLE KEYS */;
INSERT INTO `setlegalityrel` VALUES ('fut20',1),('pgo',1),('sv1',1),('sv2',1),('sv3',1),('sv3pt5',1),('sv4',1),('sv4pt5',1),('sv5',1),('sv6',1),('sv6pt5',1),('sv7',1),('sv8',1),('sv8pt5',1),('sv9',1),('sve',1),('svp',1),('swsh10',1),('swsh10tg',1),('swsh11',1),('swsh11tg',1),('swsh12',1),('swsh12pt5',1),('swsh12pt5gg',1),('swsh12tg',1),('swsh9',1),('swsh9tg',1),('swshp',1),('bw1',2),('bw10',2),('bw11',2),('bw2',2),('bw3',2),('bw4',2),('bw5',2),('bw6',2),('bw7',2),('bw8',2),('bw9',2),('bwp',2),('cel25',2),('dc1',2),('det1',2),('dv1',2),('fut20',2),('g1',2),('pgo',2),('sm1',2),('sm10',2),('sm11',2),('sm115',2),('sm12',2),('sm2',2),('sm3',2),('sm35',2),('sm4',2),('sm5',2),('sm6',2),('sm7',2),('sm75',2),('sm8',2),('sm9',2),('sma',2),('smp',2),('sv1',2),('sv2',2),('sv3',2),('sv3pt5',2),('sv4',2),('sv4pt5',2),('sv5',2),('sv6',2),('sv6pt5',2),('sv7',2),('sv8',2),('sv8pt5',2),('sv9',2),('sve',2),('svp',2),('swsh1',2),('swsh10',2),('swsh10tg',2),('swsh11',2),('swsh11tg',2),('swsh12',2),('swsh12pt5',2),('swsh12pt5gg',2),('swsh12tg',2),('swsh2',2),('swsh3',2),('swsh35',2),('swsh4',2),('swsh45',2),('swsh45sv',2),('swsh5',2),('swsh6',2),('swsh7',2),('swsh8',2),('swsh9',2),('swsh9tg',2),('swshp',2),('xy0',2),('xy1',2),('xy10',2),('xy11',2),('xy12',2),('xy2',2),('xy3',2),('xy4',2),('xy5',2),('xy6',2),('xy7',2),('xy8',2),('xy9',2),('xyp',2);
/*!40000 ALTER TABLE `setlegalityrel` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-01 22:17:03
