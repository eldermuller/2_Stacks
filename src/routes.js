const express = require('express');
const { userRegister, getUser, profileEdit, updatePassword } = require('./controllers/users');
const { userLogin } = require('./controllers/usersLogin');
const loginFilter = require('./filters/loginFilter');

const routes = express();

routes.post('/register', userRegister);

routes.post('/login', userLogin);

routes.use(loginFilter);

routes.get('/get-user', getUser);
routes.patch('/profile-edit', profileEdit);
routes.patch('/update-password', updatePassword);


module.exports = routes;