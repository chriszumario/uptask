import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import { getFullProject } from "@/services/project.service"
import AddTaskModal from "@/components/tasks/AddTaskModal"
import TaskList from "@/components/tasks/TaskList"
import EditTaskData from "@/components/tasks/EditTaskData"
import TaskModalDetails from "@/components/tasks/TaskModalDetails"
import { useAuth } from "@/hooks/useAuth"
import { isManager } from "@/utils/policies"
import { useMemo } from "react"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function ProjectDetailsView() {

    const { data: user, isLoading: authLoading } = useAuth()
    const navigate = useNavigate()

    const params = useParams()
    const projectId = params.projectId!
    const { data, isLoading, isError } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => getFullProject(projectId),
        retry: false
    })
    const canEdit = useMemo(() => data?.manager === user?._id, [data, user])
    if (isLoading || authLoading) return <LoadingSpinner />;
    if (isError) return <Navigate to='/404' />
    if (data && user) return (
        <>
            <h1 className="text-3xl font-black">{data.projectName}</h1>
            <p className="text-2xl font-light text-gray-500">{data.description}</p>

            {isManager(data.manager, user._id) && (
                <nav className="my-5 flex gap-3">
                    <button
                        type="button"
                        className="bg-emerald-600 hover:bg-emerald-700 px-10 py-3 text-white  font-bold cursor-pointer transition-colors rounded-lg"
                        onClick={() => navigate(location.pathname + '?newTask=true')}
                    >Agregar Tarea</button>

                    <Link
                        to={'team'}
                        className="bg-emerald-600 hover:bg-emerald-700 px-10 py-3 text-white font-bold cursor-pointer transition-colors rounded-lg"
                    >Colaboradores</Link>
                </nav>
            )}

            <TaskList
                tasks={data.tasks}
                canEdit={canEdit}
            />
            <AddTaskModal />
            <EditTaskData />
            <TaskModalDetails />
        </>
    )
}
