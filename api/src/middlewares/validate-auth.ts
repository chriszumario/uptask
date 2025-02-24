import type { Request, Response, NextFunction } from 'express';
import { User, type IUser } from '../models/User';
import { verifyJWT } from '../utils/jwt';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        const error = new Error('No autorizado');
        return res.status(401).json({ success: false, message: error.message });
    }

    const [, token] = bearer.split(' ');

    try {
        const decoded = verifyJWT(token);

        if (typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select(
                '_id name email'
            );
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Token no válido',
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Token no válido',
        });
    }
};
