const knex = require('../database/connection');
const jwt = require('jsonwebtoken');

const loginFilter = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json('Unauthorized');
    }

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, process.env.PASSWORD_JWT);

        const userExists = await knex('users').where({ id }).first();

        if (!userExists) {
            return res.status(404).json("User nor found");
        };

        const { password, ...user } = userExists

        req.user = user;

        next();
    } catch (error) {
        return res.status(500).json(error.message);
    };
};

module.exports = loginFilter;