'use client'
import { Tab, Tabs, TabPanel } from '../molecules/Tabs'
import { useState } from 'react'
import { ShowCustomerBookings } from '../organisms/ShowCustomerBookings'
import { BookingStatus } from '@openspace/network/src/gql/generated'

export const ListCustomerBookings = () => {
  const [value, setValue] = useState<0 | 1>(1)
  return (
    <div className="px-2">
      <Tabs
        value={value}
        onChange={(e, v) => setValue(v)}
        aria-label="bookings"
      >
        <Tab label={'PAST'} />
        <Tab label={'ON GOING'} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ShowCustomerBookings
          statuses={[BookingStatus.CheckedOut, BookingStatus.ValetReturned]}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ShowCustomerBookings
          statuses={[
            BookingStatus.Booked,
            BookingStatus.ValetPickedUp,
            BookingStatus.ValetAssignedForCheckIn,
            BookingStatus.CheckedIn,
            BookingStatus.ValetAssignedForCheckOut,
          ]}
        />
      </TabPanel>
    </div>
  )
}
