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
  // ... Your users database entries
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
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_index", templateVars);
});

// ... Other routes

// Display registration form
app.get("/register", (req, res) => {
  res.render("register");
});

// Handle user registration
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userId = generateRandomString();

  if (!email || !password) {
    res.status(400).send("Email and password cannot be empty");
    return;
  }

  for (const userId in users) {
    if (users[userId].email === email) {
      res.status(400).send("Email already registered");
      return;
    }
  }

  users[userId] = {
    id: userId,
    email: email,
    password: password,
  };

  res.cookie("user_id", userId);
  res.redirect("/urls");
});

// ... Other routes

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
