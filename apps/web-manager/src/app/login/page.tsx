import { LoginForm } from '@openspace/ui/src/components/templates/LoginForm'
import { AuthLayout } from '@openspace/ui/src/components/molecules/AuthLayout'

export default function Page() {
  return (
    <AuthLayout title={'Login'}>
      <LoginForm />
    </AuthLayout>
  )
}
