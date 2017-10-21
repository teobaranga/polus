// Define the JSON Schema for users
const UserSchema = {
    type: 'object',
    required: ['firstName', 'lastName', 'email', 'password'],
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
        }
    }
};

module.exports = UserSchema;