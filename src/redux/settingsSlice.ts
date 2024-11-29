import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Settings {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    display: {
        compactMode: boolean;
        fontSize: 'small' | 'medium' | 'large';
        highContrast: boolean;
        displayPetBanner: boolean;
    };
    privacy: {
        profileVisibility: 'public' | 'private' | 'contacts';
        activityStatus: boolean;
    };
}

const initialState: Settings = {
    theme: 'system',
    language: 'en',
    notifications: {
        email: true,
        push: true,
        sms: false,
    },
    display: {
        compactMode: false,
        fontSize: 'medium',
        highContrast: false,
        displayPetBanner: true,
    },
    privacy: {
        profileVisibility: 'public',
        activityStatus: true,
    },
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Settings['theme']>) => {
            state.theme = action.payload;
        },
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },
        updateNotifications: (state, action: PayloadAction<Partial<Settings['notifications']>>) => {
            state.notifications = { ...state.notifications, ...action.payload };
        },
        updateDisplay: (state, action: PayloadAction<Partial<Settings['display']>>) => {
            state.display = { ...state.display, ...action.payload };
        },
        updatePrivacy: (state, action: PayloadAction<Partial<Settings['privacy']>>) => {
            state.privacy = { ...state.privacy, ...action.payload };
        },
        resetSettings: () => initialState,
    },
});

export const {
    setTheme,
    setLanguage,
    updateNotifications,
    updateDisplay,
    updatePrivacy,
    resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
