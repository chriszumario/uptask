import type { Request, Response } from 'express';
import { AuthEmail } from '../emails/AuthEmail';
import { encryptPassword, verifyPassword } from '../utils/bcrypt';
import { User } from '../models/User';
import { Token } from '../models/Token';
import { generateToken } from '../utils/token';
import { generateJWT } from '../utils/jwt';
import { config } from '../config/config';

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body;

            // Prevent duplicates
            const userExists = await User.findOne({ email });
            if (userExists) {
                const error = new Error('El usuario ya esta registrado');
                return res.status(409).json({ message: error.message });
            }

            // Create User
            const user = new User(req.body);

            // Hash Password
            user.password = await encryptPassword(password);

            // Generate  the token
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;
            // Send the email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            });

            await Promise.allSettled([user.save(), token.save()]);
            res.status(201).json({
                message: 'Cuenta creada, revisa tu correo para confirmar',
            });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;

            const tokenExists = await Token.findOne({ token });
            if (!tokenExists) {
                const error = new Error('Token no válido');
                return res.status(404).json({ message: error.message });
            }

            const user = await User.findById(tokenExists.user);
            if (!user) {
                const error = new Error('Usuario no encontrado');
                return res.status(404).json({ message: error.message });
            }
            user.confirmed = true;

            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
            res.json({
                message: 'Cuenta confirmada exitosamente',
            });
        } catch (error) {
            console.error('Error confirming account:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                const error = new Error('Usuario no encontrado');
                return res.status(404).json({ message: error.message });
            }

            if (!user.confirmed) {
                const token = new Token();
                token.user = user.id;
                token.token = generateToken();
                await token.save();

                // Send the email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token,
                });

                const error = new Error(
                    'La cuenta no ha sido confirmada, hemos enviado un correo electrónico de confirmación.'
                );
                return res.status(401).json({ message: error.message });
            }

            // Check password
            const isPasswordCorrect = await verifyPassword(
                password,
                user.password
            );
            if (!isPasswordCorrect) {
                const error = new Error('Contraseña incorrecta');
                return res.status(401).json({ message: error.message });
            }

            const token = generateJWT(
                { id: user._id },
                config.JWT_ACCESS_EXPIRATION_MINUTES
            );

            res.json(token);
        } catch (error) {
            console.error('Error logging into account:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            // Check if the user exists
            const user = await User.findOne({ email });
            if (!user) {
                const error = new Error('El usuario no esta registrado');
                return res.status(404).json({ message: error.message });
            }

            if (user.confirmed) {
                const error = new Error('El usuario ya está confirmado');
                return res.status(403).json({ message: error.message });
            }

            // Generate the token
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;

            // Send the email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            });

            await Promise.allSettled([user.save(), token.save()]);

            res.json({
                message: 'Se ha enviado un nuevo token a tu correo electrónico',
            });
        } catch (error) {
            console.error('Error confirming account:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            // Check if the user exists
            const user = await User.findOne({ email });
            if (!user) {
                const error = new Error('La usuaria no esta registrada');
                return res.status(404).json({ message: error.message });
            }

            // Generate the token
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;
            await token.save();

            // Send the email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token,
            });
            res.json({
                message:
                    'Revise su correo electrónico para obtener instrucciones',
            });
        } catch (error) {
            console.error('Error recovering account:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;

            const tokenExists = await Token.findOne({ token });
            if (!tokenExists) {
                const error = new Error('Token no válido');
                return res.status(404).json({ message: error.message });
            }
            res.json({
                message: 'Token válido, define tu nueva contraseña',
            });
        } catch (error) {
            console.error('Error validating token:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params;
            const { password } = req.body;

            const tokenExists = await Token.findOne({ token });
            if (!tokenExists) {
                const error = new Error('Token no válido');
                return res.status(404).json({ message: error.message });
            }

            const user = await User.findById(tokenExists.user);
            if (!user) {
                const error = new Error('Usuario no encontrado');
                return res.status(404).json({ message: error.message });
            }
            user.password = await encryptPassword(password);

            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

            res.json({
                message: 'La contraseña fue cambiada exitosamente',
            });
        } catch (error) {
            console.error('Error updating password by Token:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static user = async (req: Request, res: Response) => {
        return res.json(req.user);
    };

    static updateProfile = async (req: Request, res: Response) => {
        const { name, email } = req.body;

        const userExists = await User.findOne({ email });
        if (
            userExists &&
            userExists.id.toString() !== req.user?.id.toString()
        ) {
            const error = new Error(
                'Ese correo electrónico ya está registrado'
            );
            return res.status(409).json({ message: error.message });
        }

        if (!req.user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }
        req.user.name = name;
        req.user.email = email;

        try {
            await req.user.save();
            res.json({
                message: 'Perfil actualizado exitosamente',
            });
        } catch (error) {
            console.error('Error updating user profile:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const { current_password, password } = req.body;

        const user = await User.findById(req.user?.id);

        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({ message: error.message });
        }

        const isPasswordCorrect = await verifyPassword(
            current_password,
            user.password
        );
        if (!isPasswordCorrect) {
            const error = new Error('La contraseña actual es incorrecta');
            return res.status(401).json({ message: error.message });
        }

        try {
            user.password = await encryptPassword(password);
            await user.save();
            res.json({
                message: 'La contraseña se cambió correctamente',
            });
        } catch (error) {
            console.error('Error updating user password:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body;

        const user = await User.findById(req.user?.id);

        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({ message: error.message });
        }
        const isPasswordCorrect = await verifyPassword(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('La contraseña es incorrecta');
            return res.status(401).json({ message: error.message });
        }
        res.json({
            message: 'Contraseña correcta',
        });
    };
}
