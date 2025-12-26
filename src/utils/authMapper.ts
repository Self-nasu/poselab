import type { ApiSignInResponse, User } from '@/@types/auth'

export const mapApiResponseToUser = (data: ApiSignInResponse): { token: string; user: User } => {
    return {
        token: data.Token,
        user: {
            userId: data.User.uid || '',
            userName: data.User.email || data.User.phone || 'User',
            email: data.User.email || '',
            avatar: '', // Setup default avatar or map if available
            authority: ['USER'], // Default authority
        },
    }
}
