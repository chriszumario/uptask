import { Router } from 'express';
import { body, param } from 'express-validator';

import { authenticate } from '../middlewares/validate-auth';
import { validateFields } from '../middlewares/validate-fields';
import { ProjectController } from '../controllers/project.controller';
import { projectExists } from '../middlewares/validate-project';
import {
    hasAuthorization,
    taskBelongsToProject,
    taskExists,
} from '../middlewares/validate-taks';
import { TaskController } from '../controllers/task.controller';
import { TeamMemberController } from '../controllers/team.controller';
import { NoteController } from '../controllers/note.controller';

const router = Router();

router.use(authenticate);

router.post(
    '/',
    body('projectName')
        .notEmpty()
        .withMessage('The name of the project is required'),
    body('clientName').notEmpty().withMessage('Name of the client is required'),
    body('description').notEmpty().withMessage('Discription is required'),
    validateFields,
    ProjectController.createProject
);

router.get('/', ProjectController.getAllProjects);

router.get(
    '/:projectId',
    param('projectId').isMongoId().withMessage('Invalid ID'),
    validateFields,
    ProjectController.getProjectById
);

/** Routes for tasks */
router.param('projectId', projectExists);

router.put(
    '/:projectId',
    param('projectId').isMongoId().withMessage('Invalid ID'),
    body('projectName').notEmpty().withMessage('Project Name is Required'),
    body('clientName').notEmpty().withMessage('Client Name is Required'),
    body('description')
        .notEmpty()
        .withMessage('Project Description is Required'),
    validateFields,
    hasAuthorization,
    ProjectController.updateProject
);

router.delete(
    '/:projectId',
    param('projectId').isMongoId().withMessage('Invalid ID'),
    validateFields,
    hasAuthorization,
    ProjectController.deleteProject
);

router.post(
    '/:projectId/tasks',
    hasAuthorization,
    body('name').notEmpty().withMessage('Task Name is Required'),
    body('description')
        .notEmpty()
        .withMessage('The task description is required'),
    validateFields,
    TaskController.createTask
);

router.get('/:projectId/tasks', TaskController.getProjectTasks);

router.param('taskId', taskExists);
router.param('taskId', taskBelongsToProject);

router.get(
    '/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid ID'),
    validateFields,
    TaskController.getTaskById
);

router.put(
    '/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid ID'),
    body('name').notEmpty().withMessage('Task Name is Required'),
    body('description').notEmpty().withMessage('Task description is required'),
    validateFields,
    TaskController.updateTask
);

router.delete(
    '/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid ID'),
    validateFields,
    TaskController.deleteTask
);

router.post(
    '/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Invalid ID'),
    body('status').notEmpty().withMessage('The state is required'),
    validateFields,
    TaskController.updateStatus
);
/** Routes for teams */
router.post(
    '/:projectId/team/find',
    body('email').isEmail().toLowerCase().withMessage('Invalid email'),
    validateFields,
    TeamMemberController.findMemberByEmail
);

router.get('/:projectId/team', TeamMemberController.getProjecTeam);

router.post(
    '/:projectId/team',
    body('id').isMongoId().withMessage('Invalid ID'),
    validateFields,
    TeamMemberController.addMemberById
);

router.delete(
    '/:projectId/team/:userId',
    param('userId').isMongoId().withMessage('Invalid ID'),
    validateFields,
    TeamMemberController.removeMemberById
);

/** Routes for Notes */
router.post(
    '/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty()
        .withMessage('The content of the note is required'),
    validateFields,
    NoteController.createNote
);

router.get('/:projectId/tasks/:taskId/notes', NoteController.getTaskNotes);

router.delete(
    '/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('Invalid ID'),
    validateFields,
    NoteController.deleteNote
);

export default router;
