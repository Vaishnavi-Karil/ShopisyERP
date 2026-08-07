const app = require('./app');
require("dotenv").config();

const port = process.env.PORT || 4000;

app.listen(port, (req, res) => {
  console.log(`Monolithic Backend server is running for eccomerces on ${port}`)
}); 

