// app.js
const { body, validationResult } = require("express-validator")
const { prisma } = require("./lib/prisma")
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json())

app.get("/", (req, res) => res.send("Hello World!"));

 app.post("/shorten", async (req, res) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let randomizedCode = "";
    for(let i = 0; i < 6; i++) {
      let randomCharacter = characters[Math.floor(Math.random() * characters.length)]
      randomizedCode += randomCharacter

    }

    const myURL = new URL(req.body.url);


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

    let jsonReturnedUrl = JSON.stringify(returnedUrl);
    res.send(jsonReturnedUrl).header(200); 

})


app.get('/stats/:shortCode', async (req, res) => { // put stats route before :shortCode, or else a request with stats/:shortCode, would match :shortCode and think stats is a short code when it isnt
  const shortCodeRow = await prisma.url.findFirst({
  where: {
    randomCode: req.params.shortCode
  }
})




const {clickCount, longUrl} = shortCodeRow || {};


if(clickCount && longUrl) {


res.send({clickCount: clickCount, originalUrl: longUrl}).status(200)


}

})

app.get("/:shortCode", async (req, res) => {


const shortCodeRow = await prisma.url.findFirst({
  where: {
    randomCode: req.params.shortCode
  }
})


const longUrl = shortCodeRow.longUrl;


if(longUrl)
 {

  // maybe dont set it a variable? leave it at await

  await prisma.url.update({
    where: {randomCode: req.params.shortCode},
    data: {
      clickCount: {
        increment: 1,
      },
    },
  })


  res.redirect(longUrl).status(302);
 }
})










app.listen(PORT, (error) => {



    if(error) {
        throw error;
    }
  console.log(`My first Express app - listening on port ${PORT}!`);
})

