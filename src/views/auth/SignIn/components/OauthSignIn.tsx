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

    const handlePhoneSignIn = () => {
        setShowPhoneForm(true)
        setPhoneStep('phone')
        setPhoneNumber('')
        setOtp('')
        setConfirmationResult(null)
        setOtpSentMessage('')
    }

    const handleSendOTP = async () => {
        if (!phoneNumber) return
        try {
            const result = await apiSendPhoneOTP(`+91${phoneNumber}`)
            setConfirmationResult(result)
            setPhoneStep('otp')
            setOtpSentMessage('OTP sent successfully.')
        } catch (error) {
            setMessage?.((error as string)?.toString() || '')
        }
    }

    const handleVerifyOTP = async () => {
        if (!confirmationResult || !otp) return
        if (!disableSubmit) {
            oAuthSignIn(async ({ redirect, onSignIn }) => {
                try {
                    const resp = await apiVerifyPhoneOTP(confirmationResult, otp)
                    if (resp) {
                        const { token, user } = resp
                        onSignIn({ accessToken: token }, user)
                        redirect()
                        setShowPhoneForm(false)
                    }
                } catch (error) {
                    setMessage?.((error as string)?.toString() || '')
                }
            })
        }
    }

    const handleCancel = () => {
        setShowPhoneForm(false)
        setPhoneStep('phone')
        setPhoneNumber('')
        setOtp('')
        setConfirmationResult(null)
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
                <Button
                    className="flex-1 bg-white text-black shadow-none hover:shadow-sm transition-all border border-gray-300 hover:bg-white hover:text-black"
                    type="button"
                    onClick={handlePhoneSignIn}
                >
                    <div className="flex items-center justify-center gap-2">
                        <span>📱 Phone</span>
                    </div>
                </Button>
            </div>

            {showPhoneForm && (
                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">
                        {phoneStep === 'phone' ? 'Enter Phone Number' : 'Enter OTP'}
                    </h3>
                    {phoneStep === 'phone' ? (
                        <div className="space-y-4">
                            <div className="flex items-center">
                                 <span className="mr-2 text-gray-700">+91</span>
                                <Input
                                    type="tel"
                                    placeholder="Enter phone number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="flex-1"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleSendOTP} disabled={!phoneNumber} className="flex-1">
                                    Send OTP
                                </Button>
                                <Button variant="outline" onClick={handleCancel} className="flex-1">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {otpSentMessage && <p className="text-green-600 mb-2">{otpSentMessage}</p>}
                            <Input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <Button onClick={handleVerifyOTP} disabled={!otp} className="flex-1">
                                    Verify OTP
                                </Button>
                                <Button variant="outline" onClick={handleCancel} className="flex-1">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default OauthSignIn