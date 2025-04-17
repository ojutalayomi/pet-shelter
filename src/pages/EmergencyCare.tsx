import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PetProfile } from "@/types/type"
import { CommandDialogHome } from "@/components/command-dialog-home"
import { api } from "@/providers/fetch-details"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

interface EmergencyDetails {
  petData: PetProfile
  ownerName: string
  ownerId: string
  phone: string
  description: string
}

const EmergencyCare = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const user = useSelector((state: RootState) => state.user)
  const searchRef = useRef<HTMLButtonElement | null>(null)
  const [emergencyDetails, setEmergencyDetails] = useState<EmergencyDetails>({
    petData: {} as PetProfile,
    ownerName: "",
    ownerId: "",
    phone: "",
    description: ""
  })

  useEffect(() => {
    setEmergencyDetails(prev => ({
      ...prev,
      ownerName: `${user.firstName} ${user.lastName}`
    }))
  }, [user])

  const handleChange = (field: keyof EmergencyDetails) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if(field === "petData") {
      setEmergencyDetails(prev => ({
        ...prev,
        petData: {
          ...prev.petData,
          name: e.target.value
        }
      }))
    } else {
      setEmergencyDetails(prev => ({
        ...prev,
        [field]: e.target.value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log(emergencyDetails)
      
      const response = await api.post('/pets/emergency-care', { ...emergencyDetails })
      if(response.status === 200) {
        toast({
          title: "Emergency Request Sent",
          description: "We have received your emergency request and will contact you immediately.",
        })

        setEmergencyDetails({
          petData: {} as PetProfile,
          ownerName: "",
          ownerId: "",
          phone: "",
          description: ""
        })
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to send emergency request. Please call our emergency hotline.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const fillData = (pet: PetProfile) => {
    setEmergencyDetails(prev => ({
      ...prev,
      petData: pet
    }))
  }

  return (
    <div className="h-full p-1 space-y-8">
      <Card className="border-destructive h-full">
        <CardHeader>
          <CardTitle className="text-destructive">Emergency Care Request</CardTitle>
          <p className="text-sm text-muted-foreground">
            For immediate assistance, please call our 24/7 Emergency Hotline: <span className="font-semibold">1-800-PET-HELP</span>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-2 flex justify-center">
              <CommandDialogHome ref={searchRef} onSelect={fillData} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <div className="space-y-2">
                <Label htmlFor="petName">Pet's Name</Label>
                <Input
                  id="petName"
                  required
                  value={emergencyDetails.petData.name}
                  onChange={handleChange("petData")}
                  onClick={() => {
                    if (searchRef.current) {
                      searchRef.current.focus()
                      searchRef.current.click()
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName">Your Name</Label>
                <Input
                  id="ownerName"
                  required
                  value={emergencyDetails.ownerName}
                  onChange={handleChange("ownerName")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={emergencyDetails.phone}
                onChange={handleChange("phone")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Emergency Description</Label>
              <Textarea
                id="description"
                required
                value={emergencyDetails.description}
                onChange={handleChange("description")}
                placeholder="Please describe the emergency situation..."
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" variant="destructive" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Request...
                </>
              ) : (
                "Send Emergency Request"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center items-center">
          <Link to="/emergency-care/requests">
            <Button variant="link" className="w-full">
              View Emergency Care Requests
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default EmergencyCare
