import { FieldTypeConfig } from '../utils/query-builder.utils'

export type Role = 'admin' | 'manager' | 'valet'

export type GetUserType = {
  uid: string
  roles: Role[]
}

export const REST_USER_FIELD_TYPES: FieldTypeConfig = {
  uid: 'string',
  name: 'string',
  createdAt: 'date',
  updatedAt: 'date',
}

export const REST_ADDRESS_FIELD_TYPES: FieldTypeConfig = {
  id: 'number',
  address: 'string',
  lat: 'number',
  lng: 'number',
  garageId: 'number',
  createdAt: 'date',
  updatedAt: 'date',
}

export const REST_ADMIN_FIELD_TYPES: FieldTypeConfig = {
  uid: 'string',
  createdAt: 'date',
  updatedAt: 'date',
}

export const REST_BOOKING_FIELD_TYPES: FieldTypeConfig = {
  id: 'number',
  pricePerHour: 'number',
  totalPrice: 'number',
  startTime: 'date',
  endTime: 'date',
  vehicleNumber: 'string',
  phoneNumber: 'string',
  passcode: 'string',
  status: 'string',
  slotId: 'number',
  customerId: 'string',
  createdAt: 'date',
  updatedAt: 'date',
}

export const REST_BOOKING_TIMELINE_FIELD_TYPES: FieldTypeConfig = {
  id: 'number',
  timestamp: 'date',
  status: 'string',
  bookingId: 'number',
  valetId: 'string',
  managerId: 'string',
}

export const REST_COMPANY_FIELD_TYPES: FieldTypeConfig = {
  id: 'number',
  displayName: 'string',
  description: 'string',
  createdAt: 'date',
  updatedAt: 'date',
}

export const REST_CUSTOMER_FIELD_TYPES: FieldTypeConfig = {
  uid: 'string',
  displayName: 'string',
  createdAt: 'date',
  updatedAt: 'date',
}

export const REST_GARAGE_FIELD_TYPES: FieldTypeConfig = {
  id: 'number',
  displayName: 'string',
  description: 'string',
  companyId: 'number',
  createdAt: 'date',
  updatedAt: 'date',
}

export const REST_MANAGER_FIELD_TYPES: FieldTypeConfig = {
  uid: 'string',
  displayName: 'string',
  companyId: 'number',
  createdAt: 'date',
  updatedAt: 'date',
}

export const REST_REVIEW_FIELD_TYPES: FieldTypeConfig = {
  id: 'number',
  rating: 'number',
  comment: 'string',
  customerId: 'string',
  garageId: 'number',
  createdAt: 'date',
  updatedAt: 'date',
}

export const REST_SLOT_FIELD_TYPES: FieldTypeConfig = {
  id: 'number',
  displayName: 'string',
  pricePerHour: 'number',
  length: 'number',
  width: 'number',
  height: 'number',
  type: 'string',
  garageId: 'number',
  createdAt: 'date',
  updatedAt: 'date',
}

export const REST_VALET_FIELD_TYPES: FieldTypeConfig = {
  uid: 'string',
  displayName: 'string',
  image: 'string',
  licenceID: 'string',
  companyId: 'number',
  createdAt: 'date',
  updatedAt: 'date',
}

export const REST_VALET_ASSIGNMENT_FIELD_TYPES: FieldTypeConfig = {
  bookingId: 'number',
  pickupLat: 'number',
  pickupLng: 'number',
  returnLat: 'number',
  returnLng: 'number',
  pickupValetId: 'string',
  returnValetId: 'string',
  createdAt: 'date',
  updatedAt: 'date',
}

export const REST_VERIFICATION_FIELD_TYPES: FieldTypeConfig = {
  verified: 'boolean',
  adminId: 'string',
  garageId: 'number',
  createdAt: 'date',
  updatedAt: 'date',
}
