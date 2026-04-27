// server.js
const app = require('./app.js');
const PORT = process.env.PORT || 8080;

app.listen(PORT, (error) => {
  if(error) throw error;
  console.log(`URL shortener - listening on port ${PORT}!`);
})