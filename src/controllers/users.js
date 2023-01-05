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
        return res.status(500).json(error.message);
    };
};

const getUser = async (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        return res.status(500).json(error.message);
    };
};

const profileEdit = async (req, res) => {
    let { username, biography } = req.body;
    const { id } = req.user;

    try {
        if (username.trim() === "") {
            return res.status(400).json("The username must be provided");
        };

        if (biography.trim() === "") {
            return res.status(400).json("The bio must be provided");
        };

        const userExists = await knex('users').where({ id }).first();

        if (!userExists) {
            return res.status(404).json("User not found");
        };

        const profileupdate = await knex('users')
            .where({ id })
            .update({
                username,
                biography
            })
            .returning("*");

        if (!profileupdate) {
            return res.status(400).json("The profile was not changed")
        };

        return res.status(200).json("the profile was updated");
    } catch (error) {
        return res.status(500).json(error.message);
    };
};

module.exports = {
    userRegister,
    getUser,
    profileEdit
};