import type { Request, Response } from 'express';
import { User } from '../models/User';
import { Project } from '../models/Project';

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body;

        // Find user
        const user = await User.findOne({ email }).select('id email name');
        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        res.json(user)
    };

    static getProjecTeam = async (req: Request, res: Response) => {
        const project = await Project.findById(req.project.id).populate({
            path: 'team',
            select: 'id email name'
        })
        res.json(project?.team)
    }

    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body;

        // Find user
        const user = await User.findById(id).select('id');
        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({
                message: error.message,
            });
        }

        if (
            req.project.team.some(
                (team) => team?.toString() === user.id.toString()
            )
        ) {
            const error = new Error('El usuario ya existe en el proyecto.');
            return res.status(409).json({
                message: error.message,
            });
        }

        req.project.team.push(user.id);
        await req.project.save();

        res.json({
            message: 'Usuario añadido exitosamente',
        });
    };

    static removeMemberById = async (req: Request, res: Response) => {
        const { userId } = req.params;

        if (!req.project.team.some((team) => team?.toString() === userId)) {
            const error = new Error('La usuario no existe en el proyecto.');
            return res.status(409).json({
                message: error.message,
            });
        }

        req.project.team = req.project.team.filter(
            (teamMember) => teamMember?.toString() !== userId
        );
        await req.project.save();
        res.json({
            message: 'Usuario eliminada exitosamente',
        });
    };
}
