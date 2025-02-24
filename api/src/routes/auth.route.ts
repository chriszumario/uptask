import { Router } from 'express';
import { body, param } from 'express-validator';

import { authenticate } from '../middlewares/validate-auth';
import { validateFields } from '../middlewares/validate-fields';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post(
    '/create-account',
    body('name').notEmpty().withMessage('The name cannot be empty'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('The password is very short, minimum 8 characters'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords are not the same');
        }
        return true;
    }),
    body('email').isEmail().withMessage('Invalid email'),
    validateFields,
    AuthController.createAccount
);

router.post(
    '/confirm-account',
    body('token').notEmpty().withMessage('The Token cannot be empty'),
    validateFields,
    AuthController.confirmAccount
);

router.post(
    '/login',
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('The password cannot be empty'),
    validateFields,
    AuthController.login
);

router.post(
    '/request-code',
    body('email').isEmail().withMessage('Invalid email'),
    validateFields,
    AuthController.requestConfirmationCode
);

router.post(
    '/forgot-password',
    body('email').isEmail().withMessage('Invalid email'),
    validateFields,
    AuthController.forgotPassword
);

router.post(
    '/validate-token',
    body('token').notEmpty().withMessage('The Token cannot be empty'),
    validateFields,
    AuthController.validateToken
);

router.post(
    '/update-password/:token',
    param('token').isNumeric().withMessage('Token no válido'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('The password is very short, minimum 8 characters')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords are not the same');
            }
            return true;
        }),
    validateFields,
    AuthController.updatePasswordWithToken
);

router.get('/user', authenticate, AuthController.user);

/** Profile */
router.put(
    '/profile',
    authenticate,
    body('name').notEmpty().withMessage('The name cannot be empty'),
    body('email').isEmail().withMessage('Invalid email'),
    validateFields,
    AuthController.updateProfile
);

router.post(
    '/update-password',
    authenticate,
    body('current_password')
        .notEmpty()
        .withMessage('The current password cannot be empty'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('The password is very short, minimum 8 characters.')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords are not the same');
            }
            return true;
        }),
    validateFields,
    AuthController.updateCurrentUserPassword
);

router.post(
    '/check-password',
    authenticate,
    body('password').notEmpty().withMessage('The password cannot be empty'),
    validateFields,
    AuthController.checkPassword
);

export default router;
