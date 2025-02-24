import type { Request, Response } from 'express';
import { Project } from '../models/Project';

export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);
        // Assing manager to the project
        if (req.user) {
            project.manager = req.user.id;
        }
        try {
            await project.save();
            res.status(201).json({
                message: 'Proyecto creado correctamente',
            });
        } catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    message: 'No autorizado',
                });
            }

            const userId = req.user.id;

            const projects = await Project.find({
                $or: [{ manager: userId }, { team: userId }],
            }).populate('tasks');

            res.json(projects);
        } catch (error) {
            console.error('Error retrieving projects:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static getProjectById = async (req: Request, res: Response) => {
        const { projectId } = req.params;
        try {
            const project = await Project.findById(projectId).populate('tasks');
            if (!project) {
                return res.status(404).json({
                    message: 'Proyecto no encontrado',
                });
            }

            const userId = req.user?.id;

            if (
                project.manager?.toString() !== userId?.toString() &&
                !project.team.includes(userId)
            ) {
                return res.status(403).json({
                    message: 'Acceso denegado',
                });
            }

            res.json(project);
        } catch (error) {
            console.error('Error displaying a project:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static updateProject = async (req: Request, res: Response) => {
        try {
            const { project } = req;

            if (!project) {
                return res.status(404).json({
                    message: 'Proyecto no encontrado',
                });
            }

            // Check permissions: only the manager can update
            if (project.manager?.toString() !== req.user?.id?.toString()) {
                return res.status(403).json({
                    message:
                        'Acceso denegado: Sólo puedes actualizar los proyectos que administras',
                });
            }

            // Update fields
            const { clientName, projectName, description } = req.body;
            if (clientName) project.clientName = clientName;
            if (projectName) project.projectName = projectName;
            if (description) project.description = description;

            await project.save();

            res.json({
                message: 'Proyecto actualizado exitosamente',
            });
        } catch (error) {
            console.error('Error updating project:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static deleteProject = async (req: Request, res: Response) => {
        try {
            const { project } = req;
            console.log(req.project);

            if (!project) {
                return res.status(404).json({
                    message: 'Proyecto no encontrado',
                });
            }

            // Check permissions: only the manager can delete
            if (project.manager?.toString() !== req.user?.id?.toString()) {
                return res.status(403).json({
                    message:
                        'Acceso denegado: Solo puedes eliminar proyectos que administras',
                });
            }

            await project.deleteOne();

            res.json({
                message: 'Proyecto eliminado exitosamente',
            });
        } catch (error) {
            console.error('Error deleting project:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };
}
