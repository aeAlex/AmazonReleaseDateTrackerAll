import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyparser from "body-parser";
import url from "url";
import crypto from "crypto";
import cookieParser from "cookie-parser";
import cors from 'cors';

import {
  registerUser,
  doesUserAlreadyExist,
  verifyUser,
  saveAuthToken,
  getUserByToken,
  trackBook,
  requestBooks,
  untrackBook,
} from "./dbManager.mjs";

const app = express()
const port = 8001

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cookieParser());

import { readFile } from "fs/promises";
const config = JSON.parse(
  await readFile(new URL("./config.json", import.meta.url))
); 

function getPwHash(password) {
  const sha256 = crypto.createHash("sha256");
  return sha256.update(password).digest("base64");
}

function generateAuthToken() {
  return crypto.randomBytes(30).toString("hex");
}

// to get the form data
// Middleware to parse URL-encoded data in the request body
app.use(express.urlencoded({ extended: true }));

// Custom middleware that gets called bevore every call
app.use((req, res, next) => {
  console.log("Test2")
  const authToken = req.cookies["AmazonBookReleasdateTracker_AuthToken"];
  console.log(authToken);
  getUserByToken(
    authToken,
    (id_user) => {
      req.id_user = id_user;
      next();
    },
    () => {
      console.log("Tried entry without valid token!");
      next();
    }
  );
  next();
});

const requireAuth = (req, res, next) => {
  if (req.id_user) {
    console.log(`User with id: ${req.id_user} got past Authcheck`);
    next();
  } else {
    console.log("Got stopped by authcheck");
    res.status(401).json({
      status: "unauthorized",
      message: "please authorize yourself"
    });
  }
};

app.get('/AmazonReleaseDateTracker', (req, res) => {
    res.send('Hello World!')
});

app.get('/AmazonReleaseDateTracker/api', (req, res) => {
  res.send('Hello api World!')
});


app.post("/AmazonReleaseDateTracker/api/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const passwordRP = req.body.passwordRP;

  if (res.statusCode != 200 || password != passwordRP) {
    res.sendFile(path.join(__dirname, "./Website/html/failure.html"));
  } else {
    doesUserAlreadyExist(
      email,
      () => {
        // Case: Already Exists
        res.redirect(
          url.format({
            pathname: "/AmazonReleaseDateTracker/api/register",
            query: {
              userAlreadyExists: true,
            },
          })
        );
      },
      () => {
        // Case: does not Exist
        var pwHash = getPwHash(password);
        registerUser(email, pwHash, () => {
          console.log("Registration is done login in ...");
          login(res, email, password);
        });
      }
    );
  }
});


function login(res, email, password) {
  console.log("Someone tried to login!");
  verifyUser(
    email,
    getPwHash(password),
    (id_user) => {
      const authToken = generateAuthToken();
      saveAuthToken(id_user, authToken);
      // saving the authToken in a Cookie
      res.cookie("AmazonBookReleasdateTracker_AuthToken", authToken);
      console.log("Redirecting...");
      // Send the response after setting the cookie
      res.redirect("/AmazonReleaseDateTracker");
      return;
    },
    () => {
      console.log("Invalid Login");
      // Send the response after setting the cookie
      res.redirect(
        url.format({
          pathname: "/AmazonReleaseDateTracker/login",
          query: {
            loginerror: true,
          },
        })
      );
      return;
    }
  );
}

app.post("/AmazonReleaseDateTracker/api/login", (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
  
    console.log(email + " " + password);
    login(res, email, password);
  }
  catch(e) {
    console.log(e);
  }

});

app.get("/AmazonReleaseDateTracker/api/IsLoggedIn", (req, res) => {
  if (req.id_user == null) {
    return res.send("FALSE");
  } else {
    return res.send("TRUE");
  }
});

app.post("/AmazonReleaseDateTracker/api/trackBook", requireAuth, (req, res) => {
  const bookTitle = req.body["bookTitle"];
  const releaseDateString = req.body["releaseDate"];
  const url = req.body["url"];
  const id_user = req.id_user;
  console.log(bookTitle, releaseDateString, url);

  trackBook(id_user, bookTitle, releaseDateString, url);
  res.status(201).send("");
});

app.post("/AmazonReleaseDateTracker/api/untrackBook", requireAuth, (req, res) => {
  const id_book = req.body["id_book"];
  const id_user = req.id_user;

  untrackBook(id_user, id_book);
  res.status(201).send("");
});

app.get("/AmazonReleaseDateTracker/api/booklist", requireAuth, (req, res) => {
  const id_user = req.id_user;
  const books = requestBooks(id_user, (result) => {
    res.json({ books: result });
  });
});

app.get("/AmazonReleaseDateTracker/api/logout", requireAuth, (req, res) => {
  res.clearCookie("AmazonBookReleasdateTracker_AuthToken");
  res.redirect("/AmazonReleaseDateTracker/login");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});