const knex = require('../database/connection');
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
            email,
            password: encryptedPassword
        });

        return res.status(200).json("Registration successful")
    } catch (error) {
        return res.status(400).json(error.message);
    };
};