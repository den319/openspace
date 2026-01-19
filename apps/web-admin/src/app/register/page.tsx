import { RegisterForm } from '@openspace/ui/src/components/templates/RegisterForm'
import { AuthLayout } from '@openspace/ui/src/components/molecules/AuthLayout'

export default function Page() {
  return (
    <AuthLayout title={'Register'}>
      <RegisterForm />
    </AuthLayout>
  )
}
