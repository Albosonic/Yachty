import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

export const useAuthGaurdHook = () => {
    const router = useRouter()
    const session = useSession()  
    const { data, status } = session
    if (status === 'authenticated') return router.replace('/')
}