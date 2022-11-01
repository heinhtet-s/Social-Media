const { body } = require('express-validator/check')
exports.userValidate = (method) => {
    switch (method) {
        case 'createUser': {
            return [
                body('first_name', 'First Name is required').exists(),
                body('last_name', 'Last Name is required').exists(),
                body('email').isEmail().withMessage('Please fill validate email').exists().withMessage('Password is required'),
                body('password', "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8  long").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
                body('confirm_password', 'Confirm Password is required').exists()
                    .trim().custom(async (confirmPassword, { req }) => {
                        const password = req.body.password;
                        if (password !== confirmPassword) {
                            throw new Error('Passwords must be same')
                        }
                    }),
                body('gender').exists().isIn(['male', 'female'])
            ];
        }
        case'changePassword' : {
            return [
                body('id').exists(),
                body('password', "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8  long").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
                body('confirm_password', 'Confirm Password is required').exists()
                    .trim().custom(async (confirmPassword, { req }) => {
                        const password = req.body.password;
                        if (password !== confirmPassword) {
                            throw new Error('Passwords must be same')
                        }
                    }),
            ]
        }
    }
}