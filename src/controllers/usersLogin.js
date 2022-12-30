const knex = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userLoginSchema = require('../validations/userLoginSchema');

const userLogin = async (req, res) => {

    const { email, password } = req.body;

    try {
        await userLoginSchema.validate(req.body);

        const user = await knex('users').where({ email }).first();

        if (!user) {
            return res.status(401).json("E-mail and/or password invalid");
        };

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(401).json("E-mail and/or password invalid");
        };

        const token = jwt.sign({ id: user.id }, process.env.PASSWORD_JWT, { expiresIn: '1h' });

        return res.status(200).json({
            id: user.id,
            user: user.username,
            token
        });
    } catch (error) {
        return res.status(500).json(error.message);
    };

};

module.exports = {
    userLogin
};