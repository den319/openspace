'use client'
import { SearchPage } from '@openspace/ui/src/components/templates/SearchPage'
import { FormProviderSearchGarage } from '@openspace/forms/src/searchGarages'

export default function Page() {
  return (
    <FormProviderSearchGarage>
      <SearchPage />
    </FormProviderSearchGarage>
  )
}
