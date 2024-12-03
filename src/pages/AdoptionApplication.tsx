import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import axios, { AxiosError } from 'axios'
import { useToast } from '@/hooks/use-toast'
import { addAdoptionApplication } from '@/redux/petSlice'

function AdoptionApplication() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { petId } = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const pet = useSelector((state: RootState) => 
    state.pet.petData.pets.find(p => p.id === petId)
  )
  const user = useSelector((state: RootState) => state.user)
  const [formData, setFormData] = useState({
    petId: petId,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    housing: '',
    ownRent: '',
    landlordContact: '',
    occupation: '',
    otherPets: '',
    veterinarian: '',
    experience: '',
    reason: '',
    commitment: '',
    emergencyContact: '',
    references: ''
  })

  useEffect(() => {
    if (user.id) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phoneNumber,
        address: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zip: user.address?.zipCode || ''
      }))
    } else {
      navigate('/accounts/login')
    }
  }, [navigate, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    try {
        /* FETCH */
        // const response = await fetch(`${import.meta.env.VITE_API_URL}/pets/adoption-application`)
        // const data = await response.json()
        // if (response.status === 200) {
        //     setPet(data)
        // }

        /* AXIOS */
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/pets/adoption-application`, 
          formData, {
            withCredentials: true
          })
        if (response.status === 200) {
          dispatch(addAdoptionApplication(response.data))
          navigate('/adoption-applications')
          toast({
            title: "Success!",
            description: "Your application has been submitted. We will review your application and get back to you soon."
          })
        }

    } catch (error) {
        console.error('error', error)
        const axiosError = error as AxiosError<{error: string, message: string}>
          if (!axiosError.response?.data) {
            toast({
              variant: 'destructive', 
              title: "Oops!",
              description: "An error occurred"
            })
            return
          }

          toast({
            variant: 'destructive',
            title: "Oops!", 
            description: axiosError.response.data.error || axiosError.response.data.message.includes('Not logged in') ? 'You must be logged in to apply for adoption.' : 'Please try again later.'
          })
          setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string }}) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="container">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Adoption Application for <em>{pet?.name}</em></CardTitle>
          <CardDescription>Please fill out the following information to apply for adoption. To change any of your personal information, please go to your {' '}
            <Link className="underline" to="/settings/account">profile page</Link>.
        </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  disabled
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  disabled
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  disabled
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  disabled
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                disabled
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  disabled
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  disabled
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  disabled
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Housing Type</Label>
              <RadioGroup disabled={isLoading} value={formData.housing} onValueChange={(value) => handleChange({ target: { name: 'housing', value } })} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="house" id="house" />
                  <Label htmlFor="house">House</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="apartment" id="apartment" />
                  <Label htmlFor="apartment">Apartment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Do you own or rent?</Label>
              <RadioGroup disabled={isLoading} value={formData.ownRent} onValueChange={(value) => handleChange({ target: { name: 'ownRent', value } })} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="own" id="own" />
                  <Label htmlFor="own">Own</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rent" id="rent" />
                  <Label htmlFor="rent">Rent</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="landlordContact">If renting, landlord contact information</Label>
              <Input
                disabled={isLoading || formData.ownRent === 'own'}
                id="landlordContact"
                name="landlordContact"
                value={formData.landlordContact}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                disabled={isLoading}
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherPets">Do you have other pets? Please describe:</Label>
              <Textarea
                disabled={isLoading}
                id="otherPets"
                name="otherPets"
                value={formData.otherPets}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="veterinarian">Current/Previous Veterinarian Contact</Label>
              <Input
                disabled={isLoading}
                id="veterinarian"
                name="veterinarian"
                value={formData.veterinarian}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Previous Pet Experience</Label>
              <Textarea
                disabled={isLoading}
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Why do you want to adopt this pet?</Label>
              <Textarea
                disabled={isLoading}
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commitment">How will you commit to this pet's care?</Label>
              <Textarea
                disabled={isLoading}
                id="commitment"
                name="commitment"
                value={formData.commitment}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact Information</Label>
              <Input
                disabled={isLoading}
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="references">References (Please provide at least two)</Label>
              <Textarea
                disabled={isLoading}
                id="references"
                name="references"
                value={formData.references}
                onChange={handleChange}
                placeholder="Please provide name, relationship, and contact information for at least two people who can vouch for your ability to care for a pet. Example: Jane Doe, friend, 555-555-5555"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => navigate(-1)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit">{isLoading ? 'Submitting...' : 'Submit Application'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdoptionApplication
