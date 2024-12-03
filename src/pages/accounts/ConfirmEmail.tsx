import { toast } from "@/hooks/use-toast";
import { updateAccountDetails, updateVerificationStatus } from "@/redux/userSlice";
import axios, { AxiosError } from "axios";
import { LoaderCircle, PawPrint } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { ToastAction } from "@/components/ui/toast";
import { RootState } from '@/redux/store'

export default function ConfirmEmail() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const redirect = searchParams.get('redirect')
    const [value, setValue] = useState<string>('')
    const [reset, setReset] = useState<boolean>(false)
    const [loading, isLoading] = useState<boolean>(false)
    const [getCode, setGetCode] = useState<boolean>(false)
    const email = useSelector((state: RootState) => state.user.email);
    const countRef = useRef<number>(0)

    useEffect(() => {
        if(!reset) navigate(``)
    }, [navigate, reset])

    const showError = (error: unknown) => {
        const axiosError = error as AxiosError<{error: string}>
        if (!axiosError.response?.data) {
            toast({
                variant: 'destructive', 
                title: "Oops!",
                description: "An error occurred",
                action: (
                    <ToastAction altText="Try to connect to the server again." onClick={() => setGetCode(true)}>Get Code</ToastAction>
                )
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

    const fetchEmailConfirmationCode = useCallback(async () => {
        try {
            const response = await axios.post(
                import.meta.env.VITE_API_URL+'/users/confirm-email',
                { code: true, email: email },
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (response.status === 200) {
                toast({
                    title: "Code has been sent",
                    description: "A code has been sent to your email. Kindly check for it."
                })
            }
        } catch (error) {
            console.error('Error confirming email:', error);
            showError(error)
        }
    }, [email]);

    useEffect(() => {
        if (email) {
            if (countRef.current === 0) {
                fetchEmailConfirmationCode()
                countRef.current = 1
            }
        };
    }, [email, fetchEmailConfirmationCode])

    useEffect(() => {
        if(getCode) fetchEmailConfirmationCode()
        setGetCode(false)
    }, [getCode, fetchEmailConfirmationCode])

    const submit = async () => {
        try {
            isLoading(true)
            const userData = {
                otp: value,
                email: email,
            }

            /* FETCH */
            // const response = await fetch(import.meta.env.VITE_API_URL+'/users/confirm-email', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(userData)
            // })

            // if (response.status === 200) {
            //     const data = await response.json()
            //     navigate(`/settings`)
            // }

            /* AXIOS */
            const response = await axios.post(
                import.meta.env.VITE_API_URL+'/users/confirm-email',
                userData,
                { headers: { 'Content-Type': 'application/json' } }
            )

            if (response.status === 200) {
                dispatch(updateVerificationStatus({ emailVerified: response.data[0] }))
                dispatch(updateVerificationStatus({ dateVerified: response.data[1] }))
                dispatch(updateAccountDetails({ lastUpdated: response.data[1] }))
                toast({
                    title: "Great news! Your email address has been successfully verified",
                })
                isLoading(false)
                setReset(true)
                navigate(redirect ? redirect : `/settings`)

            }

        } catch (error: unknown) {
            console.error('error', error)
            showError(error)
            
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
                Verify your email
            </div>
            <h2 className="mt-8 text-center text-2xl/9 font-bold tracking-tight dark:text-gray-100 text-gray-900">
                Enter the code.
            </h2>
          </div>
  
          <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
            <form 
            onSubmit={(e) => {
                e.preventDefault()
                submit()
            }} 
            className="space-y-6">
                <InputOTP 
                maxLength={6} 
                value={value}
                onChange={(value) => setValue(value)}
                disabled={loading}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP> 
              
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-sidebar-primary/60 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {loading ? <LoaderCircle className="animate-spin text-white" /> : 'Verify'}
                </button>

                <div className="text-center">
                  <span className="text-sm text-gray-500">Didn't receive the code? </span>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (email) {
                        countRef.current = 0
                        fetchEmailConfirmationCode()
                      }
                    }}
                    className="text-sm font-semibold text-sidebar-primary/60 hover:text-sidebar-primary/50"
                  >
                    Resend code
                  </a>
                </div>
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
  