// Define the JSON Schema for users
const UserSchemaSignUp = {
    type: 'object',
    required: ['firstName', 'lastName', 'email', 'password', 'address'],
    properties: {
        firstName: {
            type: 'string'
        },
        lastName: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        password: {
            type: 'string'
        },
        address: {
            type: 'string'
        }
    }
};

const UserSchemaLogIn = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {
            type: 'string'
        },
        password: {
            type: 'string'
        }
    }
};

exports.signUp = UserSchemaSignUp;
exports.logIn = UserSchemaLogIn;