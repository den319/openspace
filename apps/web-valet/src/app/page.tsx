'use client'
import { IsLoggedIn } from '@openspace/ui/src/components/organisms/IsLoggedIn'
import { IsValet } from '@openspace/ui/src/components/organisms/IsValet'
import { ValetHome } from '@openspace/ui/src/components/templates/ValetHome'

export default function Home() {
  return (
    <main>
      <IsLoggedIn>
        {(uid) => (
          <IsValet uid={uid}>
            <ValetHome />
          </IsValet>
        )}
      </IsLoggedIn>
    </main>
  )
}
