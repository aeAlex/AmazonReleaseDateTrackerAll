-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: AmazonReleaseDateTracker
-- ------------------------------------------------------
-- Server version	8.0.35

--
-- Create a database using `MYSQL_DATABASE` placeholder
--
CREATE DATABASE IF NOT EXISTS `AmazonReleaseDateTracker`;
USE `AmazonReleaseDateTracker`;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Books`
--

DROP TABLE IF EXISTS `Books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Books` (
  `ID_book` int NOT NULL AUTO_INCREMENT,
  `Url` varchar(1000) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `ReleasedateString` varchar(255) NOT NULL,
  `ID_user` int NOT NULL,
  PRIMARY KEY (`ID_book`),
  KEY `ID_user` (`ID_user`),
  CONSTRAINT `Books_ibfk_1` FOREIGN KEY (`ID_user`) REFERENCES `Users` (`ID_user`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Books`
--

LOCK TABLES `Books` WRITE;
/*!40000 ALTER TABLE `Books` DISABLE KEYS */;
INSERT INTO `Books` VALUES (1,'https://www.amazon.com/-/en/Zogarth-ebook/dp/B0CHSJVWL7/?_encoding=UTF8&pd_rd_w=8YLUF&content-id=amzn1.sym.012d2adf-f30c-46f9-b0ad-1ed3ffe907f8%3Aamzn1.symc.adba8a53-36db-43df-a081-77d28e1b71e6&pf_rd_p=012d2adf-f30c-46f9-b0ad-1ed3ffe907f8&pf_rd_r=1DMRQN5QAGTK302HY2RJ&pd_rd_wg=IZimS&pd_rd_r=bd1a1e74-a77d-4c70-8ca5-ac63a3d385d0&ref_=pd_gw_ci_mcx_mr_hp_atf_m','  The Primal Hunter 8: A LitRPG Adventure ',' January 16, 2024 ',2);
/*!40000 ALTER TABLE `Books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `ID_user` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(255) NOT NULL,
  `PwHash` varchar(255) NOT NULL,
  `Authtoken` varchar(255) DEFAULT NULL,
  `AuthtokenCreationTime` bigint DEFAULT NULL,
  PRIMARY KEY (`ID_user`),
  UNIQUE KEY `Email` (`Email`),
  UNIQUE KEY `AuthtokenCreationTime` (`AuthtokenCreationTime`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (2,'alex-eineder@gmx.de','Oi//Rb4tuKhXHCcGCrCeWXs3ViHTkdzqsU1da6h2Mts=','5114b47fb6951921d2264776b995f2b5c2719be0651b3738f1d707396516',1697620458714);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-19 21:33:17
