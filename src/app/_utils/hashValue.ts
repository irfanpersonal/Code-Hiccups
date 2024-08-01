import bcrypt from 'bcryptjs';

const hashValue = async(value: string) => {
    const randomBytes = await bcrypt.genSalt(10);
    const hashedValue =  await bcrypt.hash(value, randomBytes);
    return hashedValue;
}

export default hashValue;