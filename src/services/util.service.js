import { useEffect } from 'react'
import { useSelector } from 'react-redux'

export function makeId(length = 6) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return txt
}

export function makeLorem(size = 100) {
  var words = [
    'The sky',
    'above',
    'the port',
    'was',
    'the color of television',
    'tuned',
    'to',
    'a dead channel',
    '.',
    'All',
    'this happened',
    'more or less',
    '.',
    'I',
    'had',
    'the story',
    'bit by bit',
    'from various people',
    'and',
    'as generally',
    'happens',
    'in such cases',
    'each time',
    'it',
    'was',
    'a different story',
    '.',
    'It',
    'was',
    'a pleasure',
    'to',
    'burn',
  ]
  var txt = ''
  while (size > 0) {
    size--
    txt += words[Math.floor(Math.random() * words.length)] + ' '
  }
  return txt
}

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

export function randomPastTime() {
  const HOUR = 1000 * 60 * 60
  const DAY = 1000 * 60 * 60 * 24
  const WEEK = 1000 * 60 * 60 * 24 * 7

  const pastTime = getRandomIntInclusive(HOUR, WEEK)
  return Date.now() - pastTime
}

export function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : undefined
}

export function onPageNavigation(diff, filter, setFilter, maxPage) {
  if (filter.pageIdx + diff === -1) return

  if (filter.pageIdx + diff === maxPage) {
    setFilter({ ...filter, pageIdx: 0 })

    return
  }

  setFilter({ ...filter, pageIdx: filter.pageIdx + diff })
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function translateDayToHebrew(day) {
  const daysInHebrew = {
    sunday: 'ראשון',
    monday: 'שני',
    tuesday: 'שלישי',
    wednesday: 'רביעי',
    thursday: 'חמישי',
    friday: 'שישי',
    saturday: 'שבת',
  }

  // Convert input to lowercase to ensure case insensitivity
  return daysInHebrew[day.toLowerCase()] || 'Invalid day'
}

export function convertToDate(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number) // Split and convert to numbers
  const now = new Date() // Get the current date
  now.setHours(hours, minutes, 0, 0) // Set hours, minutes, and reset seconds and milliseconds
  return now
}

export function getTodayDayName() {
  const today = new Date()
  const dayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ]
  return dayNames[today.getDay()]
}

export function smoothScroll() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export const parseJwt = (token) => {
  const base64Url = token.split('.')[1] // Extract payload
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/') // Replace JWT-specific chars
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('') // Decode Base64
  )
  return JSON.parse(jsonPayload) // Parse the payload into JSON
}

export function textAnimation(prefs) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(prefs.isEnglish ? 'show' : 'show-rtl')
        // entry.target.classList.remove('hidden')
      } else {
        entry.target.classList.remove(prefs.isEnglish ? 'show' : 'show-rtl')
      }
    })
  })

  const elements = document.querySelectorAll('.section')
  elements.forEach((el) => observer.observe(el))

  return () => elements.forEach((el) => observer.unobserve(el))
}

export function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window

  return {
    width,
    height,
  }
}
