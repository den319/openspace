import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { BookingTimelineOrderByRelationAggregateInput } from 'src/models/booking-timelines/graphql/dtos/order-by.args'
import { CustomerOrderByWithRelationInput } from 'src/models/customers/graphql/dtos/order-by.args'
import { SlotOrderByWithRelationInput } from 'src/models/slots/graphql/dtos/order-by.args'
import { ValetAssignmentOrderByWithRelationInput } from 'src/models/valet-assignments/graphql/dtos/order-by.args'

@InputType()
export class BookingOrderByWithRelationInputStrict
  implements
    RestrictProperties<
      BookingOrderByWithRelationInputStrict,
      Prisma.BookingOrderByWithRelationInput
    >
{
  @Field(() => Prisma.SortOrder, { nullable: true })
  id: Prisma.SortOrder

  @Field(() => Prisma.SortOrder, { nullable: true })
  createdAt: Prisma.SortOrder

  @Field(() => Prisma.SortOrder, { nullable: true })
  updatedAt: Prisma.SortOrder

  @Field(() => Prisma.SortOrder, { nullable: true })
  pricePerHour: Prisma.SortOrder

  @Field(() => Prisma.SortOrder, { nullable: true })
  totalPrice: Prisma.SortOrder

  @Field(() => Prisma.SortOrder, { nullable: true })
  startTime: Prisma.SortOrder

  @Field(() => Prisma.SortOrder, { nullable: true })
  endTime: Prisma.SortOrder

  @Field(() => Prisma.SortOrder, { nullable: true })
  vehicleNumber: Prisma.SortOrder

  @Field(() => Prisma.SortOrder, { nullable: true })
  phoneNumber: Prisma.SortOrder

  @Field(() => Prisma.SortOrder, { nullable: true })
  passcode: Prisma.SortOrder

  @Field(() => Prisma.SortOrder, { nullable: true })
  status: Prisma.SortOrder

  @Field(() => Prisma.SortOrder, { nullable: true })
  slotId: Prisma.SortOrder

  @Field(() => Prisma.SortOrder, { nullable: true })
  customerId: Prisma.SortOrder

  @Field(() => ValetAssignmentOrderByWithRelationInput, { nullable: true })
  ValetAssignment: ValetAssignmentOrderByWithRelationInput

  @Field(() => CustomerOrderByWithRelationInput, { nullable: true })
  Customer: CustomerOrderByWithRelationInput

  @Field(() => SlotOrderByWithRelationInput, { nullable: true })
  Slot: SlotOrderByWithRelationInput

  @Field(() => BookingTimelineOrderByRelationAggregateInput, { nullable: true })
  BookingTimeline: BookingTimelineOrderByRelationAggregateInput
}

@InputType()
export class BookingOrderByWithRelationInput extends PartialType(
  BookingOrderByWithRelationInputStrict,
) {}

@InputType()
export class BookingOrderByRelationAggregateInput {
  @Field(() => Prisma.SortOrder)
  _count?: Prisma.SortOrder
}
