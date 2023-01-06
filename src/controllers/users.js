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

const updatePassword = async (req, res) => {
    const { password, confirmPassword, newPassword, confirmNewPassword } = req.body;
    const { id } = req.user;

    try {
        if (password.trim() === "" || confirmPassword.trim() === "" || newPassword.trim() === "" || confirmNewPassword.trim() === "") {
            return res.status(400).json("All fields are required");
        }

        const user = await knex('users').where({ id }).first();

        if (password !== confirmPassword) {
            return res.status(400).json("Passwords do not match");
        };

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(401).json("Password invalid");
        };


        if (newPassword !== confirmNewPassword) {
            return res.status(400).json("New passwords do not match");
        };

        const encriptedPassword = await bcrypt.hash(newPassword, 10);

        const passwordUpdate = await knex('users')
            .where({ id })
            .update({
                password: encriptedPassword
            })
            .returning("*");

        if (!passwordUpdate) {
            return res.status(400).json("The password was not changed")
        };

        return res.status(200).json("Password successfully changed!");
    } catch (error) {
        return res.status(500).json(error.message);
    };

};

module.exports = {
    userRegister,
    getUser,
    profileEdit,
    updatePassword
};