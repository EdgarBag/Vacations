-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 18, 2019 at 08:47 PM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacations`
--
CREATE DATABASE IF NOT EXISTS `vacations` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `vacations`;

-- --------------------------------------------------------

--
-- Table structure for table `dataoffollowers`
--

CREATE TABLE `dataoffollowers` (
  `id` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `vacationID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `typeOfUser` int(1) NOT NULL,
  `userFirstName` varchar(20) NOT NULL,
  `userSecondName` varchar(30) NOT NULL,
  `userName` varchar(30) NOT NULL,
  `userPassword` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `typeOfUser`, `userFirstName`, `userSecondName`, `userName`, `userPassword`) VALUES
(89, 1, 'AdminName', 'AdminSecondName', 'admin', 'admin'),
(105, 0, '1111', '1111', '1111', '1111');

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `vacationID` int(11) NOT NULL,
  `description` varchar(200) NOT NULL,
  `destination` varchar(60) NOT NULL,
  `nameOfIMG` varchar(30) NOT NULL,
  `dateFrom` date NOT NULL,
  `dateTo` date NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`vacationID`, `description`, `destination`, `nameOfIMG`, `dateFrom`, `dateTo`, `price`) VALUES
(327, 'New Description', 'New Destination', '', '2019-10-26', '2019-10-27', 9999);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dataoffollowers`
--
ALTER TABLE `dataoffollowers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vacationsID` (`vacationID`,`userID`),
  ADD KEY `dataoffollowers_ibfk_1` (`userID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vacationID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dataoffollowers`
--
ALTER TABLE `dataoffollowers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=195;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vacationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=332;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dataoffollowers`
--
ALTER TABLE `dataoffollowers`
  ADD CONSTRAINT `dataoffollowers_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  ADD CONSTRAINT `dataoffollowers_ibfk_2` FOREIGN KEY (`vacationID`) REFERENCES `vacations` (`vacationID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
