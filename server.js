const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
 const routes = require('./routes/data-access');
 const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const path = require('path');
 

//Get database URL from .env setting the systems environment variables
const mongoString =process.env.DATABASE_URL;

//Connect to DB and or Create it if not present.  

mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connection established');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

const database = mongoose.connection;


database.on('error', (error)=>{
    console.log(error);
});

database.once('connected', ()=>{console.log('Database Connected' +database.name)});

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', routes);
app.use(express.static(path.join(__dirname, 'public')));
app.listen(4000, () => {
    console.log(`Server Started at ${4000}`);
});
