import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import classNames from '@/utils/classNames'
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { ReactNode } from 'react'
import { PiPlaceholder } from 'react-icons/pi'
import { sendPhoneOTP, verifyPhoneOTP, getIdToken } from '@/services/FirebaseAuthService'
import { apiPhoneSignIn } from '@/services/AuthService'
import type { ConfirmationResult } from 'firebase/auth'

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    passwordHint?: string | ReactNode
    setMessage?: (message: string) => void
}

type SignInFormSchema = {
    email: string
    password: string
}

const validationSchema: ZodType<SignInFormSchema> = z.object({
    email: z
        .string({ required_error: 'Please enter your email' })
        .min(1, { message: 'Please enter your email' }),
    password: z
        .string({ required_error: 'Please enter your password' })
        .min(1, { message: 'Please enter your password' }),
})

const SignInForm = (props: SignInFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [otp, setOtp] = useState('')
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
    const [phoneError, setPhoneError] = useState('')

    const { disableSubmit = false, className, setMessage, passwordHint } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignInFormSchema>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(validationSchema),
    })

    const { signIn, oAuthSignIn } = useAuth()

    const onSignIn = async (values: SignInFormSchema) => {
        const { email, password } = values

        if (!disableSubmit) {
            setSubmitting(true)

            const result = await signIn({ email, password })

            if (result?.status === 'failed') {
                setMessage?.('invalid credentials')
            }
        }

        setSubmitting(false)
    }

    const onSendOtp = async () => {
        if (!phoneNumber) {
            setPhoneError('Please enter a phone number')
            return
        }
        setPhoneError('')
        setSubmitting(true)
        try {
            // Append +91 if not present
            const formattedPhoneNumber = phoneNumber.startsWith('+91')
                ? phoneNumber
                : `+91${phoneNumber}`

            const result = await sendPhoneOTP(formattedPhoneNumber)
            setConfirmationResult(result)
            setMessage?.('OTP Sent!')
        } catch (error: any) {
            console.error('Error sending OTP:', error)
            setPhoneError(error.message || 'Failed to send OTP')
        } finally {
            setSubmitting(false)
        }
    }

    const onVerifyOtp = async () => {
        if (!otp || !confirmationResult) return
        setSubmitting(true)
        try {
            const userCredential = await verifyPhoneOTP(confirmationResult, otp)
            const idToken = await getIdToken(userCredential)

            // Call API with ID Token
            const response = await apiPhoneSignIn({ id_token: idToken })

            if (response) {
                const { token, user } = response
                oAuthSignIn(({ onSignIn, redirect }) => {
                    onSignIn({ accessToken: token }, user)
                    redirect()
                })
            }
        } catch (error: any) {
            console.error('Error verifying OTP:', error)
            setPhoneError(error.message || 'Failed to verify OTP')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <div className="flex w-full border-b border-gray-200 mb-6">
                <button
                    className={`flex-1 pb-2 text-sm font-medium ${authMethod === 'email' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setAuthMethod('email')}
                >
                    Email
                </button>
                <button
                    className={`flex-1 pb-2 text-sm font-medium ${authMethod === 'phone' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setAuthMethod('phone')}
                >
                    Phone
                </button>
            </div>

            <div className="mt-4">
                {authMethod === 'email' ? (
                    <Form onSubmit={handleSubmit(onSignIn)}>
                        <FormItem
                            label="Email"
                            invalid={Boolean(errors.email)}
                            errorMessage={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        autoComplete="off"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Password"
                            invalid={Boolean(errors.password)}
                            errorMessage={errors.password?.message}
                            className={classNames(
                                passwordHint ? 'mb-0' : '',
                                errors.password?.message ? 'mb-8' : '',
                            )}
                        >
                            <Controller
                                name="password"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <PasswordInput
                                        placeholder="Password"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        {passwordHint}
                        <Button
                            variant="default"
                            type="submit"
                            className='w-full'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </Form>
                ) : (
                    <div>
                        {!confirmationResult ? (
                            <div className="flex flex-col gap-4">
                                <FormItem label="Phone Number" invalid={!!phoneError} errorMessage={phoneError}>
                                    <Input
                                        placeholder="Enter phone number (e.g. 9876543210)"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </FormItem>
                                <div id="recaptcha-container"></div>
                                <Button className="w-full" onClick={onSendOtp} disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Send OTP'}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <FormItem label="Enter OTP">
                                    <Input
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </FormItem>
                                <Button className="w-full" onClick={onVerifyOtp} disabled={isSubmitting}>
                                    {isSubmitting ? 'Verifying...' : 'Verify OTP & Sign In'}
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full" onClick={() => setConfirmationResult(null)}>
                                    Change Phone Number
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SignInForm
