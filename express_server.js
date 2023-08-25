const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Function to generate a random string
function generateRandomString() {
  let randomStr = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    randomStr += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomStr;
}

// Home page
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Display list of URLs
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = { urls: urlDatabase, user };
  res.render("urls_index", templateVars);
});

// Display individual URL
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = { id, longURL, user };
  res.render("urls_show", templateVars);
});

// POST route to update a URL resource
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newLongURL = req.body.longURL;
  urlDatabase[id] = newLongURL;
  res.redirect("/urls");
});

// POST route to delete a URL resource
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

// GET route to display the form for creating new URLs
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// POST route to create a new URL resource
app.post("/urls", (req, res) => {
  const randomID = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[randomID] = longURL;
  res.redirect(`/urls/${randomID}`);
});

// Redirect short URLs to long URLs
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("URL Not Found");
  }
});

// Display login form
app.get("/login", (req, res) => {
  res.render("login");
});

// Handle login form submission
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = findUserByEmail(email, users);

  if (!user || user.password !== password) {
    res.status(403).send("Invalid email or password");
    return;
  }

  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

// Handle logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Display registration form
app.get("/register", (req, res) => {
  res.render("register");
});

// Handle registration form submission
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send("Email and password fields are required");
    return;
  }

  if (findUserByEmail(email, users)) {
    res.status(400).send("Email already registered");
    return;
  }

  const userId = generateRandomString();
  users[userId] = { id: userId, email, password };
  res.cookie("user_id", userId);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

// Helper function to find a user by email
function findUserByEmail(email, database) {
  for (const userId in database) {
    if (database[userId].email === email) {
      return database[userId];
    }
  }
  return null;
}
