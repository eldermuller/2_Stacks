const knex = require('../database/connection');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const userRegisterSchema = require('../validations/userRegisterSchema');

const userRegister = async (req, res) => {
    const { email, password } = req.body;

    try {
        await userRegisterSchema.validate(req.body);

        const emailExists = await knex('users').where({ email }).first();

        if (emailExists) {
            return res.status(400).json("E-mail already registered");
        };

        const letters = /[a-z]/;
        const numbers = /[0-9]/;

        if (!letters.test(password)) {
            return res.status(400).json("The password must have at least one letter");
        };

        if (!numbers.test(password)) {
            return res.status(400).json("The password must have at least one number");
        };

        const encryptedPassword = await bcrypt.hash(password, 10);

        const userData = await knex('users').insert({
            id: uuid.v4(),
            email,
            password: encryptedPassword
        });

        return res.status(200).json("Registration successful")
    } catch (error) {
        return res.status(400).json(error.message);
    };
};

module.exports = {
    userRegister
};