import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BadgeAlert, BadgeCheck, BadgeHelp, InboxIcon } from 'lucide-react';
import { Time } from '@/lib/utils';

const timeInstance = new Time();

const Applications = () => {
  const { applications, pagination } = useSelector((state: RootState) => state.pet.adoptionApplicationListForAdmin);
  const pets = useSelector((state: RootState) => state.pet.petData.pets);
  const [page, setPage] = useState(pagination.currentPage);
  const itemsPerPage = pagination.itemsPerPage;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Adoption Applications</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <InboxIcon className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No applications to display</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {applications
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((application) => (
                    <div 
                      key={application._id} 
                      className="flex flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
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
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex flex-col items-center gap-2">
                                {
                                  application.status === 'rejected' ? <BadgeAlert className="h-6 w-6 text-red-500"/> :
                                  application.status === 'approved' ? <BadgeCheck className="h-6 w-6 text-green-500"/> :
                                  <BadgeHelp className="h-6 w-6 text-yellow-500"/>
                                }
                                <span className="text-xs font-medium capitalize">
                                  {application.status}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Application {application.status}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium">Pet Details</p>
                          <p className="text-sm text-muted-foreground">
                            {(() => {
                              const pet = pets.find(pet => pet.id === application.petId);
                              if (pet) {
                                return (
                                  <div className="space-y-1">
                                    <div className="flex flex-col gap-2">
                                      <span>Name: {pet.name} <b className="text-xs text-muted-foreground">({application.petId})</b></span>
                                      <span>Type: {pet.type}</span>
                                      <span>Breed: {pet.breed}</span>
                                      <span>Age: {pet.age} year(s) old</span>
                                    </div>
                                  </div>
                                );
                              }
                              return <span>Pet ID: {application.petId}</span>;
                            })()}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium">Contact Details</p>
                          <p className="text-sm text-muted-foreground">
                            Email: {application.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Phone: {application.phone}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Address: {application.address}, {application.city}, {application.state} {application.zip}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Emergency Contact: {application.emergencyContact}
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
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement review functionality
                          }}
                        >
                          Review Application
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {Math.ceil(applications.length / itemsPerPage)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      className={page === 1 ? 'cursor-not-allowed opacity-50' : ''}
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      className={page >= Math.ceil(applications.length / itemsPerPage) ? 'cursor-not-allowed opacity-50' : ''}
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page >= Math.ceil(applications.length / itemsPerPage)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Applications;
