import bcrypt from 'bcryptjs';

const comparePassword = async(guess: string, password: string) => {
    const isCorrect = await bcrypt.compare(guess, password);
    return isCorrect;
}

export default comparePassword;