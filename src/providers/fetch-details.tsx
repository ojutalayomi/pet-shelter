import { useEffect, createContext, useContext, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { useToast } from "@/hooks/use-toast"
// import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { useDispatch, useSelector } from 'react-redux'
import { setAdoptionApplicationList, setAdoptionApplicationListForAdmin, setPets } from '@/redux/petSlice'
import { setUser } from '@/redux/userSlice'
import { RootState } from '@/redux/store'
import { User } from '@/types/type'

// Determine the environment
const isTesting = (window.location.protocol === 'https:' && import.meta.env.MODE === 'development') ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_API_URL;

// eslint-disable-next-line react-refresh/only-export-components
export const api = axios.create({
  baseURL: isTesting, // Use the local development URL
  withCredentials: true, // Important for sending cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

// Define the context type
type FetchDetailsContextType = {
  refetchPets: () => Promise<void>
  refetchUser: () => Promise<void>
  refetchApplications: () => Promise<void>
  clearUserError: () => void
  isLoading: {
    pets: boolean
    user: boolean
    applications: boolean
  }
  error: {
    pets: string | null
    user: string | null
    applications: string | null
  }
}

// Create the context
const FetchDetailsContext = createContext<FetchDetailsContextType | undefined>(undefined)

// Create a hook to use this context
// eslint-disable-next-line react-refresh/only-export-components
export function useFetchDetails() {
  const context = useContext(FetchDetailsContext)
  if (!context) {
    throw new Error('useFetchDetails must be used within a FetchDetailsProvider')
  }
  return context
}

const FetchDetailsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {

    const { toast } = useToast()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const trigger = useRef(false)
    const user = useSelector((state: RootState) => state.user)

    // Add loading and error states
    const [isLoading, setIsLoading] = useState({
      pets: false,
      user: false,
      applications: false
    })
    const [error, setError] = useState({
      pets: null as string | null,
      user: null as string | null,
      applications: null as string | null
    })

    // Extract the functions from useEffect
    const getPets = async () => {
      setIsLoading(prev => ({ ...prev, pets: true }))
      setError(prev => ({ ...prev, pets: null }))
      try {
        const response = await api.get('/pets')
        if (response.status === 200) dispatch(setPets(response.data))
      } catch (error) {
        console.error('error', error)
        setError(prev => ({ ...prev, pets: "Error fetching pets" }))
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Error connecting to server",
          action: (
            <ToastAction altText="Try to connect to the server again." onClick={getPets}>Connect</ToastAction>
          ),
        })
      } finally {
        setIsLoading(prev => ({ ...prev, pets: false }))
      }
    }

    const getUser = async () => {
      setIsLoading(prev => ({ ...prev, user: true }))
      setError(prev => ({ ...prev, user: null }))

      try {
        const response = await api.get('/users/get')
        // delete response.data._id
        if (response.status === 200) dispatch(setUser(response.data))
      } catch (error) {
        console.error('error', error)
        const axiosError = error as AxiosError<{error: string, message: string}>
        if (!axiosError.response?.data) {
          setError(prev => ({ ...prev, user: "Error connecting to server" }))
          toast({
            variant: 'destructive', 
            title: "Oops!",
            description: "Error connecting to server. Unable to get your details"
          })
          return
        }
        setError(prev => ({ ...prev, user: (axiosError.response?.data.error || axiosError.response?.data.message) ?? null }))

        const click = () => {
          if(axiosError?.response?.data.error){
            if(axiosError?.response?.data.error.includes('log in')){
              navigate(`/accounts/login`)
            } 
          } else {
            getUser()
          }
        }
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${axiosError.response.data.error || axiosError.response.data.message}`,
          action: (
            <ToastAction altText="Try to connect to the server again." onClick={click}>Connect</ToastAction>
          ),
        })
      } finally {
        setIsLoading(prev => ({ ...prev, user: false }))
      }
    }

    const fetchApplications = async (userRole: User['role'] = 'user') => {
      setIsLoading(prev => ({ ...prev, applications: true }))
      setError(prev => ({ ...prev, applications: null }))
      try {
        const response = await api.get('/pets/adoption-applications',
          {
            ...(userRole !== 'user' ? {
              headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userRole}`
              } 
            } : {}),
            withCredentials: true
          }
        )
        if (response.status === 200) {
          if (userRole === 'user') dispatch(setAdoptionApplicationList(response.data))
          else dispatch(setAdoptionApplicationListForAdmin(response.data))  
        }
      } catch (error: unknown) {
        console.error(error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch applications"
        })
      } finally {
        setIsLoading(prev => ({ ...prev, applications: false }))
      }
    }

    useEffect(() => {
      localStorage.setItem('initialFetchComplete', 'false')
      const hasRun = localStorage.getItem('initialFetchComplete')
      if (hasRun === 'false' && !trigger.current) {
        trigger.current = true
        getPets()
        if (Cookies.get('pt_session')) {
          getUser() 
          fetchApplications()
        }
        localStorage.setItem('initialFetchComplete', 'true')
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if (user.role !== 'user') fetchApplications(user.role)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.role])

    useEffect(() => {
      if(!user.id) {
        setError(prev => ({ ...prev, user: "No user found" }))
      } else {
        setError(prev => ({ ...prev, user: null }))
      }
    }, [user.id])

    // Create the context value
    const value = {
      refetchPets: getPets,
      refetchUser: getUser,
      refetchApplications: (async () => {
        localStorage.setItem('initialFetchComplete', 'false')
        fetchApplications()
        if (user.role !== 'user') fetchApplications(user.role)
        localStorage.setItem('initialFetchComplete', 'true')
      }),
      clearUserError: () => setError(prev => ({ ...prev, user: null })),
      isLoading,
      error
    }

    return (
        <FetchDetailsContext.Provider value={value}>
            {children}
        </FetchDetailsContext.Provider>
    )
}

export default FetchDetailsProvider