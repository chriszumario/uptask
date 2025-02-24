import { Project, TeamMember } from "../types"

export const isManager = (managerId: Project['manager'], userId: TeamMember['_id']) => managerId === userId