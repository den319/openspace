import {
  differenceInMilliseconds,
  differenceInSeconds,
  formatISO,
  format,
} from 'date-fns'

export const toLocalISOString = (date: Date): string => {
  // Format as local ISO string for datetime-local input (yyyy-MM-ddTHH:mm)
  return formatISO(date, { representation: 'complete' }).slice(0, 16)
}

export const differenceInTime = ({
  startTime,
  endTime,
  unit = 'milliseconds',
}: {
  startTime: string | Date
  endTime: string | Date
  unit?: 'milliseconds' | 'seconds'
}): number => {
  const start = new Date(startTime)
  const end = new Date(endTime)

  if (unit === 'seconds') {
    return differenceInSeconds(end, start)
  }

  return differenceInMilliseconds(end, start)
}

// export const getTimeUnits = (totalSeconds: number): { timeString: string } => {
//   const hours = Math.floor(totalSeconds / 3600)
//   const minutes = Math.floor((totalSeconds % 3600) / 60)

//   const parts: string[] = []

//   if (hours > 0) {
//     parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`)
//   }

//   if (minutes > 0) {
//     parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`)
//   }

//   if (parts.length === 0) {
//     parts.push('0 minutes')
//   }

//   return {
//     timeString: parts.join(' '),
//   }
// }

export const getTimeUnits = (totalSeconds: number): { timeString: string } => {
  const MILLISECOND_TO_SECOND = 1000
  const SECONDS_IN_MINUTE = 60 * MILLISECOND_TO_SECOND
  const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE
  const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR
  const SECONDS_IN_MONTH = 30 * SECONDS_IN_DAY
  const SECONDS_IN_YEAR = 12 * SECONDS_IN_MONTH

  const parts: string[] = []

  if (totalSeconds >= SECONDS_IN_YEAR) {
    const years = Math.floor(totalSeconds / SECONDS_IN_YEAR)
    const remainingSeconds = totalSeconds % SECONDS_IN_YEAR
    const months = Math.floor(remainingSeconds / SECONDS_IN_MONTH)

    parts.push(`${years} year${years !== 1 ? 's' : ''}`)
    if (months > 0) {
      parts.push(`${months} month${months !== 1 ? 's' : ''}`)
    }
  } else if (totalSeconds >= SECONDS_IN_MONTH) {
    const months = Math.floor(totalSeconds / SECONDS_IN_MONTH)
    const remainingSeconds = totalSeconds % SECONDS_IN_MONTH
    const days = Math.floor(remainingSeconds / SECONDS_IN_DAY)

    parts.push(`${months} month${months !== 1 ? 's' : ''}`)
    if (days > 0) {
      parts.push(`${days} day${days !== 1 ? 's' : ''}`)
    }
  } else if (totalSeconds >= SECONDS_IN_DAY) {
    const days = Math.floor(totalSeconds / SECONDS_IN_DAY)
    const remainingSeconds = totalSeconds % SECONDS_IN_DAY
    const hours = Math.floor(remainingSeconds / SECONDS_IN_HOUR)

    parts.push(`${days} day${days !== 1 ? 's' : ''}`)
    if (hours > 0) {
      parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`)
    }
  } else {
    const hours = Math.floor(totalSeconds / SECONDS_IN_HOUR)
    const minutes = Math.floor(
      (totalSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE,
    )

    if (hours > 0) {
      parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`)
    }

    if (minutes > 0) {
      parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`)
    }

    if (parts.length === 0) {
      parts.push('0 minutes')
    }
  }

  return {
    timeString: parts.join(' '),
  }
}

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'dd MMMM yyyy')
}

export const formatTime = (date: string | Date): string => {
  return format(new Date(date), 'HH:mm')
}
