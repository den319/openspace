import { ManageValets } from '@openspace/ui/src/components/templates/ManageValets'
import { IsLoggedIn } from '@openspace/ui/src/components/organisms/IsLoggedIn'

export default function Page() {
  return (
    <IsLoggedIn>
      <ManageValets />
    </IsLoggedIn>
  )
}
