export const loginSchema = {
    tags: ['Auth'],
    description: 'Permite a un usuario autenticarse en el sistema',
    summary: 'Login de usuario',
    body: {
        type: 'object',
        properties: {
            email: { type: 'string' },
            password: { type: 'string' },
        },
        required: ['email', 'password'],
    },
    response: {
        200: {
            description: 'Usuario autenticado',
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
        401: {
            description: 'Credenciales inválidas',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
        403: {
            description: 'Usuario no autorizado',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
};
