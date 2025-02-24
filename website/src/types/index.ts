import {
    object,
    string,
    array,
    pick,
    InferOutput,
    email,
    pipe,
    picklist,
} from 'valibot';

/** Auth & Users */
const authSchema = object({
    _id: string(),
    name: string(),
    email: pipe(string(), email()),
    current_password: string(),
    password: string(),
    password_confirmation: string(),
    token: string(),
});

type Auth = InferOutput<typeof authSchema>;
export type UserLoginForm = Pick<Auth, 'email' | 'password'>;
export type UserRegistrationForm = Pick<
    Auth,
    'name' | 'email' | 'password' | 'password_confirmation'
>;
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>;
export type ForgotPasswordForm = Pick<Auth, 'email'>;
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>;
export type UpdateCurrentUserPasswordForm = Pick<
    Auth,
    'current_password' | 'password' | 'password_confirmation'
>;
export type ConfirmToken = Pick<Auth, 'token'>;
export type CheckPasswordForm = Pick<Auth, 'password'>;

/** Users */
export const userSchema = pick(authSchema, ['_id', 'name', 'email']);

export type User = InferOutput<typeof userSchema>;
export type UserProfileForm = Pick<User, 'name' | 'email'>;

/** Notes */
const noteSchema = object({
    _id: string(),
    content: string(),
    createdBy: userSchema,
    task: string(),
    createdAt: string(),
});
export type Note = InferOutput<typeof noteSchema>;
export type NoteFormData = Pick<Note, 'content'>;

/** Tasks */
export const taskStatusSchema = picklist([
    'pending',
    'onHold',
    'inProgress',
    'underReview',
    'completed',
]);
export type TaskStatus = InferOutput<typeof taskStatusSchema>;

export const taskSchema = object({
    _id: string(),
    name: string(),
    description: string(),
    project: string(),
    status: taskStatusSchema,
    completedBy: array(
        object({
            _id: string(),
            user: userSchema,
            status: taskStatusSchema,
        })
    ),
    notes: array(noteSchema),
    createdAt: string(),
    updatedAt: string(),
});

export const taskProjectSchema = pick(taskSchema, [
    '_id',
    'name',
    'description',
    'status',
]);

export type Task = InferOutput<typeof taskSchema>;
export type TaskFormData = Pick<Task, 'name' | 'description'>;
export type TaskProject = InferOutput<typeof taskProjectSchema>;

/** Projects */
export const projectSchema = object({
    _id: string(),
    projectName: string(),
    clientName: string(),
    description: string(),
    manager: string(),
    tasks: array(taskProjectSchema),
    team: array(string()),
});

export const dashboardProjectSchema = array(
    pick(projectSchema, [
        '_id',
        'projectName',
        'clientName',
        'description',
        'manager',
    ])
);

export const editProjectSchema = pick(projectSchema, [
    'projectName',
    'clientName',
    'description',
]);

export type Project = InferOutput<typeof projectSchema>;
export type ProjectFormData = Pick<
    Project,
    'clientName' | 'projectName' | 'description'
>;

/** Team */
const teamMemberSchema = pick(userSchema, ['name', 'email', '_id']);
export const teamMembersSchema = array(teamMemberSchema);

export type TeamMember = InferOutput<typeof teamMemberSchema>;
export type TeamMemberForm = Pick<TeamMember, 'email'>;
