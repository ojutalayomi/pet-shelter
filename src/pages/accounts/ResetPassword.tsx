import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff, LoaderCircle, PawPrint } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); 
   
    const [password, setPassword] = useState<string>('')
    const [loading, isLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    // const [error, setError] = useState<string>('')

    useEffect(() => {
        if (!token) {
            toast({
                variant: 'destructive',
                title: "Invalid Reset Link",
                description: "The password reset link is invalid or has expired"
            });
            setTimeout(() => {
                navigate('/accounts/forgot-password')
            }, 3000);
            return
        }
    }, [navigate, token])

    const submit = async () => {
        try {
            isLoading(true)
            const userData = {
                token: token,
                newPassword: password,
            }

            /* FETCH */
            // const response = await fetch(`http://localhost:3000/users/reset-password/${token}`, {
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
                `http://localhost:3000/users/reset-password/${token}`,
                userData,
                { headers: { 'Content-Type': 'application/json' } }
            )

            if (response.status === 200) {
                toast({
                    title: "Password successfully reset.",
                })
                isLoading(false)
                navigate('/accounts/profile')

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
                Reset your password
            </div>
            <h2 className="mt-8 text-center text-2xl/9 font-bold tracking-tight dark:text-gray-100 text-gray-900">
                Enter your new password.
            </h2>
          </div>
  
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
            <form 
            onSubmit={(e) => {
                e.preventDefault()
                submit()
            }} 
            className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium dark:text-gray-100 text-gray-900">
                  Password
                </label>
                <div className="mt-2 relative">
                  <input
                    disabled={loading}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="block w-full rounded-md border-0 px-2 py-1.5 dark:text-gray-100 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-100 focus:ring-2 focus:ring-inset focus:ring-sidebar-primary/60 sm:text-sm/6"
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
                  {loading ? <LoaderCircle className="animate-spin text-white" /> : 'Save your password'}
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Not a member?{' '}
              <Link to="/accounts/signup" className="font-semibold text-sidebar-primary/60 hover:text-sidebar-primary/50">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </>
    )
}
  