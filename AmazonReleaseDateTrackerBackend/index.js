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
} from "./dbManager2.mjs";

const app = express()
const port = 8001

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const authTokenCookieName = "AmazonBookReleasdateTracker_AuthToken";

//app.use(cors()); // Enable CORS for all routes
// problem when credentials are set to true

const allowedOrigin = [
  'http://localhost:3000', // when testing with yarn start
  'http://ardt_frontend:8002',
  'http://localhost:8002' // wehen testing with docker-compose
]; // Replace with your frontend's URL

app.use(cors({
  origin: allowedOrigin,  // Only allow requests from this origin
  credentials: true,      // Allow credentials (cookies, HTTP authentication)
}));

app.use(cookieParser());

import { readFile } from "fs/promises";
const config = JSON.parse(
  await readFile(new URL("./config.json", import.meta.url))
); 

const unsafeInlineCSP = "script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
// Middleware for specific route with less restrictive CSP
const unsafeInlineCSPMiddleware = (req, res, next) => {
  console.log("Adding less restrictive CSP");
  res.setHeader("Content-Security-Policy", unsafeInlineCSP);
  next();
};

// to get the form data
// Middleware to parse URL-encoded data in the request body
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// Custom middleware that gets called before every call
app.use((req, res, next) => {
  console.log("Middleware: Request made to: " + req.url);
  const authToken = req.cookies[authTokenCookieName];
  console.log("Auth Token: " + authToken);
  getUserByToken(
    authToken,
    (id_user) => {
      req.id_user = id_user;
      next(); // Proceed to the next middleware or route handler
    },
    () => {
      console.log("Tried entry without valid token!");
      next(); // Proceed even if token validation fails (for public routes)
    }
  );
});

function getPwHash(password) {
  const sha256 = crypto.createHash("sha256");
  return sha256.update(password).digest("base64");
}

function generateAuthToken() {
  return crypto.randomBytes(30).toString("hex");
}

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


app.post("/AmazonReleaseDateTracker/api/register", async (req, res) => {
  let email, password, passwordRP;
  try {
    console.log(req.body);
    email = req.body.email;
    password = req.body.password;
    passwordRP = req.body.passwordRP;

    console.log("Registering user: " + email);

    if (password !== passwordRP) {
      return res.status(400).send("Passwords do not match");
    } 

    const userExists = await doesUserAlreadyExist(email);

    if (userExists) {
      return res.status(409).send("User already exists");
    }

    const pwHash = getPwHash(password);

    await registerUser(email, pwHash);

    return res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Internal Server Error");
  }

  //console.log("Registration is done, logging in ...");
  // Proceed to login after registration
  //await login(res, email, password);
});


async function login(res, email, password) {
  try {
    console.log("Someone tried to login with: " + email + " " + password);

    const id_user = await verifyUser(email, getPwHash(password));

    if (!id_user) {
      console.log("Invalid Login");
      // Respond here and return immediately
      return res.status(401).send("Invalid Login");
    }

    const authToken = generateAuthToken();
    await saveAuthToken(id_user, authToken);
    
    // Saving the authToken in a Cookie
    res.cookie(authTokenCookieName, authToken);

    // Send success response after setting the cookie
    return res.status(200).send("Login successful");

  } catch (error) {
    console.error("Error during login:\n", error);
    res.status(500).send("Internal Server Error");
  }
}

app.post("/AmazonReleaseDateTracker/api/login", (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
  
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

app.post("/AmazonReleaseDateTracker/api/trackBook", unsafeInlineCSPMiddleware, requireAuth, (req, res) => {
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
  //res.redirect("/AmazonReleaseDateTracker/login");
  res.send();
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});