import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface ShelterInfo {
  name: string
  address: string
  phone: string
  email: string
  description: string
  website: string
}

const ShelterInfoSettings = () => {
  const [shelterInfo, setShelterInfo] = useState<ShelterInfo>({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    website: ""
  })

  const handleChange = (field: keyof ShelterInfo) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setShelterInfo(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving shelter info:", shelterInfo)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Shelter Information</CardTitle>
          <p className="text-sm text-gray-500">
            Manage your shelter's basic information and contact details
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Shelter Name</Label>
                <Input
                  id="name"
                  value={shelterInfo.name}
                  onChange={handleChange("name")}
                  placeholder="Enter shelter name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={shelterInfo.address}
                  onChange={handleChange("address")}
                  placeholder="Enter shelter address"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shelterInfo.phone}
                    onChange={handleChange("phone")}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shelterInfo.email}
                    onChange={handleChange("email")}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={shelterInfo.website}
                  onChange={handleChange("website")}
                  placeholder="Enter website URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={shelterInfo.description}
                  onChange={handleChange("description")}
                  placeholder="Enter shelter description"
                  rows={4}
                />
              </div>
            </div>

            <Separator className="my-4" />
            
            <div className="flex justify-end">
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ShelterInfoSettings