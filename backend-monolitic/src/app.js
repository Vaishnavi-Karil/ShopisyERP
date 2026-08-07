const express = require('express'); 
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express(); 
const connectDB = require('./config/db.js');

const routes = require('./routes/index.route.js');
const errorHandler = require('./middlewares/error.middleware.js');


connectDB();
app.use(express.json()); 
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Error middleware should always be last
app.use(errorHandler);

app.use('/api', routes)

module.exports = app;