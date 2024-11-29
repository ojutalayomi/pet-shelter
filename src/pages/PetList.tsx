import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'
import { PetProfile, PetStatus } from '@/types/type'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight, Plus, Star } from 'lucide-react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { addFavoritePet, removeFavoritePet } from '@/redux/userSlice'

function PetList({ filter }: { filter?: PetStatus }) {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);
    const allPets = useSelector((state: RootState) => state.pet.petData.pets);
    const pets = allPets?.filter(pet => {
        if(filter){
            return pet.status === filter
        } else {
            return true
        }
    })
    const [selectedPet, setSelectedPet] = useState<PetProfile | null>(null);

    // const getPets = async () => {
    //     try {
    //         /* FETCH */
    //         // const response = await fetch('http://localhost:3000/pets')
    //         // const data = await response.json()
    //         // if (response.status === 200) setPets(data)

    //         /* AXIOS */
    //         const response = await axios.get('http://localhost:3000/pets')
    //         if (response.status === 200) setPets(response.data)

    //     } catch (error) {
    //         console.error('error', error)
    //     }
    // }

    // useEffect(() => { getPets() }, [])

    return (
        <div className="w-full mx-auto p-2">
            <Card>
                <CardHeader className="border-b px-6 py-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="sticky py-1 top-0 text-3xl font-bold">{filter ? filter.charAt(0).toUpperCase() + filter.slice(1) + ' Pets' : 'Pets'}</CardTitle>
                        {user.role === 'admin' && (
                            <Button className="flex items-center gap-2" onClick={() => navigate(`/admin/pets/add`)}>
                                <Plus className="w-4 h-4" />
                                Add new pet
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="h-full overflow-y-auto p-0">
                    <div className="space-y-4">
                        <div className="divide-y">
                            {pets.map((pet, index) => (
                            <div
                                key={pet.id + index}
                                className="py-4 px-6 dark:hover:bg-neutral-400 group transition-colors cursor-pointer"
                                onClick={() => {
                                    if(pet.id === selectedPet?.id){
                                        setSelectedPet(null)
                                    } else {
                                        setSelectedPet(pet)
                                    }
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2 items-center">
                                        <Avatar className='shadow border rounded-md m-0 p-1'>
                                            <AvatarImage className='rounded-md' src={pet?.image} />
                                            <AvatarFallback className='aspect-square rounded-md'>{pet?.name ? pet.name.charAt(0).toUpperCase() + pet.name.charAt(1).toUpperCase() : ''}</AvatarFallback>
                                        </Avatar>
                                        <div className="">
                                            <div className="flex items-center gap-1">
                                                <h3 className="text-lg font-medium truncate">{pet.name}</h3>
                                                <Star 
                                                    className={`w-4 h-4 ${user.petInteractions.favoritePets.includes(pet.id) ? 'text-yellow-500' : 'text-gray-400 group-hover:text-gray-800'}`} 
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        if(user.petInteractions.favoritePets.includes(pet.id)){
                                                            dispatch(removeFavoritePet(pet.id))
                                                        } else {
                                                            dispatch(addFavoritePet(pet.id))
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <p className="group-hover:text-gray-800 text-sm text-gray-500 capitalize">
                                            {pet.type} - {pet.breed}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        {user.role === 'user' && (
                                            <Button className="flex items-center gap-1 py-0.5 text-xs h-7" onClick={() => navigate(`/adoption-process/${pet.id}`)}>
                                                <Plus className="w-2 h-2" />
                                                Adopt
                                            </Button>
                                        )}
                                        <Link to={`/pet/${pet.id}`}>
                                            <span className="group-hover:text-gray-800 text-sm truncate">Pet detail</span>
                                        </Link>
                                        <ChevronRight className="group-hover:text-gray-800 w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                            ))}
                            {pets.length === 0 && (
                                <div className="py-4 px-6">
                                    <p className="text-gray-400">No pets found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
    
            {selectedPet && (
                <Card className="mt-6">
                    <CardHeader>
                    <CardTitle>Pet Details - {selectedPet.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-2">
                        <p><span className="font-medium">Name:</span> {selectedPet.name}</p>
                        <p><span className="font-medium">Type:</span> {selectedPet.type}</p>
                        <p><span className="font-medium">Breed:</span> {selectedPet.breed}</p>
                    </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default PetList