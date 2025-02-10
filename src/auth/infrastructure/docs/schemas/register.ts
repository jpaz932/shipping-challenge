export const registerSchema = {
    tags: ['Auth'],
    description: 'Permite a un usuario registrarse en el sistema',
    summary: 'Registro de usuario',
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            document: { type: 'number' },
            email: { type: 'string' },
            password: { type: 'string' },
        },
    },
    responses: {
        201: {
            description: 'Usuario registrado',
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                    },
                },
            },
        },
        400: {
            description: 'User already exists',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
};
