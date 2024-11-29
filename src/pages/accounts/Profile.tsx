import { useSelector } from "react-redux"
import { Card, CardContent } from "@/components/ui/card"
import { RootState } from "@/redux/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, Mail, Phone, MapPin, Shield, Calendar } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Time } from '@/lib/utils'

const timeInstance = new Time();

const Profile = () => {
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.user)
    const pets = useSelector((state: RootState) => state.pet.petData.pets)
    
    if (!user.id) {
        return <div>Please login to view your profile</div>
    }

    return (
        <div>
            <Card className="w-full mx-auto rounded-lg">
                <div className="relative">
                    {/* Cover Photo */}
                    <div className="h-48 bg-[url('/paws.jpg')] bg-cover rounded-t-lg">
                        {/* <Button variant="secondary" className="absolute right-4 top-4 gap-2" onClick={() => navigate('/settings/account')}>
                            <Camera className="h-4 w-4" />
                            Edit Cover Photo
                        </Button> */}
                    </div>
                    
                    {/* Profile Picture */}
                    <div className="absolute -bottom-16 left-8">
                        <div className="relative">
                            <Avatar className="h-32 w-32 border-4 border-background">
                                <AvatarImage src={user.avatar} alt={user.firstName} />
                                <AvatarFallback className="text-2xl">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full" onClick={() => navigate('/settings/account')}>
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <CardContent className="mt-20">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold truncate">{user.firstName} {user.lastName}</h1>
                            <span className={`inline-block px-2 mt-1 rounded text-muted-foreground capitalize ${
                                user.status === 'active' ? 'bg-green-100 text-green-800' :
                                user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {user.role}
                            </span>
                        </div>
                        <Button onClick={() => navigate('/settings/account')}>Edit Profile</Button>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {user.email}
                            {user.verificationStatus.emailVerified && 
                                <Shield className="h-4 w-4 text-green-500" />
                            }
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            {user.phoneNumber}
                            {user.verificationStatus.phoneVerified && 
                                <Shield className="h-4 w-4 text-green-500" />
                            }
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {user.address.city}, {user.address.state}, {user.address.country}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Member since {timeInstance.formatMoment(user.accountDetails.dateCreated)}
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-6">
                        <h2 className="text-lg font-semibold mb-4">Pet Interactions</h2>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold">{user.petInteractions.adoptedPets.length}</div>
                                <div className="text-sm text-muted-foreground">Adopted</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{user.petInteractions.fosteredPets.length}</div>
                                <div className="text-sm text-muted-foreground">Fostered</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{user.petInteractions.favoritePets.length}</div>
                                <div className="text-sm text-muted-foreground">Favorites</div>
                            </div>
                        </div>

                        <Tabs defaultValue="adopted" className="mt-6">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="adopted">Adopted</TabsTrigger>
                                <TabsTrigger value="fostered">Fostered</TabsTrigger>
                                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                            </TabsList>

                            <TabsContent value="adopted" className="gap-4 flex flex-wrap justify-start">
                                {user.petInteractions.adoptedPets?.map( petId => {
                                    const pet = pets.find(pet => pet.id === petId)
                                    if (!pet) return null
                                    return (
                                        <Link to={`/pet/${pet.id}`} key={pet.id}>
                                            <Card>
                                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Avatar className="h-32 w-32">
                                                            <AvatarImage src={pet.image} alt={pet.name} className="object-cover" />
                                                            <AvatarFallback>{pet.name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{pet.name}</span>
                                                        <span className="text-sm text-muted-foreground">{pet.breed}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    )
                                })}
                            </TabsContent>

                            <TabsContent value="fostered" className="gap-4 flex flex-wrap justify-start">
                                {user.petInteractions.fosteredPets?.map( petId => {
                                    const pet = pets.find(pet => pet.id === petId)
                                    if (!pet) return null
                                    return (
                                        <Link to={`/pet/${pet.id}`} key={pet.id}>
                                            <Card>
                                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Avatar className="h-32 w-32">
                                                            <AvatarImage src={pet.image} alt={pet.name} className="object-cover" />
                                                            <AvatarFallback>{pet.name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{pet.name}</span>
                                                        <span className="text-sm text-muted-foreground">{pet.breed}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    )
                                })}
                            </TabsContent>

                            <TabsContent value="favorites" className="gap-4 flex flex-wrap justify-start">
                                {user.petInteractions.favoritePets?.map( petId => {
                                    const pet = pets.find(pet => pet.id === petId)
                                    if (!pet) return null
                                    return (
                                        <Link to={`/pet/${pet.id}`} key={pet.id}>
                                            <Card>
                                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Avatar className="h-32 w-32">
                                                            <AvatarImage src={pet.image} alt={pet.name} className="object-cover" />
                                                            <AvatarFallback>{pet.name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{pet.name}</span>
                                                        <span className="text-sm text-muted-foreground">{pet.breed}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    )
                                })}
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Profile
