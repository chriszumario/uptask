import { hash, compare } from 'bcrypt';

const encryptPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);
    return hashedPassword;
};

const verifyPassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    const isMatch = await compare(password, hashedPassword);
    return isMatch;
};

export { encryptPassword, verifyPassword };
