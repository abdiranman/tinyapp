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
  // ... Your user database entries
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Use cookie-parser middleware

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
    user: users[req.cookies.user_id]
  };
  res.render("urls_index", templateVars);
});

// ... Other routes ...

// Display the long URL for a given short URL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  
  if (!longURL) {
    res.status(404).send("Short URL not found");
    return;
  }

  res.redirect(longURL);
});

// ... Other routes ...

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
