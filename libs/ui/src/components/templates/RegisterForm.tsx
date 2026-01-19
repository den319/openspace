'use client'
import { Role } from '@openspace/util/types'
import { useFormRegister } from '@openspace/forms/src/register'
import { ApolloError, useMutation } from '@apollo/client'
import { RegisterWithCredentialsDocument } from '@openspace/network/src/gql/generated'
import { Form } from '../atoms/Form'
import { signIn } from 'next-auth/react'
import { HtmlLabel } from '../atoms/HtmlLabel'
import { HtmlInput } from '../atoms/HtmlInput'
import { Button } from '../atoms/Button'
import Link from 'next/link'
import { toast, useToast } from 'react-toastify'

export interface ISignupFormProps {
  className?: string
  role?: Role
}
export const RegisterForm = ({ className, role }: ISignupFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormRegister()

  const [registerWithCredentials, { loading, data }] = useMutation(
    RegisterWithCredentialsDocument,
  )

  return (
    <Form
      onSubmit={handleSubmit(async (formData) => {
        try {
          const { data } = await registerWithCredentials({
            variables: {
              registerWithCredentialsInput: formData,
            },
          })

          console.log({ data })

          toast.success(`User ${data?.registerWithCredentials?.uid} created 🎉`)

          await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            redirect: true,
            callbackUrl: '/',
          })
        } catch (err) {
          const apolloError = err as ApolloError

          toast.error(
            apolloError.graphQLErrors?.[0]?.message ??
              apolloError.message ??
              'Something went wrong',
          )
        }
      })}
    >
      <HtmlLabel title="Email" error={errors.email?.message}>
        <HtmlInput
          className="text-black"
          placeholder="Enter the email."
          {...register('email')}
        />
      </HtmlLabel>
      <HtmlLabel title="Password" error={errors.password?.message}>
        <HtmlInput
          className="text-black"
          type="password"
          placeholder="······"
          {...register('password')}
        />
      </HtmlLabel>
      <HtmlLabel title="Display name" error={errors.name?.message}>
        <HtmlInput
          className="text-black"
          placeholder="Enter your name."
          {...register('name')}
        />
      </HtmlLabel>
      {Object.keys(errors).length ? (
        <div className="text-xs text-red-600">
          Please fix the above {Object.keys(errors).length} errors
        </div>
      ) : null}
      <Button type="submit" fullWidth loading={loading}>
        Register
      </Button>
      <div className="mt-4 text-sm ">
        Already have an openspace account?
        <br />
        <Link href="/login" className="font-bold underline underline-offset-4">
          Login
        </Link>{' '}
        now.
      </div>
    </Form>
  )
}
