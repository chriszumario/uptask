import { sign, verify, type JwtPayload } from 'jsonwebtoken';
import { config } from '../config/config';

const JWT_SECRET = config.JWT_SECRET;

export const generateJWT = (payload: JwtPayload, expiresIn: string) => {
    return sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyJWT = (token: string) => {
    try {
        return verify(token, JWT_SECRET);
    } catch (error) {
        console.error('Token verification error:', error);
        throw new Error('Token no válido');
    }
};
