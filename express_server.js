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
  // ... Your users object entries
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
  const templateVars = {
    user: users[req.cookies["user_id"]],
  };
  res.render("index", templateVars);
});

// Display list of URLs
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const templateVars = {
    id,
    longURL,
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  // ... Update URL logic
});

app.post("/urls/:id/delete", (req, res) => {
  // ... Delete URL logic
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  // ... Create URL logic
});

app.get("/u/:id", (req, res) => {
  // ... Redirect short URLs logic
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const user = findUserByEmail(email);
  if (user) {
    res.cookie("user_id", user.id);
  }
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString();
  users[id] = {
    id,
    email,
    password,
  };
  res.cookie("user_id", id);
  res.redirect("/urls");
});

app.get("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

// Function to find a user by email
function findUserByEmail(email) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
}
