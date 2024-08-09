import mysql from "mysql2/promise";
import { readFile } from "fs/promises";

const config = JSON.parse(
  await readFile(new URL("./config.json", import.meta.url))
);
const mysql_config = config.mysql;

console.log("Login in into DB with User:", mysql_config.username);
var dbConnectionPool;
async function getDBConnection() {
  if (dbConnectionPool == undefined) {
    dbConnectionPool = await mysql.createPool({
      host: mysql_config.host,
      user: mysql_config.username,
      password: mysql_config.password,
      database: mysql_config.dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return await dbConnectionPool.getConnection(); // Return the connection directly
}


/**
 * @param authToken authToken
 * @param onFound callbackfunction
 * @param onNoMatch onNoMatch
 */
async function getUserByToken(authToken, onFound, onNoMatch) {
  let con = false;
  try {
    // Prepare the SQL query
    const sql = `SELECT * FROM Users WHERE Authtoken = ?`;
    
    // Get a connection from the pool
    con = await getDBConnection();
    
    // Execute the query with the authToken as a parameter
    const [rows, fields] = await con.query(sql, [authToken]);

    // Check if any rows were returned
    if (rows.length > 0) {
      console.log("Successfully found accesstoken!");

      const { ID_user, Email, AuthtokenCreationTime } = rows[0];
      
      // Call the onFound callback with the relevant data
      onFound(ID_user, Email, AuthtokenCreationTime);
    } else {
      // Call the onNoMatch callback if no match was found
      onNoMatch();
    }

  } catch (err) {
    // Handle errors appropriately
    console.log("DB-Server probably offline!");
    throw err;
  } finally {
    // Ensure that the connection is closed properly
    if (con) {
      await con.release();
    }
  }
}

/**
 * @param email Email
*/
async function doesUserAlreadyExist(email) {
  const sql = `SELECT COUNT(email) AS NUM FROM Users WHERE email = ?`;
  const con = await getDBConnection();

  try {
    const [rows] = await con.execute(sql, [email]);
    return rows[0].NUM > 0;
  } catch (err) {
    throw err;
  } finally {
    con.release();
  }
}


async function registerUser(email, pwHash) {
  const con = await getDBConnection();
  const sql = `INSERT INTO Users (Email, PwHash) VALUES (?, ?)`;

  try {
    const [result] = await con.execute(sql, [email, pwHash]);
    return result; // Return result or a specific value as needed
  } catch (err) {
    throw err; // Re-throw the error to be handled by the calling function
  } finally {
    con.release(); // Ensure connection is released
  }
}

/**
 * @param email Email
 * @param pwHash Hashed Password
*/
async function verifyUser(email, pwHash) {
  const con = await getDBConnection();
  const sql = `SELECT ID_user FROM Users WHERE Email = ? AND PwHash = ?`;

  try {
    const [rows] = await con.execute(sql, [email, pwHash]);
    if (rows.length > 0) {
      // User exists, return the ID
      return rows[0].ID_user;
    } else {
      // User does not exist
      return null;
    }
  } catch (err) {
    // Handle or propagate the error
    throw err;
  } finally {
    con.release();
  }
}

async function saveAuthToken(id_user, authToken) {
  const timestamp = Date.now();
  const sql = `UPDATE Users SET Authtoken = ?, AuthtokenCreationTime = ? WHERE ID_user = ?`;

  const con = await getDBConnection();

  try {
    const [result] = await con.execute(sql, [authToken, timestamp, id_user]);
    console.log("Successfully saved accesstoken!");
  } catch (err) {
    throw err;
  } finally {
    con.release();
  }
}

function dateStringToTimestamp(releaseDateString) {
  ///TODO
}

async function trackBook(id_user, bookTitle, releaseDateString, url) {
  const releaseDateTimestamp = dateStringToTimestamp(releaseDateString); // Assuming you have a function to convert the date string to a timestamp

  const sql = `INSERT INTO Books (Url, Name, ReleasedateString, ID_user) VALUES (?, ?, ?, ?)`;

  const con = await getDBConnection();

  try {
    const [result] = await con.execute(sql, [url, bookTitle, releaseDateString, id_user]);
    console.log("Successfully tracked book!");
  } catch (err) {
    throw err;
  } finally {
    con.release();
  }
}

async function untrackBook(id_user, id_book) {
  console.log(id_user, id_book);

  const sql = `DELETE FROM Books WHERE ID_user = ? AND ID_book = ?`;

  const con = await getDBConnection();

  try {
    const [result] = await con.execute(sql, [id_user, id_book]);
    console.log("Successfully un-tracked book!");
  } catch (err) {
    throw err;
  } finally {
    con.release();
  }
}

async function requestBooks(id_user, onResult) {
  const sql = `SELECT * FROM Books WHERE ID_user = ?`;

  const con = await getDBConnection();

  try {
    const [rows] = await con.execute(sql, [id_user]);
    onResult(rows);
  } catch (err) {
    throw err;
  } finally {
    con.release();
  }
}

export {
  registerUser,
  doesUserAlreadyExist,
  verifyUser,
  saveAuthToken,
  getUserByToken,
  trackBook,
  requestBooks,
  untrackBook,
};
