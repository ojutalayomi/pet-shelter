// import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
import { Skeleton } from "@/components/ui/skeleton"
import { Time } from '@/lib/utils'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useFetchDetails } from '@/providers/fetch-details'

const timeInstance = new Time();

function AdoptionApplicationList() {
  const pets = useSelector((state: RootState) => state.pet.petData.pets)
  const { applications } = useSelector((state: RootState) => state.pet.adoptionApplicationList)
  const { isLoading } = useFetchDetails()

  if (isLoading.applications) {
    return (
      <div className="container mx-auto px-2 py-8 h-full">
        <Skeleton className="w-full h-[50px] mb-4" />
        <Skeleton className="w-full h-[50px] mb-4" />
        <Skeleton className="w-full h-[50px] mb-4" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-1 h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>My Adoption Applications</CardTitle>
          <CardDescription>View all your adoption applications and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">You haven't submitted any adoption applications yet.</p>
              <Link to="/pets">
                <Button className="mt-4">Browse Pets</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications?.map((application) => (
                <Card key={application._id}>
                  <CardContent className="flex gap-2 items-center justify-between p-4">
                    <Avatar className='shadow border rounded-md m-0 p-1 h-16 w-16'>
                        <AvatarImage className='rounded-md' src={pets.find(pet => pet.id === application.petId)?.image || ''} />
                        <AvatarFallback className='aspect-square rounded-md'>
                          {(() => {
                            const pet = pets.find(pet => pet.id === application.petId);
                            if (!pet?.name) return '';
                            return pet.name.slice(0,2).toUpperCase();
                          })()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium">Pet: {pets.find(pet => pet.id === application.petId)?.name || 'Unknown'}</h3>
                      <p className="text-sm text-gray-500">
                        Submitted: {timeInstance.formatMoment(application.createdAt)}
                      </p>
                      <p className="text-sm">
                        Status: <span className={`${application.status === 'pending' ? 'text-gray-500' : application.status === 'rejected' ? 'text-red-500' : 'text-green-500'}`}>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                      </p>
                    </div>
                    <Link to={application.status === 'pending' ? `#` : `/adoption-applications/${application.petId}`}>
                      <Button disabled={application.status === 'pending'} variant="outline">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdoptionApplicationList
