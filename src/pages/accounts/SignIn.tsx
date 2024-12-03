import { toast } from "@/hooks/use-toast";
import { setCookie, UserList, switchUser } from "@/lib/utils";
import { useFetchDetails } from "@/providers/fetch-details"
import { setUser } from "@/redux/userSlice";
import axios, { AxiosError } from "axios";
import { ArrowRight, Check, Eye, EyeOff, LoaderCircle, PawPrint } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function SignIn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const redirect = searchParams.get('redirect')
    const { refetchPets, refetchUser, refetchApplications } = useFetchDetails()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [loading, isLoading] = useState<boolean>(false)
    // const [error, setError] = useState<string>('')
    const [usersList, setUsersList] = useState<UserList[]>([])

    useEffect(() => {
        const storedUsers = localStorage.getItem('users_list')
        if (storedUsers) {
            setUsersList(JSON.parse(storedUsers))
        }
    }, [])

    const handleSwitchUser = (username: string) => {
      try {
          if (!username) {
              toast({
                  variant: 'destructive',
                  title: "Oops!",
                  description: "No user found to switch to"
              })
              navigate('/accounts/login')
              return
          }

          const success = switchUser(username)
          if (success) {
              refetchUser()
              refetchPets()
              refetchApplications()
              toast({
                  title: "Successfully switched user"
              })
              navigate('/accounts/profile')
          } else {
              toast({
                  variant: 'destructive',
                  title: "Oops!",
                  description: "Failed to switch user"
              })
          }
      } catch (error) {
          console.error('Switch user error:', error)
          toast({
              variant: 'destructive',
              title: "Oops!",
              description: "An error occurred while switching user"
          })
      }
  }

    const submit = async () => {
        try {
            isLoading(true)
            const userData = {
                email: email,
                password: password
            }

            /* FETCH */
            // const response = await fetch(import.meta.env.VITE_API_URL+'/users/signin', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(userData)
            // })

            // if (response.status === 200) {
            //     const data = await response.json()
            //     navigate(`/pet/${data.id}`)
            // }

            /* AXIOS */
            const response = await axios.post(
                import.meta.env.VITE_API_URL+'/users/signin',
                userData,
                { headers: { 'Content-Type': 'application/json' } }
            )

            if (response.status === 200) {
                const cookie = setCookie({
                  avatar: response.data.user?.avatar,
                  name: response.data.user.firstName + ' ' + response.data.user.lastName,
                  role: response.data.user.role,
                  username: response.data.user.username, 
                  token: response.data.token
                });
                if (!cookie) {
                  dispatch(setUser(response.data.user))
                  toast({
                    title: "You have signed in succesfully.",
                  })
                  isLoading(false)
                  if (redirect) {
                    navigate(redirect)
                  } else {
                    navigate(`/`)
                  }
                } else {
                  toast({
                    variant: 'destructive',
                    title: "Oops!", 
                    description: cookie
                  })
                } 
            }

        } catch (error: unknown) {
            console.error('error', error)
            
            const axiosError = error as AxiosError<{error: string}>
            if (!axiosError.response?.data) {
                toast({
                    variant: 'destructive', 
                    title: "Oops!",
                    description: "An error occurred"
                })
                return
            }

            toast({
                variant: 'destructive',
                title: "Oops!", 
                description: axiosError.response.data.error
            })
            isLoading(false)
        }
    }
    
    return (
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex items-center justify-center gap-2 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <PawPrint className="size-4" />
                </div>
                <span className="truncate font-semibold">Petty Store</span>
            </div>
            <div className="mt-1 text-center text-lg font-bold tracking-tight dark:text-gray-100 text-gray-900">
                Where Every Pet Finds Their Forever Home
            </div>
            
            <h2 className="mt-8 text-center text-2xl/9 font-bold tracking-tight dark:text-gray-100 text-gray-900">
              Sign in to your account
            </h2>
          </div>
  
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
            {usersList.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Sign in as:</h3>
                <div className="flex flex-wrap gap-2">
                  {usersList.map((user, index) => {
                    const isCurrentSession = Cookies.get('pt_session') === user.token
                    return (
                      <button
                        key={index}
                        onClick={() => handleSwitchUser(user.username)}
                        className="flex items-center gap-2 text-left px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.username}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
                            <span className="text-xs text-sidebar-primary">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="text-sm">{user.username}</span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    {isCurrentSession ? <Check className="h-4 w-4 text-muted-foreground" /> : <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isCurrentSession ? 'Current User' : 'Switch User'}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <form 
            onSubmit={(e) => {
                e.preventDefault()
                submit()
            }} 
            className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium dark:text-gray-100 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    disabled={loading}
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="block w-full rounded-md border-0 px-2 py-1.5 dark:text-gray-100 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-100 focus:ring-2 focus:ring-inset focus:ring-sidebar-primary/60 sm:text-sm/6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium dark:text-gray-100 text-gray-900">
                    Password
                  </label>
                  <div className="text-sm">
                    <Link to="/accounts/forgot-password" className="font-semibold text-sidebar-primary hover:text-sidebar-primary/50">
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <div className="mt-2 relative">
                  <input
                    disabled={loading}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 px-2 py-1.5 dark:text-gray-100 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-100 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-sidebar-primary/60 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {loading ? <LoaderCircle className="animate-spin text-white" /> : 'Sign in'}
                </button>
              </div>
            </form>
  
            {/* <p className="mt-10 text-center text-sm/6 text-gray-500">
              Not a member?{' '}
              <Link to="/accounts/free-trial" className="font-semibold text-sidebar-primary/60 hover:text-sidebar-primary/50">
                Start a 14 day free trial
              </Link>
            </p> */}
            <p className="mt-2 text-center text-sm/6 text-gray-500">
              Don't have an account?{' '}
              <Link to="/accounts/signup" className="font-semibold text-sidebar-primary/60 hover:text-sidebar-primary/50">
                Create yours now
              </Link>
            </p>
          </div>
        </div>
      </>
    )
}
  