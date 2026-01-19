import { ListCustomerBookings } from '@openspace/ui/src/components/templates/ListCustomerBookings'
import { IsLoggedIn } from '@openspace/ui/src/components/organisms/IsLoggedIn'

export default function Page() {
  return (
    <IsLoggedIn>
      <ListCustomerBookings />
    </IsLoggedIn>
  )
}
