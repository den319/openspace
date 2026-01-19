import { Prisma } from '@prisma/client'

export interface FieldTypeConfig {
  [fieldName: string]: 'string' | 'date' | 'number' | 'boolean' | 'enum'
}

export abstract class BaseQueryService<T> {
  protected abstract fieldTypes: FieldTypeConfig

  protected buildWhereClause(searchBy: string, search: string): Partial<T> {
    const fieldType = this.fieldTypes[searchBy]
    if (!fieldType) return {}

    switch (fieldType) {
      case 'string':
        return {
          [searchBy]: {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        } as any

      case 'date':
        const searchDate = new Date(search)
        if (isNaN(searchDate.getTime())) return {}

        const startOfDay = new Date(searchDate)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(searchDate)
        endOfDay.setHours(23, 59, 59, 999)

        return {
          [searchBy]: {
            gte: startOfDay,
            lte: endOfDay,
          },
        } as any

      case 'number':
        const numValue = parseFloat(search)
        if (isNaN(numValue)) return {}

        return {
          [searchBy]: {
            equals: numValue,
          },
        } as any

      case 'boolean':
        const boolValue = search.toLowerCase() === 'true'
        return {
          [searchBy]: {
            equals: boolValue,
          },
        } as any

      case 'enum':
        return {
          [searchBy]: {
            equals: search,
          },
        } as any

      default:
        return {}
    }
  }

  /**
   * Build order by clause
   */
  protected buildOrderByClause(
    sortBy?: string,
    order: 'asc' | 'desc' = 'asc',
  ): any {
    return sortBy ? { [sortBy]: order } : undefined
  }

  /**
   * Build pagination options
   */
  protected buildPaginationOptions(skip?: number, take?: number) {
    return {
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
    }
  }
}
