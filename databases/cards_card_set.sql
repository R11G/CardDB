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
-- Table structure for table `card_set`
--

DROP TABLE IF EXISTS `card_set`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card_set` (
  `set_id` varchar(50) NOT NULL,
  `name` text,
  `print_total` int DEFAULT NULL,
  `total` int DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `series` text,
  `ptcgoCode` text,
  PRIMARY KEY (`set_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card_set`
--

LOCK TABLES `card_set` WRITE;
/*!40000 ALTER TABLE `card_set` DISABLE KEYS */;
INSERT INTO `card_set` VALUES ('bw1','Black & White',114,115,'2011-04-25','Black & White','BLW'),('bw10','Plasma Blast',101,105,'2013-08-14','Black & White','PLB'),('bw11','Legendary Treasures',113,140,'2013-11-06','Black & White','LTR'),('bw2','Emerging Powers',98,98,'2011-08-31','Black & White','EPO'),('bw3','Noble Victories',101,102,'2011-11-16','Black & White','NVI'),('bw4','Next Destinies',99,103,'2012-02-08','Black & White','NXD'),('bw5','Dark Explorers',108,111,'2012-05-09','Black & White','DEX'),('bw6','Dragons Exalted',124,128,'2012-08-15','Black & White','DRX'),('bw7','Boundaries Crossed',149,153,'2012-11-07','Black & White','BCR'),('bw8','Plasma Storm',135,138,'2013-02-06','Black & White','PLS'),('bw9','Plasma Freeze',116,122,'2013-05-08','Black & White','PLF'),('bwp','BW Black Star Promos',101,101,'2011-03-01','Black & White','PR-BLW'),('cel25','Celebrations',25,25,'2021-10-08','Sword & Shield','CEL'),('dc1','Double Crisis',34,34,'2015-03-25','XY','DCR'),('det1','Detective Pikachu',18,18,'2019-04-05','Sun & Moon','DET'),('dv1','Dragon Vault',20,21,'2012-10-05','Black & White','DRV'),('fut20','Pokémon Futsal Collection',5,5,'2020-09-11','Other','FUT20'),('g1','Generations',83,117,'2016-02-22','XY','GEN'),('pgo','Pokémon GO',78,88,'2022-07-01','Sword & Shield','PGO'),('sm1','Sun & Moon',149,173,'2017-02-03','Sun & Moon','SUM'),('sm10','Unbroken Bonds',214,234,'2019-05-03','Sun & Moon','UNB'),('sm11','Unified Minds',236,260,'2019-08-02','Sun & Moon','UNM'),('sm115','Hidden Fates',68,69,'2019-08-23','Sun & Moon','HIF'),('sm12','Cosmic Eclipse',236,272,'2019-11-01','Sun & Moon','CEC'),('sm2','Guardians Rising',145,180,'2017-05-05','Sun & Moon','GRI'),('sm3','Burning Shadows',147,177,'2017-08-05','Sun & Moon','BUS'),('sm35','Shining Legends',73,81,'2017-10-06','Sun & Moon','SLG'),('sm4','Crimson Invasion',111,126,'2017-11-03','Sun & Moon','CIN'),('sm5','Ultra Prism',156,178,'2018-02-02','Sun & Moon','UPR'),('sm6','Forbidden Light',131,150,'2018-05-04','Sun & Moon','FLI'),('sm7','Celestial Storm',168,187,'2018-08-03','Sun & Moon','CES'),('sm75','Dragon Majesty',70,80,'2018-09-07','Sun & Moon','DRM'),('sm8','Lost Thunder',214,240,'2018-11-02','Sun & Moon','LOT'),('sm9','Team Up',181,198,'2019-02-01','Sun & Moon','TEU'),('sma','Hidden Fates Shiny Vault',94,94,'2019-08-23','Sun & Moon','HIF'),('smp','SM Black Star Promos',248,250,'2017-02-03','Sun & Moon','PR-SM'),('sv1','Scarlet & Violet',198,258,'2023-03-31','Scarlet & Violet','SVI'),('sv2','Paldea Evolved',193,279,'2023-06-09','Scarlet & Violet','PAL'),('sv3','Obsidian Flames',197,230,'2023-08-11','Scarlet & Violet','OBF'),('sv3pt5','151',165,207,'2023-09-22','Scarlet & Violet','MEW'),('sv4','Paradox Rift',182,266,'2023-11-03','Scarlet & Violet','PAR'),('sv4pt5','Paldean Fates',91,245,'2024-01-26','Scarlet & Violet','PAF'),('sv5','Temporal Forces',162,218,'2024-03-22','Scarlet & Violet','TEF'),('sv6','Twilight Masquerade',167,226,'2024-05-24','Scarlet & Violet','TWM'),('sv6pt5','Shrouded Fable',64,99,'2024-08-02','Scarlet & Violet','SFA'),('sv7','Stellar Crown',142,175,'2024-09-13','Scarlet & Violet','SCR'),('sv8','Surging Sparks',191,252,'2024-11-08','Scarlet & Violet','SSP'),('sv8pt5','Prismatic Evolutions',131,180,'2025-01-17','Scarlet & Violet','PRE'),('sv9','Journey Together',159,190,'2025-03-28','Scarlet & Violet','JTG'),('sve','Scarlet & Violet Energies',8,8,'2023-03-31','Scarlet & Violet','SVE'),('svp','Scarlet & Violet Black Star Promos',102,75,'2023-01-01','Scarlet & Violet','PR-SV'),('swsh1','Sword & Shield',202,216,'2020-02-07','Sword & Shield','SSH'),('swsh10','Astral Radiance',189,216,'2022-05-27','Sword & Shield','ASR'),('swsh10tg','Astral Radiance Trainer Gallery',30,30,'2022-05-27','Sword & Shield','ASR'),('swsh11','Lost Origin',196,217,'2022-09-09','Sword & Shield','LOR'),('swsh11tg','Lost Origin Trainer Gallery',30,30,'2022-09-09','Sword & Shield','LOR'),('swsh12','Silver Tempest',195,215,'2022-11-11','Sword & Shield','SIT'),('swsh12pt5','Crown Zenith',159,160,'2023-01-20','Sword & Shield','CRZ'),('swsh12pt5gg','Crown Zenith Galarian Gallery',70,70,'2023-01-20','Sword & Shield','CRZ'),('swsh12tg','Silver Tempest Trainer Gallery',30,30,'2022-11-11','Sword & Shield','SIT'),('swsh2','Rebel Clash',192,209,'2020-05-01','Sword & Shield','RCL'),('swsh3','Darkness Ablaze',189,201,'2020-08-14','Sword & Shield','DAA'),('swsh35','Champion\'s Path',73,80,'2020-09-25','Sword & Shield','CPA'),('swsh4','Vivid Voltage',185,203,'2020-11-13','Sword & Shield','VIV'),('swsh45','Shining Fates',72,73,'2021-02-19','Sword & Shield','SHF'),('swsh45sv','Shining Fates Shiny Vault',122,122,'2021-02-19','Sword & Shield','SHF'),('swsh5','Battle Styles',163,183,'2021-03-19','Sword & Shield','BST'),('swsh6','Chilling Reign',198,233,'2021-06-18','Sword & Shield','CRE'),('swsh7','Evolving Skies',203,237,'2021-08-27','Sword & Shield','EVS'),('swsh8','Fusion Strike',264,284,'2021-11-12','Sword & Shield','FST'),('swsh9','Brilliant Stars',172,186,'2022-02-25','Sword & Shield','BRS'),('swsh9tg','Brilliant Stars Trainer Gallery',30,30,'2022-02-25','Sword & Shield','BRS'),('swshp','SWSH Black Star Promos',307,304,'2019-11-15','Sword & Shield','PR-SW'),('xy0','Kalos Starter Set',39,39,'2013-11-08','XY','KSS'),('xy1','XY',146,146,'2014-02-05','XY','XY'),('xy10','Fates Collide',124,129,'2016-05-02','XY','FCO'),('xy11','Steam Siege',114,116,'2016-08-03','XY','STS'),('xy12','Evolutions',108,113,'2016-11-02','XY','EVO'),('xy2','Flashfire',106,110,'2014-05-07','XY','FLF'),('xy3','Furious Fists',111,114,'2014-08-13','XY','FFI'),('xy4','Phantom Forces',119,124,'2014-11-05','XY','PHF'),('xy5','Primal Clash',160,164,'2015-02-04','XY','PRC'),('xy6','Roaring Skies',108,112,'2015-05-06','XY','ROS'),('xy7','Ancient Origins',98,100,'2015-08-12','XY','AOR'),('xy8','BREAKthrough',162,165,'2015-11-04','XY','BKT'),('xy9','BREAKpoint',122,126,'2016-02-03','XY','BKP'),('xyp','XY Black Star Promos',211,216,'2013-10-12','XY','PR-XY');
/*!40000 ALTER TABLE `card_set` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-01 22:18:32
