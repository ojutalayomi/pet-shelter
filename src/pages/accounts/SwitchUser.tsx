import { useLocation, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { toast } from "@/hooks/use-toast"
import { switchUser, UserList } from "@/lib/utils"
import { useFetchDetails } from "@/providers/fetch-details"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
  

export default function SwitchUser() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as { backgroundLocation?: Location }
    const backgroundLocation = state?.backgroundLocation
    
    const isDirectAccess = (path: string) => {
      return location.pathname === path && !backgroundLocation
    }
    
    const { refetchPets, refetchUser, refetchApplications } = useFetchDetails()
    const users = JSON.parse(localStorage.getItem('users_list') || '[]') as UserList[]

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
                if(isDirectAccess('/accounts/switch-user')) {
                    navigate(-1)
                } else {
                    navigate('/')
                }
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

    return (
        <div className="flex items-center justify-center h-full">
            {users.length > 0 ? (
                <div className="w-full max-w-md space-y-4 p-6">
                    {/* <h2 className="text-2xl font-bold text-center">Switch User</h2> */}
                    <div className="space-y-2">
                        {users.map(user => {
                            const isCurrentSession = Cookies.get('pt_session') === user.token
                            return (
                                <Card
                                    key={user.username}
                                    className={`w-full hover:bg-muted transition-colors cursor-pointer ${isCurrentSession ? 'bg-muted opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => {
                                        if (Cookies.get('pt_session') !== user.token) {
                                            handleSwitchUser(user.username)
                                        }
                                    }}
                                >
                                    <CardContent className="flex items-center gap-2 p-4">
                                        <Avatar>
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-medium leading-none">{user.name}</p>
                                            <p className="text-sm text-muted-foreground mt-1">@{user.username}</p>
                                        </div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    {isCurrentSession ? <Check className="animate-ping h-4 w-4 text-muted-foreground" /> : <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{isCurrentSession ? 'Current User' : 'Switch User'}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </CardContent>
                                </Card>
                            )
                        })}
                        <div className="flex justify-center">
                            <Button onClick={() => navigate('/accounts/login')}>Add User</Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-2 items-center">
                    <div className="text-center">
                        <p>No other users available</p>
                    </div>
                    <Button onClick={() => navigate('/accounts/login')}>Add User</Button>
            </div>
            )}
        </div>
    )
}
