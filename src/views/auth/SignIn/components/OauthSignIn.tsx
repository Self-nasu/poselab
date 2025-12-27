import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/auth'
import {
    apiGoogleOauthSignIn,
    apiGithubOauthSignIn,
    apiSendPhoneOTP,
    apiVerifyPhoneOTP
} from '@/services/OAuthServices'
import type { ConfirmationResult } from 'firebase/auth'

type OauthSignInProps = {
    setMessage?: (message: string) => void
    disableSubmit?: boolean
}

const OauthSignIn = ({ setMessage, disableSubmit }: OauthSignInProps) => {
    const { oAuthSignIn } = useAuth()
    const [showPhoneForm, setShowPhoneForm] = useState(false)
    const [phoneStep, setPhoneStep] = useState<'phone' | 'otp'>('phone')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [otp, setOtp] = useState('')
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
    const [otpSentMessage, setOtpSentMessage] = useState('')


    const handleGoogleSignIn = async () => {
        if (!disableSubmit) {
            oAuthSignIn(async ({ redirect, onSignIn }) => {
                try {
                    const resp = await apiGoogleOauthSignIn()
                    if (resp) {
                        const { token, user } = resp
                        onSignIn({ accessToken: token }, user)
                        redirect()
                    }
                } catch (error) {
                    setMessage?.((error as string)?.toString() || '')
                }
            })
        }
    }

    const handleGithubSignIn = async () => {
        if (!disableSubmit) {
            oAuthSignIn(async ({ redirect, onSignIn }) => {
                try {
                    const resp = await apiGithubOauthSignIn()
                    if (resp) {
                        const { token, user } = resp
                        onSignIn({ accessToken: token }, user)
                        redirect()
                    }
                } catch (error) {
                    setMessage?.((error as string)?.toString() || '')
                }
            })
        }
    }



    return (
        <div>
            <div className="flex items-center gap-2">
                <Button
                    className="flex-1 bg-white text-black border shadow-none hover:shadow-sm transition-all border-gray-300 hover:bg-white hover:text-black"
                    type="button"
                    onClick={handleGoogleSignIn}
                >
                    <div className="flex items-center justify-center gap-2">
                        <img
                            className="h-[25px] w-[25px]"
                            src="/img/others/google.png"
                            alt="Google sign in"
                        />
                        <span>Google</span>
                    </div>
                </Button>
                <Button
                    className="flex-1 bg-white text-black shadow-none hover:shadow-sm transition-all border border-gray-300 hover:bg-white hover:text-black"
                    type="button"
                    onClick={handleGithubSignIn}
                >
                    <div className="flex items-center justify-center gap-2">
                        <img
                            className="h-[25px] w-[25px]"
                            src="/img/others/github.png"
                            alt="GitHub sign in"
                        />
                        <span>GitHub</span>
                    </div>
                </Button>
            </div>
        </div>
    )
}

export default OauthSignIn