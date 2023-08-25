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
app.use(cookieParser());

// Function to generate a random string
function generateRandomString() {
  // ... Your random string generation code
}

// ... Other routes ...

// POST route for editing URLs
app.post("/urls/:id", (req, res) => {
  const userID = req.cookies.user_id;
  const shortURL = req.params.id;
  
  if (!userID) {
    return res.status(401).send("You must be logged in to edit URLs.");
  }

  if (!urlDatabase[shortURL]) {
    return res.status(404).send("URL not found.");
  }

  if (urlDatabase[shortURL].userID !== userID) {
    return res.status(403).send("You do not have permission to edit this URL.");
  }

  const newLongURL = req.body.newLongURL;
  urlDatabase[shortURL].longURL = newLongURL;
  res.redirect("/urls");
});

// POST route for deleting URLs
app.post("/urls/:id/delete", (req, res) => {
  const userID = req.cookies.user_id;
  const shortURL = req.params.id;

  if (!userID) {
    return res.status(401).send("You must be logged in to delete URLs.");
  }

  if (!urlDatabase[shortURL]) {
    return res.status(404).send("URL not found.");
  }

  if (urlDatabase[shortURL].userID !== userID) {
    return res.status(403).send("You do not have permission to delete this URL.");
  }

  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
