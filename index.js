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

const PORT = 8001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname, __filename);

const app = express();

app.use(cors);

app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());

function getPwHash(password) {
  const sha256 = crypto.createHash("sha256");
  return sha256.update(password).digest("base64");
}

function generateAuthToken() {
  return crypto.randomBytes(30).toString("hex");
}

// Custom middleware that gets called bevore every call
app.use((req, res, next) => {
  // Get auth token from the cookies
  const authToken = req.cookies["AmazonBookReleasdateTracker_AuthToken"];
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
});

const requireAuth = (req, res, next) => {
  if (req.id_user) {
    console.log(`User with id: ${req.id_user} got past Authcheck`);
    next();
  } else {
    console.log("Got stopped by authcheck");
    res.redirect("/AmazonReleaseDateTracker/login");
  }
};

app.get('/', (req, res) => {
  console.log("Redirecting");
  res.send('Hello World!')
})

app.get("/AmazonReleaseDateTracker/register", (req, res) => {
  res.sendFile(path.join(__dirname, "./Website/html/signup.html"));
});

app.post("/AmazonReleaseDateTracker/register", (req, res) => {
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
            pathname: "/AmazonReleaseDateTracker/register",
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

app.get("/AmazonReleaseDateTracker/login", (req, res) => {
  res.sendFile(path.join(__dirname, "./Website/html/signin.html"));
});

function login(res, email, password) {
  console.log("Someone tryed to login!");
  verifyUser(
    email,
    getPwHash(password),
    (id_user) => {
      const authToken = generateAuthToken();
      saveAuthToken(id_user, authToken);
      // saving the authToken in a Cookie
      res.cookie("AmazonBookReleasdateTracker_AuthToken", authToken);
      console.log("Redirecting...");
      res.redirect("/AmazonReleaseDateTracker");
    },
    () => {
      console.log("InValid Login");
      res.redirect(
        url.format({
          pathname: "/AmazonReleaseDateTracker/login",
          query: {
            loginerror: true,
          },
        })
      );
    }
  );
}

app.post("/AmazonReleaseDateTracker/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  login(res, email, password);
});

app.get("/AmazonReleaseDateTracker/IsLoggedIn", (req, res) => {
  if (req.id_user == null) {
    return res.send("FALSE");
  } else {
    return res.send("TRUE");
  }
});

app.post("/AmazonReleaseDateTracker/trackBook", requireAuth, (req, res) => {
  const bookTitle = req.body["bookTitle"];
  const releaseDateString = req.body["releaseDate"];
  const url = req.body["url"];
  const id_user = req.id_user;
  console.log(bookTitle, releaseDateString, url);

  trackBook(id_user, bookTitle, releaseDateString, url);
  res.status(201).send("");
});

app.post("/AmazonReleaseDateTracker/untrackBook", requireAuth, (req, res) => {
  const id_book = req.body["id_book"];
  const id_user = req.id_user;

  untrackBook(id_user, id_book);
  res.status(201).send("");
});

app.get("/AmazonReleaseDateTracker/", requireAuth, (req, res) => {
  const id_user = req.id_user;
  const books = requestBooks(id_user, (result) => {
    res.render("booklist", { books: result });
  });
  //return res.send("Received a GET HTTP method");
});

app.get("/AmazonReleaseDateTracker/booklist", requireAuth, (req, res) => {
  const id_user = req.id_user;
  const books = requestBooks(id_user, (result) => {
    res.json({ books: result });
  });
});

app.get("/AmazonReleaseDateTracker/logout", requireAuth, (req, res) => {
  res.clearCookie("AmazonBookReleasdateTracker_AuthToken");
  res.redirect("/AmazonReleaseDateTracker/login");
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
