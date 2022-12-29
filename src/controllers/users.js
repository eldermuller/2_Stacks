const knex = require('../database/connection');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const userRegister = async (req, res) => {
    const { email, password } = req.body;

    try {
        const emailExists = await knex('users').where({ email }).first();

        if (emailExists) {
            return res.status(400).json("E-mail already registered");
        };

        const encryptedPassword = await bcrypt.hash(password, 10);

        const userData = await knex('users').insert({
            id: uuid.v4(),
            email,
            password: encryptedPassword
        });

        return res.status(200).json("Registration successful")
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    };
};

module.exports = {
    userRegister
};