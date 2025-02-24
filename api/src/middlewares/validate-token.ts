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

export const validateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            msg: 'No token provided',
        });
    }

    try {
        const decoded = verifyJWT(token) as { id: string };
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Token no válido - user does not exist in DB',
            });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Token validation error:', err);
        res.status(500).json({
            success: false,
            msg: 'Token no válido',
        });
    }
};
