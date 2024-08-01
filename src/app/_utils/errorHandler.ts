const errorHandler = (error: any): {msg: string} => {
    if (error.name === 'ZodError' || error.message === 'Empty file' || error.name === 'PrismaClientKnownRequestError') {
        return {msg: 'Please check all inputs!'};
    }
    else if (error.name === 'CustomError') {
        return {msg: error.message};
    }
    else if (error.code === 'P2002') {
        return {msg: 'You can only make one researchEffortRating for each quesiton!'};
    }
    return {msg: 'Something went wrong, try again later!'};
}

export default errorHandler;