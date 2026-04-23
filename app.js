// app.js
const { body, validationResult } = require("express-validator")
const { prisma } = require("./lib/prisma")
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json())

app.get("/", (req, res) => res.send("Health check, server is running"));

 app.post("/shorten", async (req, res) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let randomizedCode = "";
    for(let i = 0; i < 6; i++) {
      let randomCharacter = characters[Math.floor(Math.random() * characters.length)]
      randomizedCode += randomCharacter

    }

    const fullUrl = 'http://localhost:' + PORT + '/' + randomizedCode;
    console.log(fullUrl);

    

    await prisma.url.create({
      data: {
        longUrl: req.body.url,
        randomCode: randomizedCode
      }
    })
    
  
    
    let returnedUrl = {
      shortCode: randomizedCode,
      shortUrl: fullUrl
    } 

    res.status(201).json(returnedUrl);

})



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

app.listen(PORT, (error) => {

    if(error) {
        throw error;
    }

  console.log(`URL shortener - listening on port ${PORT}!`);
})

