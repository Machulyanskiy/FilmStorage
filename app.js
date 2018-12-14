const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const movieRoutes = require('./routes/movie');
const keys = require('./config/keys');
const app = express();

mongoose.connect(keys.mongoURI, {useCreateIndex: true, useNewUrlParser: true})
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.log(error));

app.use(require('morgan')('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/movie', movieRoutes);

module.exports = app;