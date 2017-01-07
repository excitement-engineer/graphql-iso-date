// @flow

// Parses a RFC 3339 compliant time-string into a Date.
// It does this by combining the current date with the time-string
// to create a new Date instance.
//
// Example:
// Suppose the current date is 2016-01-01, then
// parseTime('11:00:12Z') parses to a Date corresponding to
// 2016-01-01T11:00:12Z.
export const parseTime = (time: string): Date => {
  const currentDateString = new Date().toISOString()
  return new Date(currentDateString.substr(0, currentDateString.indexOf('T') + 1) + time)
}

// Serializes a Date into a RFC 3339 compliant time-string in the
// format hh:mm:ss.sssZ.
export const serializeTime = (date: Date): string => {
  const dateTimeString = date.toISOString()
  return dateTimeString.substr(dateTimeString.indexOf('T') + 1)
}

// Parses a RFC 3339 compliant date-string into a Date.
//
// Example:
// parseDate('2016-01-01') parses to a Date corresponding to
// 2016-01-01T00:00:00.000Z.
export const parseDate = (date: string): Date => {
  return new Date(date)
}

// Serializes a Date into a RFC 3339 compliant date-string
// in the format YYYY-MM-DD.
export const serializeDate = (date: Date): string => {
  let month = String(date.getMonth() + 1)
  let day = String(date.getDate())
  const year = String(date.getFullYear())

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day
  return [year, month, day].join('-')
}

// Parses a RFC 3339 compliant date-time-string into a Date.
export const parseDateTime = (dateTime: string): Date => {
  return new Date(dateTime)
}

// Serializes a Date into a RFC 3339 compliant date-time-string
// in the format YYYY-MM-DDThh:mm:ss.sssZ.
export const serializeDateTime = (dateTime: Date): string => {
  return dateTime.toISOString()
}

// Serializes a Unix timestamp to a RFC 3339 compliant date-time-string
// in the format YYYY-MM-DDThh:mm:ss.sssZ
export const serializeUnixTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toISOString()
}
