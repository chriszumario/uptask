import {
    object,
    string,
    number,
    union,
    literal,
    transform,
    array,
    pipe,
    minValue,
    maxValue,
    check,
    type InferOutput,
    nonEmpty,
    safeParse,
} from 'valibot';

const isValidUrl = (value: string) => {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

const urlPipe = pipe(string(), check(isValidUrl, 'Invalid URL format'));

const envSchema = object({
    APPLICATION_NAME: string(),
    APPLICATION_VERSION: string(),
    ENVIRONMENT: union([
        literal('development'),
        literal('production'),
        literal('test'),
    ]),
    PORT: pipe(number(), minValue(1), maxValue(65535)),
    BASE_URL: urlPipe,
    DATABASE_URL: pipe(string(), nonEmpty('DATABASE_URL is required')),
    ALLOWED_ORIGINS: pipe(
        string(),
        nonEmpty('Allowed origins is required'),
        transform((value) => value.split(',').map((item) => item.trim())),
        array(urlPipe)
    ),
    SMTP_HOST: string(),
    SMTP_PORT: pipe(number(), minValue(1), maxValue(65535)),
    SMTP_USER: string(),
    SMTP_PASS: string(),
    JWT_SECRET: pipe(string(), nonEmpty('JWT SECRET is required')),
    JWT_ACCESS_EXPIRATION_MINUTES: string(),
    JWT_REFRESH_EXPIRATION_DAYS: string(),
});

type EnvConfig = InferOutput<typeof envSchema>;

const rawEnv = {
    APPLICATION_NAME: process.env.APPLICATION_NAME ?? '',
    APPLICATION_VERSION: process.env.APPLICATION_VERSION ?? 'v1.0.1',
    ENVIRONMENT: process.env.ENVIRONMENT ?? 'production',
    PORT: Number(process.env.PORT) || 4000,
    BASE_URL: process.env.BASE_URL ?? 'http://localhost',
    DATABASE_URL: process.env.DATABASE_URL,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    SMTP_HOST: process.env.SMTP_HOST ?? 'smtp.mailtrap.io',
    SMTP_PORT: Number(process.env.SMTP_PORT) || 2525,
    SMTP_USER: process.env.SMTP_USER ?? '',
    SMTP_PASS: process.env.SMTP_PASS ?? '',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_ACCESS_EXPIRATION_MINUTES:
        process.env.JWT_ACCESS_EXPIRATION_MINUTES || '15m',
    JWT_REFRESH_EXPIRATION_DAYS:
        process.env.JWT_REFRESH_EXPIRATION_DAYS || '30d',
};

const validateEnv = (): EnvConfig => {
    const result = safeParse(envSchema, rawEnv);
    if (result.success) {
        return result.output;
    } else {
        console.error('Invalid environment configuration:');
        result.issues.forEach((issue) => {
            console.error(`${issue.path?.[0]?.key}: ${issue.message}`);
        });
        process.exit(1);
    }
};

export const config = validateEnv();
