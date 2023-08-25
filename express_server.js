const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

// Example URL database
const urlDatabase = {
  "b2xVn2": "http://www.example.com",
  "9sm5xK": "http://www.google.com"
};

// Example user database
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2b$10$TigO0F0b9rXBGU47HMRoi.QV9RzOK29JS.gucPOe3ISX2wLbnZoXq" // Hashed password
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2b$10$TigO0F0b9rXBGU47HMRoi.QV9RzOK29JS.gucPOe3ISX2wLbnZoXq" // Hashed password
  }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// ... (Other routes)

// Display login form
app.get("/login", (req, res) => {
  res.render("login");
});

// Handle login form submission
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  const user = getUserByEmail(email);

  if (!user) {
    res.status(403).send("Invalid email or password");
    return;
  }

  // Compare hashed passwords
  if (!bcrypt.compareSync(password, user.password)) {
    res.status(403).send("Invalid email or password");
    return;
  }

  // Set user_id cookie and redirect
  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

// ... (Other routes)

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

// Helper function to get user by email
function getUserByEmail(email) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
}
