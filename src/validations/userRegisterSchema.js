const yup = require('./yup');

const userRegisterSchema = yup.object().shape({
    password:
        yup
            .string()
            .min(5)
            .required("This field is required - password"),
    email:
        yup
            .string()
            .email("The email must have a valid format")
            .required("This field is required - e-mail")
});

module.exports = userRegisterSchema;