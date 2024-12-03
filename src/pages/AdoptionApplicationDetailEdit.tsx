import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InboxIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { AdoptionApplicationDetailsForAdmin } from '@/types/type';
import { toast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { updateAdoptionApplication } from '@/redux/petSlice';

const AdoptionApplicationDetailEdit = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { petId } = useParams();
    const { applications } = useSelector((state: RootState) => state.pet.adoptionApplicationList);
    const { pets } = useSelector((state: RootState) => state.pet.petData);
    const pet = pets.find(pet => pet.id === petId);
    const [application, setApplication] = useState<AdoptionApplicationDetailsForAdmin | undefined>(
        applications.find(app => app.petId === petId)
    );
    const [formData, setFormData] = useState<AdoptionApplicationDetailsForAdmin | undefined>(application);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const foundApplication = applications.find(app => app.petId === petId);
        setApplication(foundApplication);
        setFormData(foundApplication);
    }, [applications, petId]);

    if (!application?.petId) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <InboxIcon className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">Application not found</p>
            </div>
        );
    }

    if (application?.status === 'approved' || application?.status === 'rejected') {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <InboxIcon className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">This application has already been reviewed.</p>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
        const { name, value } = e.target;
        setFormData(prev => {
        if (!prev) return prev;
        return {
            ...prev,
            [name]: value
        };
        });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const newFormData = {...formData}
            delete newFormData._id;
            const updatedAt = new Date().toISOString();
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/pets/adoption-application/${application._id}`, {
                ...newFormData,
                updatedAt
            }, {
                withCredentials: true
            });
            if(response.status === 200) {
                dispatch(updateAdoptionApplication({
                    id: application._id,
                    updates: { ...newFormData, updatedAt },
                    partial: true
                }));
                navigate(`/adoption-applications/${petId}`);
                toast({
                    title: 'Application updated successfully',
                    description: 'The application status has been updated.',
                });
            }
        } catch (error) {
        console.error(error);
        const axiosError = error as AxiosError<{error: string}>
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
            description: axiosError.response.data.error
        })
        } finally {
        setIsLoading(false);
        }
    };    

    if (!formData) return null;

    return (
        <div className="container">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Edit Adoption Application for <em>{pet?.name}</em></CardTitle>
                    <CardDescription>Please fill out the following information to apply for adoption.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }} 
                        className="space-y-6"
                    >

                        {formData.notes && (
                            <Card className="shadow-amber-500">
                                <CardHeader>
                                <CardTitle>Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {formData.notes}
                                </p>
                                </CardContent>
                            </Card>
                        )}

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
    );
};

export default AdoptionApplicationDetailEdit;
