import { useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
import { PawPrint, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { Step1, Step2, Step3 } from '@/components/signup-steps';
import { formSchema, FormData, FormStep, User } from '@/types/type';
import { toast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { cn, generateId, setCookie } from '@/lib/utils';
import { api, useFetchDetails } from '@/providers/fetch-details';
import { RootState } from '@/redux/store';

type FormSchemaType = z.infer<typeof formSchema>;

const Invite = () => {
  const location = useLocation()
  const isModal = Boolean(location.state?.backgroundLocation)

  if (!isModal) {
    return (
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <InviteComponent />
      </div>
    )
  }

  return <InviteComponent className='w-full max-w-md'/>
};

const InviteComponent = ({ className }: { className?: string }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const token = searchParams.get('token')

  const user = useSelector((state: RootState) => state.user);
  const { clearUserError } = useFetchDetails()
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      preferences: {
        notifications: true,
        emailUpdates: true,
        smsAlerts: false,
      },
    },
  });

  useEffect(() => {
    if (token) {
      console.log('token', token)
    }
  }, [token])

  useEffect(() => {
    if (user.id === id && user.role === 'admin') {
      navigate('/')
    }
  }, [id, navigate, user.id, user.role])

  const handlePreferenceChange = (key: keyof FormSchemaType['preferences']) => {
    setValue(`preferences.${key}`, !watch(`preferences.${key}`), {
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    // e.preventDefault();
    // Handle form submission here
    try {
        delete (data as Partial<FormData>).confirmPassword
        setIsLoading(true)

        const userData: User = {
          id: generateId(),
          username: data.email,
          avatar: '',
          ...data,
          role: 'admin',
          status: 'viewOnly',
          petInteractions: {
            adoptedPets: [],
            fosteredPets: [],
            favoritePets: [],
          },
          verificationStatus: {
            emailVerified: false,
            phoneVerified: false,
            backgroundCheck: false,
            dateVerified: undefined,
          },
          accountDetails: {
            dateCreated: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            loginAttempts: 0,
          },
        }

        /* FETCH */
        // const response = await fetch(import.meta.env.VITE_SERVER_URL+'/users', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(userData)
        // })

        // if (response.status === 200) {
        //     const data = await response.json()
        //     navigate(`/accounts/confirm-email`)
        // }

        /* AXIOS */
        const response = await api.post(
            '/users',
            userData,
            { 
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              } 
            }
        )

        if (response.status === 200) {
          const cookie = setCookie({
            avatar: response.data.newUser?.avatar || '',
            name: response.data.newUser.firstName + ' ' + response.data.newUser.lastName,
            role: response.data.newUser.role,
            username: response.data.newUser.username, 
            token: response.data.token
          });
          if (!cookie) {
            dispatch(setUser(response.data.newUser))
            toast({
                title: "Welcome to Petty Shelter.",
                description: "Thank you for joining our mission at Petty Shelter! We are so excited to have you as part of our community. Before we assign you full access and admin privileges, we need you to confirm your email address."
              })
            setIsLoading(false)
            clearUserError()
            navigate(`/accounts/confirm-email`)
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
        setError('Something went wrong. Please try again later.');
        
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
        setIsLoading(false)
    }
    // console.log('Form submitted:', data);
  };

  const canProceed = (): boolean => {
    if (step === 1) {
      return !errors.firstName && !errors.lastName && !errors.email && 
             !errors.phoneNumber && !errors.password && !errors.confirmPassword;
    }
    if (step === 2) {
      return !errors.address?.street && !errors.address?.city && 
             !errors.address?.state && !errors.address?.zipCode && 
             !errors.address?.country;
    }
    return true;
  };

  const renderCurrentStep = () => {
    const stepProps = {
      register,
      errors,
      watch,
      onPreferenceChange: handlePreferenceChange,
    };

    switch (step) {
      case 1:
        return <Step1 {...stepProps} />;
      case 2:
        return <Step2 {...stepProps} />;
      case 3:
        return <Step3 {...stepProps} />;
      default:
        return null;
    }
  };

  if (id) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <PawPrint className="size-4" />
        </div>
        {(id !== user.id) && (
          <>
            <span className="font-semibold">Please login to accept the role. Click the log in below: </span>
            <Link to={`/accounts/login?redirect=/admin/invite?id=${id}&token=${token}`}>Log in</Link>
            <p>You will be redirected to the invite page after logging in. This is to ensure the security of the platform. You are seeing this message because you are not logged in.</p>
          </>
        )}
        {(id === user.id) && (
          <div className="flex flex-col gap-4">
            <span className="font-semibold">You have been invited to be an admin.</span>
            <Button 
              onClick={async () => {
                setIsLoading(true)
                try {
                  const response = await api.put(
                    `/users/${user.id}`,
                    { role: 'admin' },
                    { headers: { 
                      'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      withCredentials: true 
                    }
                  )
                  if (response.status === 200) {
                    dispatch(setUser({ ...user, role: 'admin' }))
                    toast({
                      title: "Role accepted",
                      description: "You are now an admin. Redirecting...",
                    })
                    setTimeout(() => {
                      navigate('/admin/dashboard')
                    }, 2000)
                  }
                } catch (error) {
                  if (error instanceof AxiosError) {
            
                    const axiosError = error as AxiosError<{error: string, message: string}>
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
                        description: axiosError.response.data.error || axiosError.response.data.message
                    })
                    setIsLoading(false)
                  }
                } finally {
                  setIsLoading(false)
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                'Accept Role'
              )}
            </Button>
          </div>
        )}
      </div>
    )
  }


  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <div className="flex items-center justify-center gap-2 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <PawPrint className="size-4" />
          </div>
          <span className="truncate font-semibold">Petty Store</span>
        </div>
        <CardTitle className="text-center text-2xl font-bold">Admin Invite</CardTitle>
        <CardDescription className="text-center">
          Step {step} of 3: {step === 1 ? 'Personal Information' : step === 2 ? 'Address Details' : 'Communication Preferences'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderCurrentStep()}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error:</strong> {error}
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setStep((prev) => (prev + 1) as FormStep);
                }}
                className="flex items-center ml-auto"
                disabled={!canProceed()}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="ml-auto"
                disabled={isLoading || !isValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default Invite;