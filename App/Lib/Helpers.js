import moment from 'moment'

export const millisecondsInOneDay = 86400000

export const isNotNullSafe = input => {
  return input === undefined || input === ''
}

export const isNullSafe = input => {
  return input !== undefined && input !== ''
}

export const isValidPassword = input => {
  return input.length >= 8
}

export function parseTime (s) {
  if (s) {
    let c = s.split(':')
    return parseInt(c[0]) * 60 + parseInt(c[1])
  } else {
    return 0
  }
}

export function getTimeDifference (startTime, endTime) {
  let from = moment(startTime, 'HH:mm')
  let end = moment(endTime, 'HH:mm')
  let timeDifference = moment.duration(end.diff(from)).asMinutes()

  return timeDifference
}

export function getTimeInHrsMins (time) {
  let timeInHours = Math.floor(time / 60)
  let timeInMinutes = time % 60

  let timeString = ''
  if (timeInHours > 0) {
    timeString = `${timeInHours} ${timeInHours === 1 ? 'hr' : 'hrs'}`
  }
  if (timeInMinutes > 0) {
    timeString += ` ${timeInMinutes} ${timeInMinutes === 1 ? 'min' : 'mins'}`
  }

  return timeString
}

export function getCurrentDate () {
  let d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function getCurrentTime () {
  let d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes())
}

export function getPreviousDate (format) {
  const previousDate = moment().subtract(1, 'days')
  return moment(previousDate).format(format)
}

export function getPreviousDateFrom (date, format) {
  let previousDate = moment(date, format).subtract(1, 'days')
  return moment(previousDate).format(format)
}

export function getNextDateFrom (date, format) {
  let nextDate = moment(date, format).add(1, 'days')
  return moment(nextDate).format(format)
}

export function getCurrentDateInFormat (format) {
  const date = moment()
  return moment(date).format(format)
}

export function getDateInFormat (date, format) {
  return moment.utc(date).format(format)
}

export function getUtcDate () {
	return moment.utc().format('YYYY-MM-DDTHH:mm:ss.sssZ')
}

export function getCurrentDateTime () {
  return moment().format('MMMM Do YYYY HH:mm')
}

export function getCurrentTimestamp () {
  return moment().format()
}

export function lastSyncTime () {
  return moment().format('hh:mm a DD MMM YYYY')
}

export function getLastMonthDate (format) {
  let lastMonthDate = moment(moment(), format).subtract(30, 'days')
  return moment(lastMonthDate).format(format)
}

export function dayDifference (date1, date2, format) {
  let d1 = moment(date1, format, true)
  let d2 = moment(date2, format, true)

  return d1 - d2
}

export function secondsDifference (date1, date2, format) {
  let d1 = moment(date1, format, true)
  let d2 = moment(date2, format, true)

  return d1.diff(d2)
}

export function isGreater (date1, date2, format) {
  let d1 = moment(date1, format, true)
  let d2 = moment(date2, format, true)

  return d1.isAfter(d2)
}

export function isLessThan (date1, date2, format) {
  let d1 = moment(date1, format, true)
  let d2 = moment(date2, format, true)

  return d1.isBefore(d2)
}

export function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
}

export function isSameTime (date1, date2, format) {
  let d1 = moment(date1, format, true)
  let d2 = moment(date2, format, true)

  return d1.isSame(d2)
}
