const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs"); // Import bcryptjs library
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const urlDatabase = {
  // ... Your URL database entries
};

const users = {
  // ... Your user database entries
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Function to generate a random string
function generateRandomString() {
  // ... (same as before)
}

// Home page
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Display list of URLs
app.get("/urls", (req, res) => {
  // ... (same as before)
});

// ... Other routes ...

// Display login form
app.get("/login", (req, res) => {
  res.render("login");
});

// Handle login form submission
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  for (const userID in users) {
    const user = users[userID];
    if (user.email === email && bcrypt.compareSync(password, user.password)) {
      res.cookie("user_id", user.id);
      res.redirect("/urls");
      return;
    }
  }

  res.status(403).send("Invalid email or password");
});

// ... (other routes)

// Handle registration form submission
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send("Email and password fields cannot be empty");
    return;
  }

  for (const userID in users) {
    if (users[userID].email === email) {
      res.status(400).send("Email already exists");
      return;
    }
  }

  const randomID = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password
  users[randomID] = {
    id: randomID,
    email: email,
    password: hashedPassword, // Save the hashed password
  };
  res.cookie("user_id", randomID);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
