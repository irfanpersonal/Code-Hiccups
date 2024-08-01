const createError = (message: string) => {
    const error = new Error(message);
    error.name = 'CustomError';
    throw error;
}

export default createError;