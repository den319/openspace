import { z } from 'zod'

export const formSchemaRegister = z.object({
  name: z.string().min(1, 'Name is required'),
  image: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
})

export const formSchemaLogin = formSchemaRegister.pick({
  email: true,
  password: true,
})
