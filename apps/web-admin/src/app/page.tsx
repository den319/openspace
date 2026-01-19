import { IsAdmin } from '@openspace/ui/src/components/organisms/IsAdmin'
import { AdminHome } from '@openspace/ui/src/components/templates/AdminHome'

export default function Home() {
  return (
    <main>
      <IsAdmin>
        <AdminHome />
      </IsAdmin>
    </main>
  )
}
