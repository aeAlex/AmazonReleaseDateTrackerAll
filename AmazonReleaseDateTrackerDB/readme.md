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

### Create a .env file
make sure it Contains the same data as config.json in Backend
Example:
```
MYSQL_DATABASE=your_database_name
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_PORT=3306
```