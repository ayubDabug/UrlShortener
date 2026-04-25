// app.js
const { body, validationResult } = require("express-validator")
const { prisma } = require("./lib/prisma")
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

 app.post("/shorten", validateUrl, sanitizeUrl, async (req, res) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let randomizedCode = "";
    for(let i = 0; i < 6; i++) {
      let randomCharacter = characters[Math.floor(Math.random() * characters.length)]
      randomizedCode += randomCharacter

    }

    const tinyUrl = 'http://localhost:' + PORT + '/' + randomizedCode;


    
    await prisma.url.create({
      data: {
        longUrl: req.body.url,
        randomCode: randomizedCode
      }
    })
    
  
    
    

    res.status(201).json({shortCode: randomizedCode, shortUrl: tinyUrl});

})


// ensure this is before shortCode route, or else it would think "stats" is a type of short code.
app.get('/stats/:shortCode', async (req, res) => { 

  let shortCodeRow = await prisma.url.findFirst({
  where: {
    randomCode: req.params.shortCode
  }
  })
  
if (!shortCodeRow) {
    const error = new Error("Short code not found");
    error.status = 404;
    throw error;
  }

  const {clickCount, longUrl} = shortCodeRow || {};

  res.status(200).send({clickCount: clickCount, originalUrl: longUrl})
})



app.get("/:shortCode", async (req, res) => {

const shortCodeRow = await prisma.url.findFirst({
  where: {
    randomCode: req.params.shortCode
  }
})


if (!shortCodeRow) {
    const error = new Error("Short code not found");
    error.status = 404;
    throw error;
  }



const longUrl = shortCodeRow.longUrl;




  await prisma.url.update({
    where: {randomCode: req.params.shortCode},
    data: {
      clickCount: {
        increment: 1,
      },
    },
  })
  
  
  res.redirect(longUrl)
})








app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).send(err.message);
})


module.exports = app;