import type { ApiSignInResponse, ApiSignUpResponse, User } from '@/@types/auth'

export const mapApiResponseToUser = (data: ApiSignInResponse | ApiSignUpResponse): { token: string; user: User } => {
    // Check if Token exists (it's in ApiSignInResponse but not in ApiSignUpResponse)
    const token = 'Token' in data ? data.Token : ''

    // Safety check if User object is missing
    if (!data || !data.User) {
        console.error('API Response missing User object:', data)
        return {
            token: token,
            user: {
                userId: '',
                userName: 'Unknown',
                email: '',
                avatar: '',
                authority: ['USER'],
            }
        }
    }

    // Normalize User object access if necessary, but structure is similar enough for mapped fields
    // except phone which might be missing in signup response (but we default it anyway)
    const userData = data.User as any;

    return {
        token: token,
        user: {
            userId: data.User.uid || '',
            userName: data.User.email || (userData.phone ? userData.phone : 'User'),
            email: data.User.email || '',
            avatar: '', // Setup default avatar or map if available
            authority: ['USER'], // Default authority
        },
    }
}
