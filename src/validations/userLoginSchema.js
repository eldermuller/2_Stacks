const yup = require('./yup');

const userLoginSchema = yup.object().shape({
    email: yup
        .string()
        .email("The email must have a valid format")
        .required("E-mail must be provided"),

    password: yup
        .string()
        .required("The password must be provided")
});

module.exports = userLoginSchema;