// Define the JSON Schema for users
const UserSchemaSignUp = {
    type: 'object',
    required: ['firstName', 'lastName', 'email', 'password', 'homeAddress', 'officeAddress'],
    properties: {
        firstName: {
            type: 'string',
            minLength: 1
        },
        lastName: {
            type: 'string',
            minLength: 1
        },
        email: {
            type: 'string',
            minLength: 3
        },
        password: {
            type: 'string',
            minLength: 6
        },
        homeAddress: {
            type: 'string',
            minLength: 5
        },
        officeAddress: {
            type: 'string',
            minLength: 5
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