import { toast } from "@/hooks/use-toast";
import { logoutUser } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/userSlice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function LogOut() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.user)
    const calledRef = useRef(false)

    useEffect(() => {
        const handleLogout = async () => {
            try {
                if (!user.username) {
                    toast({
                        variant: 'destructive',
                        title: "Oops!",
                        description: "No user found"
                    })
                    navigate('/accounts/login')
                    return
                }

                const response = await logoutUser(user.username)
                console.log(response)
                if (response.status) {
                    dispatch(setUser({
                        id: "",
                        avatar: "",
                        firstName: "",
                        lastName: "",
                        username: "",
                        email: "",
                        phoneNumber: "",
                        password: "",
                        address: {
                            street: "",
                            city: "",
                            state: "",
                            zipCode: "",
                            country: ""
                        },
                        role: "user",
                        status: "active",
                        preferences: {
                            notifications: false,
                            emailUpdates: false,
                            smsAlerts: false
                        },
                        petInteractions: {
                            adoptedPets: [],
                            fosteredPets: [],
                            favoritePets: []
                        },
                        verificationStatus: {
                            emailVerified: false,
                            phoneVerified: false,
                            backgroundCheck: false,
                            dateVerified: undefined
                        },
                        accountDetails: {
                            dateCreated: "",
                            lastLogin: "",
                            lastUpdated: "",
                            loginAttempts: 0
                        }
                    }))
                    toast({
                        title: response.message
                    })
                } else {
                    toast({
                        variant: 'destructive',
                        title: "Oops!",
                        description: response.message
                    })
                }
                if (response.otherUsers) {
                    navigate('/accounts/switch-user')
                } else {
                    navigate('/accounts/login')
                }
            } catch (error) {
                console.error('Logout error:', error)
                toast({
                    variant: 'destructive',
                    title: "Oops!",
                    description: "An error occurred during logout"
                })
            }
        }

        if (!calledRef.current) {
            handleLogout()
            calledRef.current = true
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
        </div>
    )
}
