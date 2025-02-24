import nodemailer from 'nodemailer';
import { config } from './config';

const configMailer = () => {
    return {
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        auth: {
            user: config.SMTP_USER,
            pass: config.SMTP_PASS,
        },
    };
};

export const transporter = nodemailer.createTransport(configMailer());
