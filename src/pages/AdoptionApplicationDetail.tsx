import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BadgeAlert, BadgeCheck, BadgeHelp, InboxIcon, PencilIcon } from 'lucide-react';
import { Time } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const timeInstance = new Time();

const AdoptionApplicationDetail = () => {
  const navigate = useNavigate();
  const { petId } = useParams();
  const { applications } = useSelector((state: RootState) => state.pet.adoptionApplicationList);
  const pets = useSelector((state: RootState) => state.pet.petData.pets);
  const [application, setApplication] = useState(applications.find(app => app.petId === petId));

  useEffect(() => {
    setApplication(applications.find(app => app.petId === petId));
  }, [applications, petId]);

  if (!application?.petId) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <InboxIcon className="h-12 w-12 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">Application not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar className="border p-2 rounded-full">
                <AvatarFallback>
                  {application.firstName[0]}{application.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">
                  {application.firstName} {application.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {application.email}
                </p>
              </div>
              {(application.status !== 'approved' && application.status !== 'rejected') && (
                <Button variant='outline' onClick={() => navigate(`/adoption-applications/${petId}/edit`)}>Edit <PencilIcon className="h-4 w-4" /></Button>
              )}
              <div className="flex items-center gap-2">
                {
                  application.status === 'rejected' ? <BadgeAlert className="h-6 w-6 text-red-500"/> :
                  application.status === 'approved' ? <BadgeCheck className="h-6 w-6 text-green-500"/> :
                  <BadgeHelp className="h-6 w-6 text-yellow-500"/>
                }
                <span className="text-xs font-medium capitalize">
                  {application.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Pet Details</p>
                <div className="text-sm text-muted-foreground">
                  {(() => {
                    const pet = pets.find(pet => pet.id === application.petId);
                    if (pet) {
                      return (
                        <div className="flex flex-col gap-1">
                          <span>Name: {pet.name}</span>
                          <span>Type: {pet.type}</span>
                          <span>Breed: {pet.breed}</span>
                          <span>Age: {pet.age} year(s) old</span>
                        </div>
                      );
                    }
                    return <p>Pet not found</p>;
                  })()}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Contact Information</p>
                <p className="text-sm text-muted-foreground">
                  Phone: {application.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  Address: {application.address}
                </p>
                <p className="text-sm text-muted-foreground">
                  City: {application.city}
                </p>
                <p className="text-sm text-muted-foreground">
                  State: {application.state}
                </p>
                <p className="text-sm text-muted-foreground">
                  ZIP: {application.zip}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Housing Information</p>
                <p className="text-sm text-muted-foreground">
                  Housing Type: {application.housing}
                </p>
                <p className="text-sm text-muted-foreground">
                  Own/Rent: {application.ownRent}
                </p>
                {application.landlordContact && (
                  <p className="text-sm text-muted-foreground">
                    Landlord Contact: {application.landlordContact}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium">Pet Experience</p>
                <p className="text-sm text-muted-foreground">
                  Occupation: {application.occupation}
                </p>
                <p className="text-sm text-muted-foreground">
                  Other Pets: {application.otherPets}
                </p>
                <p className="text-sm text-muted-foreground">
                  Veterinarian: {application.veterinarian}
                </p>
                <p className="text-sm text-muted-foreground">
                  Experience: {application.experience}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Application Details</p>
                <p className="text-sm text-muted-foreground">
                  Submitted: {timeInstance.formatMoment(application.createdAt)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Last Updated: {timeInstance.formatMoment(application.updatedAt)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Commitment: {application.commitment}
                </p>
                <p className="text-sm text-muted-foreground">
                  References: {application.references}
                </p>
              </div>

              {application.reason && (
                <div>
                  <p className="text-sm font-medium">Adoption Reason</p>
                  <p className="text-sm text-muted-foreground">
                    {application.reason}
                  </p>
                </div>
              )}

              {application.notes && (
                <div>
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {application.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdoptionApplicationDetail;
