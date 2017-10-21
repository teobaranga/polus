// Define the JSON Schema for offices
const OfficeSchema = {
    type: 'object',
    required: ['company', 'state', 'address'],
    properties: {
        company: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        state: {
            type: 'string'
        },
        address: {
            type: 'string'
        }
    }
};

module.exports = OfficeSchema;