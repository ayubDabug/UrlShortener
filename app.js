// app.js
const { body, validationResult } = require("express-validator")
const { prisma } = require('./lib/prisma')

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json())

const sanitizeUrl = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  next()
};

const validateUrl = body("url")
  .trim()
  .notEmpty()
  .withMessage("url cannot be empty")
  .isURL()
  .withMessage("must be valid url");

app.get("/", (req, res) => res.send("Health Check: server is up and running"));

function generateRandomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomizedCode = "";
  for(let i = 0; i < 6; i++) {
    let randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    randomizedCode += randomCharacter;
  }
  return randomizedCode;
}

// allow users to post a long url, returning a shortened version along with its designated code.
app.post("/shorten", validateUrl, sanitizeUrl, async (req, res) => {
  let randomizedCode = generateRandomCode();
  
  let existingUrl = await prisma.url.findUnique({
    where: { randomCode: randomizedCode }
  });
  
  while(existingUrl) {
    randomizedCode = generateRandomCode();
    existingUrl = await prisma.url.findUnique({
      where: { randomCode: randomizedCode }
    });
  }
  
  const tinyUrl = `http://${req.headers.host}/${randomizedCode}`;
  
  await prisma.url.create({
    data: {
      longUrl: req.body.url,
      randomCode: randomizedCode
    }
  });
  
  res.status(201).json({shortCode: randomizedCode, shortUrl: tinyUrl});
});


// allow users to see the click count and original url from the short urls code
app.get('/stats/:shortCode', async (req, res) => {
  try {
    let shortCodeRow = await prisma.url.findUnique({
      where: {
        randomCode: req.params.shortCode
      }
    });
    
    if (!shortCodeRow) {
      return res.status(404).json({ error: "Short code not found" });
    }
    
    const {clickCount, longUrl} = shortCodeRow;
    res.status(200).json({clickCount: clickCount, originalUrl: longUrl});
  } catch(error) {
    res.status(500).json({ error: "Database error" });
  }
});



// when user clicks short url, find orignal url in database and redirect user.
app.get("/:shortCode", async (req, res) => {
  try {
    const shortCodeRow = await prisma.url.findUnique({
      where: {
        randomCode: req.params.shortCode
      }
    });
    
    if (!shortCodeRow) {
      return res.status(404).send("Short URL not found");
    }
    
    const longUrl = shortCodeRow.longUrl;
    
    await prisma.url.update({
      where: {randomCode: req.params.shortCode},
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });
    
    res.redirect(longUrl);
  } catch(error) {
    res.status(500).send("Server error");
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send(err.message);
})

module.exports = app;