import { toast } from "@/hooks/use-toast";
import { RootState } from "@/redux/store";
import axios, { AxiosError } from "axios";
import { LoaderCircle, PawPrint } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const user = useSelector((state: RootState) => state.user)
    const [email, setEmail] = useState<string>(user.email || '')
    // const [password, setPassword] = useState<string>('')
    const [loading, isLoading] = useState<boolean>(false)
    // const [error, setError] = useState<string>('')

    const submit = async () => {
        try {
            isLoading(true)
            const userData = {
                email: email,
            }

            /* FETCH */
            // const response = await fetch(import.meta.env.VITE_API_URL+'/users/reset-password', {
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
                import.meta.env.VITE_API_URL+'/users/reset-password',
                userData,
                { headers: { 'Content-Type': 'application/json' } }
            )

            if (response.status === 200) {
                toast({
                    title: "Reset link has been sent.",
                })

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
                Enter your email and we'll send you a code to reset your password.
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
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-sidebar-primary/60 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {loading ? <LoaderCircle className="animate-spin text-white" /> : 'Reset your password'}
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
  