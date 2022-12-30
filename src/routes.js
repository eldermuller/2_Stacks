const express = require('express');
const { userRegister } = require('./controllers/users');
const loginFilter = require('./filters/loginFilter')

const routes = express();

routes.post('/register', userRegister);



module.exports = routes;