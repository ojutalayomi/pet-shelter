import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PetProfile } from "@/types/type"
import { CommandDialogHome } from "@/components/command-dialog-home"

interface EmergencyDetails {
  petName: string
  petData: object
  ownerName: string
  phone: string
  description: string
}

const EmergencyCare = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [emergencyDetails, setEmergencyDetails] = useState<EmergencyDetails>({
    petName: "",
    petData: {},
    ownerName: "",
    phone: "",
    description: ""
  })

  const handleChange = (field: keyof EmergencyDetails) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmergencyDetails(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Emergency Request Sent",
        description: "We have received your emergency request and will contact you immediately.",
      })

      setEmergencyDetails({
        petName: "",
        petData: {},
        ownerName: "",
        phone: "",
        description: ""
      })
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
      petData: pet,
      petName: pet.name
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Emergency Care Request</CardTitle>
          <p className="text-sm text-muted-foreground">
            For immediate assistance, please call our 24/7 Emergency Hotline: <span className="font-semibold">1-800-PET-HELP</span>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-2 flex justify-center">
              <CommandDialogHome onSelect={fillData} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <div className="space-y-2">
                <Label htmlFor="petName">Pet's Name</Label>
                <Input
                  id="petName"
                  required
                  value={emergencyDetails.petName}
                  onChange={handleChange("petName")}
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
      </Card>
    </div>
  )
}

export default EmergencyCare
