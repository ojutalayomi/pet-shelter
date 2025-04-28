import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from "@/providers/fetch-details"
// import { PetProfile } from '../types/type'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Calendar, CircleX, Heart, Medal, Pen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from '@/components/ui/badge'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { deletePet } from '@/redux/petSlice'
import { useToast } from "@/hooks/use-toast"
import { Time } from '@/lib/utils'
  
const timeInstance = new Time();

// interface PetDetailProps {
//     setPetToEdit: Dispatch<React.SetStateAction<PetProfile | null>> 
// }

const PetDetail = () => {
    const { toast } = useToast();
    const dispatch = useDispatch();
    const { petId } = useParams();
    const pets = useSelector((state: RootState) => state.pet.petData.pets);
    const pet = pets.find(pet => pet.id === petId)
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const [more, setMore] = useState<boolean>(true);

    // const getPet = useCallback(async () => {
    //     try {
    //         /* FETCH */
    //         // const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/pets/${petId}`)
    //         // const data = await response.json()
    //         // if (response.status === 200) {
    //         //     setPet(data)
    //         // }

    //         /* AXIOS */
    //         const response = await api.get(`/pets/${petId}`)
    //         if (response.status === 200) {
    //             setPet(response.data)
    //         }

    //     } catch (error) {
    //         console.error('error', error)
    //     }
    // }, [petId])

    // useEffect(() => { getPet() }, [getPet])

    const deletePet_ = async () => {
        try {
            /* FETCH */
            // const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/pets/${petId}`, {
            //     method: 'DELETE'
            // })

            /* AXIOS */
            const response = await api.delete(`/pets/${petId}`)

            if (response.status === 200) {
                if (petId) dispatch(deletePet(petId))
                toast({
                    description: "Pet has been deleted.",
                })
                navigate('/')
            }
        } catch (error) {
            console.error('error', error)
        }
    }

    return (
        <div className="max-w-4xl p-2">
            <Card>
                <CardHeader className="border-b">
                    <div className="flex gap-4 items-center justify-between">
                        <CardTitle className="text-3xl flex-1 font-bold truncate">Pet Shelter</CardTitle>
                        <div className="flex items-center gap-2">
                            {(user.role === 'admin' || user.role === 'volunteer') && (
                                <Button className="flex items-center gap-2" onClick={() => navigate(`/pet/${pet?.id}/edit`)}>
                                    <Pen className="w-4 h-4" />
                                    Edit pet
                                </Button>
                            )}
                            <Button className="flex items-center gap-2" onClick={() => navigate(`/adoption-process/${pet?.id}`)}>
                                <Plus className="w-4 h-4" />
                                Adopt pet
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='pt-6'>
                    <div className="flex items-center justify-center space-y-2">
                        <div className='flex-1'>
                            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                            <p><span className="font-medium">Name:</span> {pet?.name}</p>
                            <p><span className="font-medium">Type:</span> {pet?.type}</p>
                            <p><span className="font-medium">Age:</span> {pet?.age} {pet?.age === 1 ? 'year' : 'years'}</p>
                            <p><span className="font-medium">Breed:</span> {pet?.breed}</p>
                            <p className="cursor-pointer text-sm my-2 text-blue-700 mb-4 truncate" onClick={() => setMore(!more)}>{more ? 'Hide' : 'More'} information...</p>
                        </div>
                        <Avatar className='shadow border rounded-md m-0 p-2 h-1/2 w-1/2'>
                            <AvatarImage className='rounded-md' src={pet?.image} />
                            <AvatarFallback className='aspect-square rounded-md'>{pet?.name ? pet.name.charAt(0).toUpperCase() + pet.name.charAt(1).toUpperCase() : ''}</AvatarFallback>
                        </Avatar>

                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex items-center justify-center space-y-2">
                        <AlertDialog>
                            {(user.role === 'admin' || user.role === 'volunteer') && (
                                <AlertDialogTrigger className="bg-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4 disabled:opacity-50 disabled:pointer-events-none flex focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-medium gap-2 h-9 hover:bg-destructive/90 items-center justify-center px-4 py-2 rounded-md shadow text-primary-foreground text-sm transition-colors whitespace-nowrap">
                                    <CircleX className="w-4 h-4" />
                                    Delete pet
                                </AlertDialogTrigger>
                            )}
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your pet details
                                        and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className='hover:bg-destructive' onClick={() => deletePet_()}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardFooter>
            </Card>

            {more && (
                <>
                    {pet?.status && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>{pet.name}'s Status & Traits</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        {pet.status && (
                                            <Badge variant="outline" 
                                            className={
                                            pet.status === 'available' ? 'bg-green-50 text-green-700' :
                                            pet.status === 'adopted' ? 'bg-blue-50 text-blue-700' :
                                            'bg-orange-50 text-orange-700'
                                            }>
                                                {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {pet.traits?.map((trait, index) => {
                                            const colors = ['text-cyan-600', 'text-indigo-600', 'text-emerald-600', 'text-violet-600', 'text-amber-600', 'text-rose-600', 'text-sky-600'];
                                            const randomColor = colors[index % colors.length];
                                            return (
                                                <Badge key={index} variant="secondary" className={`bg-gray-100 ${randomColor}`}>
                                                    {trait}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    
                    {pet?.medicalHistory && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>{pet.name}'s Medical Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Medal className={`w-4 h-4 ${pet.medicalHistory.vaccinated ? 'text-green-500' : 'text-gray-400'}`} />
                                        <span>Vaccinated</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Heart className={`w-4 h-4 ${pet.medicalHistory.neutered ? 'text-green-500' : 'text-gray-400'}`} />
                                        <span>Neutered/Spayed</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span>Last Checkup: {timeInstance.formatMoment(pet.medicalHistory.lastCheckup)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div> 
    )
}

export default PetDetail