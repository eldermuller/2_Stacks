const express = require('express');
const { userRegister } = require('./controllers/users');
const { userLogin } = require('./controllers/usersLogin');
const loginFilter = require('./filters/loginFilter');

const routes = express();

routes.post('/register', userRegister);

routes.post('/login', userLogin);



module.exports = routes;