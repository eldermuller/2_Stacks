const express = require('express');
const { userRegister } = require('./controllers/users')

const routes = express();

routes.post('/register', userRegister);
routes.patch('/adress',)


module.exports = routes;