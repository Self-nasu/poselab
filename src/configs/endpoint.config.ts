export const apiPrefix = '/api'

const endpointConfig = {
    signIn: '/auth',
    signOut: '/sign-out',
    signUp: '/sign-up',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    googleSignIn: '/auth',  // Add this for Google OAuth
    githubSignIn: '/auth',  // Add this for GitHub OAuth
}

export default endpointConfig
