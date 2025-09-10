const ACCESS_TOKEN_KEY = 'optimeal_access_token';
const REFRESH_TOKEN_KEY = 'optimeal_refresh_token';
const ID_TOKEN_KEY = 'optimeal_id_token';

export interface TokenData {
    accessToken: string;
    refreshToken: string;
    idToken: string;
    email: string;
    expiresIn: number;
}

export const tokenStorage = {
    setTokens(tokenData: TokenData): void {
        try {
            localStorage.setItem(ACCESS_TOKEN_KEY, tokenData.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refreshToken);
            localStorage.setItem(ID_TOKEN_KEY, tokenData.idToken);
            localStorage.setItem('optimeal_user_email', tokenData.email);
            // Store the expiration timestamp (current time + expiresIn seconds)
            const expirationTimestamp = Math.floor(Date.now() / 1000) + tokenData.expiresIn;
            localStorage.setItem('optimeal_token_expires', expirationTimestamp.toString());
        } catch (error) {
            console.error('Error storing tokens:', error);
        }
    },

    getAccessToken(): string | null {
        try {
            return localStorage.getItem(ACCESS_TOKEN_KEY);
        } catch (error) {
            console.error('Error retrieving access token:', error);
            return null;
        }
    },

    getRefreshToken(): string | null {
        try {
            return localStorage.getItem(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error('Error retrieving refresh token:', error);
            return null;
        }
    },

    getIdToken(): string | null {
        try {
            return localStorage.getItem(ID_TOKEN_KEY);
        } catch (error) {
            console.error('Error retrieving ID token:', error);
            return null;
        }
    },

    getUserEmail(): string | null {
        try {
            return localStorage.getItem('optimeal_user_email');
        } catch (error) {
            console.error('Error retrieving user email:', error);
            return null;
        }
    },

    getTokenExpiration(): number | null {
        try {
            const expiresIn = localStorage.getItem('optimeal_token_expires');
            return expiresIn ? parseInt(expiresIn, 10) : null;
        } catch (error) {
            console.error('Error retrieving token expiration:', error);
            return null;
        }
    },

    clearTokens(): void {
        try {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(ID_TOKEN_KEY);
            localStorage.removeItem('optimeal_user_email');
            localStorage.removeItem('optimeal_token_expires');
        } catch (error) {
            console.error('Error clearing tokens:', error);
        }
    },

    isTokenExpired(): boolean {
        const expirationTimestamp = this.getTokenExpiration();
        if (!expirationTimestamp) return true;

        // Check if token expires in the next 5 minutes
        const now = Math.floor(Date.now() / 1000);
        return now >= (expirationTimestamp - 300);
    },

    hasValidTokens(): boolean {
        const accessToken = this.getAccessToken();
        const refreshToken = this.getRefreshToken();
        const isExpired = this.isTokenExpired();

        return !!(accessToken && refreshToken && !isExpired);
    }
};