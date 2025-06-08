// app/utils/env.ts (Optional - untuk validasi environment variables)
const requiredFirebaseEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
];

export const validateFirebaseEnv = () => {
    const missing = requiredFirebaseEnvVars.filter(key => !import.meta.env[key]);

    if (missing.length > 0) {
        console.warn(`Missing Firebase environment variables: ${missing.join(', ')}`);
        return false;
    }

    return true;
};

export const getFirebaseConfig = () => {
    if (!validateFirebaseEnv()) {
        throw new Error('Firebase configuration is incomplete');
    }

    return {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    };
};