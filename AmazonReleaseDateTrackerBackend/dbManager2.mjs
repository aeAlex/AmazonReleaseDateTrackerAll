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
  console.log("Call worked");
  var sql = `SELECT * FROM Users WHERE Authtoken = ?`;
  var values = [mysql.escape(authToken)];
  var con = getDBConnection();
  console.log(values)
  var [rows, fields] = await con.query(sql, values);

  console.log(result)
  /*
    if (err) {
      console.log("DB-Server probably offline!");
      throw err;
    } else {
      if (result.length > 0) {
        console.log("Successfully found accesstoken!");
        const id_user = result[0].ID_user;
        const email = result[0].Email;
        const authtokenCreationTime = result[0].AuthtokenCreationTime;
        onFound(id_user, email, authtokenCreationTime);
      } else {
        onNoMatch();
      }
    }
  */

}

/**
 * @param email Email
 * @param trueFunct Function that gets called if a User with that email exists
 * @param falseFunct Function that gets called if no User with that email exists
 */
async function doesUserAlreadyExist(email, trueFunct, falseFunct) {
  let con;
  try {
    con = getDBConnection();
    var sql = `SELECT COUNT(email) AS NUM FROM Users WHERE email=?`;
    var values = [mysql.escape(email)];
    
    const [result] = await con.execute(sql, values);
    console.log(result);
    trueFunct(result)
  }
  catch (err) {
    if (con) {
      con.release();
    }
  }
}


function registerUser(email, pwHash, onDone) {
  var sql = `INSERT INTO Users (Email, PwHash) VALUES (
    ${mysql.escape(email)}, ${mysql.escape(pwHash)});`;

  var con = getDBConnection();
  con.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      onDone();
    }
  });
}

/**
 * @param email Email
 * @param pwHash Hashed Password
 * @param validFunct Function that gets called if Logininfo is valid
 * @param invalidFunct Function that gets called if Logininfo is invalid
 */
function verifyUser(email, pwHash, validFunct, invalidFunct) {
  var con = getDBConnection();
  var sql = `SELECT ID_user FROM Users WHERE email=${mysql.escape(
    email
  )} AND pwHash=${mysql.escape(pwHash)}`;
  con.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      if (result.length > 0) {
        const id_user = result[0].ID_user;
        validFunct(id_user);
      } else {
        invalidFunct();
      }
    }
  });
}

/**
 * @param id_user id_user
 * @param authToken authToken
 */
function saveAuthToken(id_user, authToken) {
  const timestamp = Date.now();
  var sql = `UPDATE Users SET Authtoken=${mysql.escape(
    authToken
  )}, AuthtokenCreationTime=${mysql.escape(
    timestamp
  )} WHERE ID_user=${mysql.escape(id_user)}`;
  var con = getDBConnection();
  con.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log("Successfully saved accesstoken!");
    }
  });
}

function dateStringToTimestamp(releaseDateString) {
  ///TODO
}

function trackBook(id_user, bookTitle, releaseDateString, url) {
  const releaseDateTimestamp = dateStringToTimestamp(releaseDateString); /// TODO

  const sql = `INSERT INTO Books (Url, Name, ReleasedateString, ID_user) VALUES (${mysql.escape(
    url
  )}, ${mysql.escape(bookTitle)}, ${mysql.escape(
    releaseDateString
  )}, ${mysql.escape(id_user)})`;
  console.log(sql);
  var con = getDBConnection();
  con.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log("Successfully tracked book!");
    }
  });
}

function untrackBook(id_user, id_book) {
  //TODO: check if user is the owner of the book entry
  console.log(id_user, id_book);
  const sql = `DELETE FROM Books WHERE ID_user=${mysql.escape(
    id_user
  )} AND ID_book=${mysql.escape(id_book)}`;
  console.log(sql);
  var con = getDBConnection();
  con.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log("Successfully un-tracked book!");
    }
  });
}

function requestBooks(id_user, onResult) {
  const sql = `SELECT * FROM Books WHERE ID_user=${mysql.escape(id_user)}`;
  var con = getDBConnection();
  con.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      onResult(result);
    }
  });
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
