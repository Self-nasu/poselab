import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
    ApiSignInResponse,
} from '@/@types/auth'
import { mapApiResponseToUser } from '@/utils/authMapper'

export async function apiSignIn(data: SignInCredential) {
    const response = await ApiService.fetchDataWithAxios<ApiSignInResponse>({
        url: endpointConfig.signIn,
        method: 'post',
        data: { login_type_id: 4, payload: data }
    })
    return mapApiResponseToUser(response)
}

export async function apiPhoneSignIn(data: { id_token: string }) {
    const response = await ApiService.fetchDataWithAxios<ApiSignInResponse>({
        url: endpointConfig.signIn,
        method: 'post',
        data: {
            login_type_id: 3,
            payload: data,
        },
    })
    return mapApiResponseToUser(response)
}

export async function apiSignUp(data: SignUpCredential) {
    const response = await ApiService.fetchDataWithAxios<ApiSignInResponse>({
        url: endpointConfig.signUp,
        method: 'post',
        data,
    })
    return mapApiResponseToUser(response)
}

export async function apiSignOut() {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.signOut,
        method: 'post',
    })
}

export async function apiForgotPassword<T>(data: ForgotPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.forgotPassword,
        method: 'post',
        data,
    })
}

export async function apiResetPassword<T>(data: ResetPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.resetPassword,
        method: 'post',
        data,
    })
}
