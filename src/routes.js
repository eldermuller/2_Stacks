const express = require('express');
const { userRegister, getUser } = require('./controllers/users');
const { userLogin } = require('./controllers/usersLogin');
const loginFilter = require('./filters/loginFilter');

const routes = express();

routes.post('/register', userRegister);

routes.post('/login', userLogin);

routes.use(loginFilter);

routes.get('/get-user', getUser);



module.exports = routes;