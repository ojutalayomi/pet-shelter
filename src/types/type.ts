import * as z from 'zod';

export interface AdoptionApplication {
  _id: string
  petId: string
  status: string
  createdAt: string
  petName: string
}

export interface AdoptionApplicationDetailsForAdmin {
  _id: string;
  userId: string;
  petId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  housing: string;
  ownRent: string;
  landlordContact: string;
  occupation: string;
  otherPets: string;
  veterinarian: string;
  experience: string;
  reason: string;
  commitment: string;
  emergencyContact: string;
  references: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface PetProfile_ { 
    id: string; 
    name: string; 
    type: string; 
    age: number; 
    breed: string 
}

export type PetStatus = 'available' | 'adopted' | 'fostered' | ''

export interface PetProfile {
    id: string; 
    name: string;
    type: string;
    age: number;
    breed: string;
    image: string;
    status: PetStatus;
    traits: string[];
    medicalHistory: {
      vaccinated: boolean;
      neutered: boolean;
      lastCheckup: string;
    };
}

export interface User {
  id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  role: 'admin' | 'user' | 'volunteer';
  status: 'active' | 'inactive' | 'suspended' | 'viewOnly';
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    smsAlerts: boolean;
  };
  petInteractions: {
    adoptedPets: string[]; // Array of pet IDs
    fosteredPets: string[]; // Array of pet IDs
    favoritePets: string[]; // Array of pet IDs
  };
  verificationStatus: {
    emailVerified: boolean;
    phoneVerified: boolean;
    backgroundCheck: boolean;
    dateVerified?: string;
  };
  accountDetails: {
    dateCreated: string;
    lastLogin: string;
    lastUpdated: string;
    loginAttempts: number;
  };
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Preferences {
    notifications: boolean;
    emailUpdates: boolean;
    smsAlerts: boolean;
}

export interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    address: Address;
    preferences: Preferences;
}


export const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  address: z.object({
    street: z.string().min(5, 'Street address must be at least 5 characters'),
    city: z.string().min(3, 'City must be at least 3 characters'),
    state: z.string().min(2, 'State must be at least 2 characters'),
    zipCode: z.string().regex(/^\d{6}$/, 'ZIP code must be exactly 6 digits'),
    country: z.string().min(3, 'Country must be at least 3 characters'),
  }),
  preferences: z.object({
    notifications: z.boolean(),
    emailUpdates: z.boolean(),
    smsAlerts: z.boolean(),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type FormSchemaType = z.infer<typeof formSchema>;
export type FormStep = 1 | 2 | 3;