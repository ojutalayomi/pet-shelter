import { Dispatch, useState } from 'react'
import { api } from "@/providers/fetch-details"
import { useNavigate } from 'react-router-dom'
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
import { useToast } from "@/hooks/use-toast"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PetStatus } from '@/types/type'
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
import { useDispatch } from 'react-redux'
import { addPet } from '@/redux/petSlice'
import { generateId } from '@/lib/utils'


const AddPet: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { toast } = useToast();
    const router = {
        push: (path: string) => {
            navigate(path);
        },
        reload: () => window.location.reload()
        
    }

    const [petName, setPetName] = useState<string>('')
    const [petType, setPetType] = useState<string>('')
    const [petAge, setPetAge] = useState<number>(0)
    const [petBreed, setPetBreed] = useState<string>('')
     
    const [petStatus, setPetStatus] = useState<PetStatus>('')
    const [traits, setTraits] = useState<string>()
    const [isVaccinated, setPetVaccinated] = useState<boolean>(false)
    const [isNeutered, setPetNeutered] = useState<boolean>(false)
    // const [lastCheckup, setLastCheckup] = useState<Date>()

    // useEffect(() => {
    //     console.log(petStatus)
    // }, [petStatus])

    const handleCheckedChange = (checked: CheckedState, func: Dispatch<React.SetStateAction<boolean>>) => {
        if (checked  === true) {
          func(true);
        } else if (checked === false) {
          func(false);
        }
        // Handle "indeterminate" state if needed
    };

    const addPet_ = async () => {
        try {
            const petData = {
                id: generateId(),
                name: petName,
                type: petType,
                age: petAge,
                breed: petBreed,
                image: '',
                status: petStatus,
                traits: traits?.split(',') || [],
                medicalHistory: {
                  vaccinated: isVaccinated,
                  neutered: isNeutered,
                  lastCheckup: new Date().toISOString(),
                },
                notes: ''
            }

            /* FETCH */
            // const response = await fetch(import.meta.env.VITE_SERVER_URL+'/pets/', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(petData)
            // })

            // if (response.status === 200) {
            //     const data = await response.json()
            //     navigate(`/pet/${data.id}`)
            // }

            /* AXIOS */
            const response = await api.post(
                '/pets/',
                petData,
                { headers: { 'Content-Type': 'application/json' } }
            )

            if (response.status === 200) {
                dispatch(addPet(petData))
                toast({
                    title: petName + " was added succesfully.",
                })
                router.push(`/pet/${response.data.id}`)

            }

        } catch (error) {
            console.error('error', error)
        }
    }

    return (
        <div className='p-2'>
            <Card>
                <CardHeader>
                    <CardTitle>Add Pet</CardTitle>
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
                                placeholder="Tell us a little bit about yourself. Separate each trait with a comma(,)."
                                className="resize-none"
                                value={traits}
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={() => navigate(`/`)} variant="outline">Cancel</Button>
                    <Button onClick={() => addPet_()}>Submit</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default AddPet