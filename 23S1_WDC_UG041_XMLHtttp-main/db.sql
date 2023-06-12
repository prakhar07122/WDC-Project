-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: xmlhttp
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

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
-- Table structure for table `Club`
--

DROP TABLE IF EXISTS `Club`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Club` (
  `ClubID` int NOT NULL AUTO_INCREMENT,
  `Club_name` varchar(255) NOT NULL,
  `About_club` text NOT NULL,
  `Category` varchar(255) NOT NULL,
  `Manager` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ClubID`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Club`
--

LOCK TABLES `Club` WRITE;
/*!40000 ALTER TABLE `Club` DISABLE KEYS */;
INSERT INTO `Club` VALUES (1,'Football','I love football!','Sport','Jash1008'),(16,'Basketball','Join our basketball club and experience the thrill of the game! We provide skill development, training sessions, friendly matches, and exciting tournaments. Whether you\'re a beginner or a seasoned player, our inclusive community welcomes everyone. Come be a part of our passionate basketball family and let\'s shoot hoops together!','Sport','Prakhar'),(17,'WDC','We love WDC!!!!','Faculty','Ian Knight'),(18,'Chinese','Welcome to our Chinese club, where we celebrate the rich culture and heritage of China! Our club is a vibrant community of individuals interested in Chinese language, arts, traditions, and history.','Other','Fitz');
/*!40000 ALTER TABLE `Club` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Club_members`
--

DROP TABLE IF EXISTS `Club_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Club_members` (
  `MemberID` int NOT NULL AUTO_INCREMENT,
  `ClubID` int NOT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`MemberID`),
  KEY `ClubID` (`ClubID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Club_members_ibfk_1` FOREIGN KEY (`ClubID`) REFERENCES `Club` (`ClubID`),
  CONSTRAINT `Club_members_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Login` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Club_members`
--

LOCK TABLES `Club_members` WRITE;
/*!40000 ALTER TABLE `Club_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `Club_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Event`
--

DROP TABLE IF EXISTS `Event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Event` (
  `EventID` int NOT NULL AUTO_INCREMENT,
  `EventName` varchar(255) NOT NULL,
  `Date` date NOT NULL,
  `EventDescription` varchar(255) NOT NULL,
  `EventStatus` tinyint(1) DEFAULT NULL,
  `ClubID` int DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`EventID`),
  KEY `ClubID` (`ClubID`),
  CONSTRAINT `Event_ibfk_1` FOREIGN KEY (`ClubID`) REFERENCES `Club` (`ClubID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Event`
--

LOCK TABLES `Event` WRITE;
/*!40000 ALTER TABLE `Event` DISABLE KEYS */;
INSERT INTO `Event` VALUES (1,'Football Practice','2023-06-10','play footbal',1,1,NULL),(2,'jash','2023-06-13','cdxsnklmas;',1,1,'snl'),(3,'sakajs','2023-06-16','sxn;saml',1,1,'dsknl');
/*!40000 ALTER TABLE `Event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Login`
--

DROP TABLE IF EXISTS `Login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Login` (
  `Username` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `GivenName` varchar(255) NOT NULL,
  `FamilyName` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Designation` varchar(255) NOT NULL DEFAULT 'User',
  `GoogleUserID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Login`
--

LOCK TABLES `Login` WRITE;
/*!40000 ALTER TABLE `Login` DISABLE KEYS */;
INSERT INTO `Login` VALUES ('Jash1008','JashS99@gmail.com','Jash','Suchak','$argon2id$v=19$m=65536,t=3,p=4$1MWBnbcQqMYDEwvR89ZxrQ$t+vZf0L7jEl3+XuxcLR26UOtq/Rgq8eCUWdFu9ZtFJs',7,'admin',NULL),('fitz','fitz@1','Fitz222','Tao1111','$argon2id$v=19$m=65536,t=3,p=4$AYPdn75xFI+nGZ8VXlXdhQ$wqMMum/psg+7q+IytZc8qFu5DUe18qXPKtYhsMPxtdU',8,'admin',NULL);
/*!40000 ALTER TABLE `Login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RSVP`
--

DROP TABLE IF EXISTS `RSVP`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RSVP` (
  `RSVPID` int NOT NULL AUTO_INCREMENT,
  `EventID` int DEFAULT NULL,
  `UserID` int DEFAULT NULL,
  `InviteStatus` tinyint(1) DEFAULT '1',
  `RSVP_Club_name` varchar(255) DEFAULT NULL,
  `RSVP_Event_title` varchar(255) DEFAULT NULL,
  `RSVP_Venue` varchar(255) DEFAULT NULL,
  `RSVP_event_description` varchar(255) DEFAULT NULL,
  `RSVP_Date` int DEFAULT NULL,
  PRIMARY KEY (`RSVPID`),
  KEY `EventID` (`EventID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `RSVP_ibfk_1` FOREIGN KEY (`EventID`) REFERENCES `Event` (`EventID`),
  CONSTRAINT `RSVP_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Login` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RSVP`
--

LOCK TABLES `RSVP` WRITE;
/*!40000 ALTER TABLE `RSVP` DISABLE KEYS */;
/*!40000 ALTER TABLE `RSVP` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-11 13:39:46
