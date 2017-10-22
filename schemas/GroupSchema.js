// Define the JSON Schema for groups
const GroupCreateSchema = {
    type: 'object',
    required: ['email', 'delta_time'],
    properties: {
        email: {
            type: 'string'
        },
        delta_time: {
            type: 'number'
        }
    }
};

const GroupSchema = {
    type: 'object',
    required: ['id', 'start_location', 'end_location', 'polyline', 'driver', 'passengers'],
    properties: {
        id: {
            type: 'string'
        },
        start_location: {
            type: 'object'
        },
        end_location: {
            type: 'object'
        },
        polyline: {
            type: 'string'
        },
        driver: {
            type: 'string'
        },
        passengers: {
            type: 'array'
        },
        departure_time: {
            type: 'object'
        }
    }
};

exports.create = GroupCreateSchema;
exports.get = GroupSchema;