const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const urlDatabase = {
  // ... Your URL database entries
};

const users = {
  // ... Your user objects
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

// Function to find a user by email
function findUserByEmail(email) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
}

// Home page
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Display list of URLs
app.get("/urls", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { urls: urlDatabase, user };
  res.render("urls_index", templateVars);
});

// ... Other routes ...

// Display registration form
app.get("/register", (req, res) => {
  res.render("register");
});

// Handle registration form submission
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Error handling for empty email or password
  if (!email || !password) {
    return res.status(400).send("Email and password cannot be empty.");
  }

  // Check if the email already exists in users
  if (findUserByEmail(email)) {
    return res.status(400).send("Email already registered.");
  }

  const id = generateRandomString();
  users[id] = {
    id,
    email,
    password,
  };
  res.cookie("user_id", id);
  res.redirect("/urls");
});

// ... Other routes ...

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
