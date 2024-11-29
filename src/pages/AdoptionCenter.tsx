import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { updateDisplay } from "@/redux/settingsSlice"
import { Link } from "react-router-dom"

const AdoptionCenter = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(updateDisplay({ displayPetBanner: false }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container mx-auto px-6 py-3">
      <h1 className="text-3xl font-bold mb-4">Adoption Center</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Available Pets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">View all pets currently available for adoption</p>
            <Link to='/pet-management/available-pets'>
              <Button className="w-full">Browse Pets</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adoption Process</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Learn about our adoption requirements and process</p>
            <Link to='/adoption-process'>
              <Button variant="outline" className="w-full">Learn More</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adoption Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">View all adoption applications</p>
            <Link to='/adoption-applications'>
              <Button variant="outline" className="w-full">View Applications</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule a Visit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Meet our pets in person before making a decision</p>
            <Link to='/schedule-visit'>
              <Button variant="outline" className="w-full">Book Visit</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdoptionCenter
