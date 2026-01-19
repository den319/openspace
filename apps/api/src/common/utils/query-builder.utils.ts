import { Prisma } from '@prisma/client'

export interface FieldTypeConfig {
  [fieldName: string]: 'string' | 'date' | 'number' | 'boolean' | 'enum'
}

export class QueryBuilder {
  static buildWhereClause<T>(
    searchBy: string,
    search: string,
    fieldTypes: FieldTypeConfig,
  ): Partial<T> {
    const fieldType = fieldTypes[searchBy]
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
  static buildOrderByClause(
    sortBy?: string,
    order: 'asc' | 'desc' = 'asc',
  ): any {
    return sortBy ? { [sortBy]: order } : undefined
  }

  /**
   * Build pagination options
   */
  static buildPaginationOptions(skip?: number, take?: number) {
    return {
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
    }
  }

  /**
   * Build multi-field search (OR condition)
   */
  static buildMultiFieldSearch<T>(
    searchFields: string[],
    search: string,
    fieldTypes: FieldTypeConfig,
  ): any {
    const conditions = searchFields
      .map((field) => this.buildWhereClause(field, search, fieldTypes))
      .filter((clause) => Object.keys(clause).length > 0)

    return conditions.length > 0 ? { OR: conditions } : {}
  }
}
