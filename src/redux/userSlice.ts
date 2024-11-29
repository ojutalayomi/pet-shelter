import { User } from '@/types/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: User = {
    id: '',
    avatar: '',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    },
    role: 'user',
    status: 'inactive',
    preferences: {
        notifications: false,
        emailUpdates: false,
        smsAlerts: false,
    },
    petInteractions: {
        adoptedPets: [],
        fosteredPets: [],
        favoritePets: [],
    },
    verificationStatus: {
        emailVerified: false,
        phoneVerified: false,
        backgroundCheck: false,
    },
    accountDetails: {
        dateCreated: '',
        lastLogin: '',
        lastUpdated: '',
        loginAttempts: 0,
    },
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (_state, action: PayloadAction<User>) => {
            return { ...action.payload };
        },
        updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
            return { ...state, ...action.payload };
        },
        updatePreferences: (state, action: PayloadAction<Partial<User['preferences']>>) => {
            state.preferences = { ...state.preferences, ...action.payload };
        },
        updatePetInteractions: (state, action: PayloadAction<Partial<User['petInteractions']>>) => {
            state.petInteractions = { ...state.petInteractions, ...action.payload };
        },
        addFavoritePet: (state, action: PayloadAction<string>) => {
            state.petInteractions.favoritePets.push(action.payload);
        },
        removeFavoritePet: (state, action: PayloadAction<string>) => {
            state.petInteractions.favoritePets = state.petInteractions.favoritePets.filter(pet => pet !== action.payload);
        },
        updateVerificationStatus: (state, action: PayloadAction<Partial<User['verificationStatus']>>) => {
            state.verificationStatus = { ...state.verificationStatus, ...action.payload };
        },
        updateAccountDetails: (state, action: PayloadAction<Partial<User['accountDetails']>>) => {
            state.accountDetails = { ...state.accountDetails, ...action.payload };
        },
        clearUser: () => initialState,
    },
});

export const {
    setUser,
    updateUserProfile,
    updatePreferences,
    updatePetInteractions,
    updateVerificationStatus,
    updateAccountDetails,
    clearUser,
    addFavoritePet,
    removeFavoritePet,
} = userSlice.actions;

export default userSlice.reducer;
