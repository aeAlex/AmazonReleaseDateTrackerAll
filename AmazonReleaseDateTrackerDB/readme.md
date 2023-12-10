Login:
```
mysql -u root -p 
```

Dump:
```
sudo mysqldump -u root -p AmazonReleaseDateTracker > data.sql
```
Add Database creation to data.sql
```
--
-- Create a database using `MYSQL_DATABASE` placeholder
--
CREATE DATABASE IF NOT EXISTS `MYSQL_DATABASE`;
USE `MYSQL_DATABASE`;
```