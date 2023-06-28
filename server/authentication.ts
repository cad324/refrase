import bcrypt from "bcryptjs";

const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email: string): boolean => {
    return emailRegex.test(email);
}

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
}