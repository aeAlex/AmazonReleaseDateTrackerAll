/* 
CREATE USER 'base'@'localhost' IDENTIFIED WITH mysql_native_password BY 'look in keypass';
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, INDEX, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'base'@'localhost' WITH GRANT OPTION;
*/

CREATE DATABASE IF NOT EXISTS AmazonReleaseDateTracker;

USE AmazonReleaseDateTracker;

CREATE TABLE Users (
    ID_user INT NOT NULL AUTO_INCREMENT,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PwHash VARCHAR(255) NOT NULL,
    Authtoken VARCHAR(255),
    AuthtokenCreationTime BIGINT UNIQUE,
    PRIMARY KEY (ID_User)
);

CREATE TABLE Books (
    ID_book INT NOT NULL AUTO_INCREMENT,
    Url VARCHAR(1000) NOT NULL,
    Name VARCHAR(255),
    ReleasedateString VARCHAR(255) NOT NULL,
    ID_user INT NOT NULL,
    PRIMARY KEY (ID_book),
    FOREIGN KEY (ID_user) REFERENCES Users (ID_user)
);