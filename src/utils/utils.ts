export const generateCustomRandomString = (code: string) => {
    code = code.replace(/[^a-zA-Z0-9 ]/g, '');
    const chars = code
        .replace(' ', '')
        .concat(
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        );
    let result = '';
    for (let i = 0; i < 20; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
