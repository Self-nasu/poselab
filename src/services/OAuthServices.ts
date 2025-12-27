import { signInWithGoogle, signInWithGithub, sendPhoneOTP, verifyPhoneOTP, getRedirectresult, getIdToken } from './FirebaseAuthService'

import type { SignInResponse, OAuthResponse, ApiSignInResponse } from '@/@types/auth'
import type { ConfirmationResult } from 'firebase/auth'
import { mapApiResponseToUser } from '@/utils/authMapper'

import ApiService from './ApiService'  // Add this import
import endpointConfig from '@/configs/endpoint.config'


export async function initiateGoogleSignIn(): Promise<any> {
    return signInWithGoogle()
}

export async function initiateGithubSignIn(): Promise<any> {
    return signInWithGithub()
}

export async function apiSendPhoneOTP(phoneNumber: string): Promise<ConfirmationResult> {
    return sendPhoneOTP(phoneNumber)
}

export async function apiGoogleOauthSignIn(): Promise<SignInResponse> {
    const userCredential = await signInWithGoogle()
    const idToken = await getIdToken(userCredential)
    const response = await ApiService.fetchDataWithAxios<ApiSignInResponse>({
        method: 'post',
        url: endpointConfig.googleSignIn,
        data: { login_type_id: 1, payload: { id_token: idToken } }
    })
    return mapApiResponseToUser(response)
}

export async function apiGithubOauthSignIn(): Promise<SignInResponse> {
    const userCredential = await signInWithGithub()
    const idToken = await getIdToken(userCredential)
    const response = await ApiService.fetchDataWithAxios<ApiSignInResponse>({
        method: 'post',
        url: endpointConfig.githubSignIn,
        data: { login_type_id: 2, payload: { id_token: idToken } }
    })
    return mapApiResponseToUser(response)
}

export async function apiVerifyPhoneOTP(confirmationResult: ConfirmationResult, otp: string): Promise<SignInResponse> {
    const userCredential = await verifyPhoneOTP(confirmationResult, otp)
    const idToken = await getIdToken(userCredential)
    const response = await ApiService.fetchDataWithAxios<ApiSignInResponse>({
        method: 'post',
        url: '/auth',
        data: { login_type_id: 3, payload: { id_token: idToken } }
    })
    return mapApiResponseToUser(response)
}