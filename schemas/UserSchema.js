// Define the JSON Schema for users
const UserSchemaSignUp = {
    type: 'object',
    required: ['firstName', 'lastName', 'email', 'password', 'homeAddress', 'officeAddress'],
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
        homeAddress: {
            type: 'string'
        },
        officeAddress: {
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