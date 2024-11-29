import React, { Dispatch, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { PetStatus } from '../types/type'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckedState } from '@radix-ui/react-checkbox'
// import { format } from "date-fns"
// import { cn } from "@/lib/utils"
// import { Calendar } from "@/components/ui/calendar"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import { CalendarIcon } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { RootState } from '@/redux/store'
import { updatePet } from '@/redux/petSlice'
import { useToast } from '@/hooks/use-toast'

// interface EditPetProps {
//     petToEdit: PetProfile | null
// }

const EditPet: React.FC = () => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { petId } = useParams();
    const pets = useSelector((state: RootState) => state.pet.petData.pets);
    const petToEdit = pets.find(pet => pet.id === petId);
    const navigate = useNavigate();

    const [petName, setPetName] = useState<string>('')
    const [petType, setPetType] = useState<string>('')
    const [petAge, setPetAge] = useState<number>(0)
    const [petBreed, setPetBreed] = useState<string>('')
     
    const [petImage, setPetImage] = useState<string>('')
    const [petStatus, setPetStatus] = useState<PetStatus>('')
    const [traits, setTraits] = useState<string>()
    const [isVaccinated, setPetVaccinated] = useState<boolean>(false)
    const [isNeutered, setPetNeutered] = useState<boolean>(false)
    const [lastCheckup, setLastCheckup] = useState<string>('')

    useEffect(() => {
        if (!petToEdit) return;
        setPetName(petToEdit.name)
        setPetType(petToEdit.type)
        setPetAge(petToEdit.age)
        setPetBreed(petToEdit.breed)
        setPetImage(petToEdit.image)
        setPetStatus(petToEdit.status || '')
        setPetVaccinated(petToEdit.medicalHistory.vaccinated)
        setPetNeutered(petToEdit.medicalHistory.neutered)
        setLastCheckup(petToEdit?.medicalHistory?.lastCheckup)
        const traits = petToEdit.traits?.join(', ') || '.';
        setTraits(traits)
    }, [petToEdit])

    const handleCheckedChange = (checked: CheckedState, func: Dispatch<React.SetStateAction<boolean>>) => {
        if (checked  === true) {
          func(true);
        } else if (checked === false) {
          func(false);
        }
        // Handle "indeterminate" state if needed
    };

    const editPet = async () => {
        try {
            if(!petToEdit) return;

            const petData = {
                id: petToEdit.id,
                name: petName,
                type: petType,
                age: petAge,
                breed: petBreed,
                image: petImage,
                status: petStatus,
                traits: traits?.split(','),
                medicalHistory: {
                  vaccinated: isVaccinated,
                  neutered: isNeutered,
                  lastCheckup: lastCheckup,
                }
            }

            /* FETCH */
            // const response = await fetch(`http://localhost:3000/pets/${petToEdit.id}`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(petData)
            // })

            /* AXIOS */
            const response = await axios.put(
                `http://localhost:3000/pets/${petToEdit.id}`,
                petData,
                { headers: { 'Content-Type': 'application/json' } }
            )

            if (response.status === 200 && petId) {
                dispatch(updatePet({ id: petId, updates: petData, partial: false }))
                toast({
                    title: petName +  "'s details was updated succesfully.",
                })
                navigate(`/pet/${petToEdit.id}`)
            }
        } catch (error) {
            console.error('error', error)
        }
    }

    return (
        <div className='max-w-4xl mx-auto p-6'>
            <Card>
                <CardHeader>
                    <CardTitle>Edit Pet</CardTitle>
                    <CardDescription>Save your changes in one-click.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Pet name</Label>
                                <Input id="name" placeholder="" value={petName} onChange={e => setPetName(e.target.value)} />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Pet type</Label>
                                <Input id="name" placeholder="" value={petType} onChange={e => setPetType(e.target.value)} />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Pet age</Label>
                                <Input id="name" placeholder="" value={petAge} onChange={e => setPetAge(Number(e.target.value))} />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Pet breed</Label>
                                <Input id="name" placeholder="" value={petBreed} onChange={e => setPetBreed(e.target.value)} />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Pet status</Label>
                                <Select value={petStatus} onValueChange={(value) => setPetStatus(value as PetStatus)}>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="Select the pet status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="adopted">Adopted</SelectItem>
                                            <SelectItem value="fostered">Fostered</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Last Checkup</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "justify-start text-left font-normal",
                                            !lastCheckup && "text-muted-foreground"
                                        )}
                                        >
                                        <CalendarIcon />
                                        {lastCheckup ? format(lastCheckup, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                        mode="single"
                                        selected={lastCheckup}
                                        onSelect={setLastCheckup}
                                        initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div> */}
                            <div className="flex items-center gap-2 space-y-1.5">
                                <Label htmlFor="name">Vaccinated?</Label>
                                <Checkbox className='!m-0' id="vaccinated" checked={isVaccinated} onCheckedChange={checked => handleCheckedChange(checked,setPetVaccinated)} />
                            </div>
                            <div className="flex items-center gap-2 space-y-1.5">
                                <Label htmlFor="name">Neutered?</Label>
                                <Checkbox className='!m-0' id="neutered" checked={isNeutered} onCheckedChange={checked => handleCheckedChange(checked,setPetNeutered)} />
                            </div>
                            <div className="flex flex-col items-start gap-2 space-y-1.5">
                                <Label htmlFor="name">Traits</Label>
                                <Textarea
                                onChange={e => setTraits(e.target.value)}
                                placeholder="Please share some traits of your pet, separating each trait with a comma (,)."
                                className="resize-none"
                                value={traits}
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                    <Button onClick={() => editPet()}>Save changes</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default EditPet