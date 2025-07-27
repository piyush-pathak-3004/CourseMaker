export const validateInput = (input) => {
    if (!input || typeof input !== 'string' || input.trim().length === 0) {
        throw new Error('Invalid input: Input must be a non-empty string.');
    }
    return input.trim();
};

export const formatResponse = (data) => {
    return {
        success: true,
        data: data,
    };
};