import LoadingSpinner from "@/components/LoadingSpinner";
import ProfileForm from "@/components/profile/ProfileForm"
import { useAuth } from "@/hooks/useAuth"

export default function ProfileView() {
    const { data, isLoading } = useAuth()
    if (isLoading) return <LoadingSpinner />;
    if (data) return <ProfileForm data={data} />
}
