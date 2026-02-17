import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@mui/material'
import { classService } from '../services/class/class.service'
import { uploadService } from '../services/upload.service'
import { setIsLoading, setPrefs } from '../store/actions/system.actions'
import { showErrorMsg } from '../services/event-bus.service'
import {
  capitalizeFirstLetter,
  translateDayToHebrew,
  getWindowDimensions,
} from '../services/util.service'

import { Nav } from '../cmps/Nav'

import { styled } from '@mui/material/styles'

import { HeadContainer } from '../cmps/HeadContainer'
import { makeId } from '../services/util.service'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import BedtimeIcon from '@mui/icons-material/Bedtime'
import PrintIcon from '@mui/icons-material/Print'
import DownloadIcon from '@mui/icons-material/Download'

import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

export function Schedule() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const isLoading = useSelector(
    (storeState) => storeState.systemModule.isLoading
  )

  const [occurrs, setOccurrs] = useState([])

  const [schedules, setSchedules] = useState([])
  const [schedule, setSchedule] = useState({})

  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const [filter, setFilter] = useState({ pageIds: 0, isAll: false })
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )
  const scheduleRef = useRef()

  const daysOfWeek = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    // 'saturday',
  ]

  useEffect(() => {
    loadSchedules()
    loadOccurrences()
  }, [])

  const loadSchedules = async () => {
    try {
      const schedules = await scheduleService.query(filter)
      setSchedules((prev) => (prev = schedules))
      setSchedule({ ...schedules[schedules.length - 1] })
      return schedules
    } catch (err) {
      // // console.log(err)
    }
  }

  const loadOccurrences = async () => {
    setIsLoading(true)
    try {
      const occurrences = await classService.getOccurrences()

      setOccurrs(occurrences)
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish ? `Couldn't load schedule` : 'טעינת מערכת נכשלה'
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function uploadFile(ev) {
    setIsLoading(true)
    try {
      const res = await uploadService.uploadImg(ev)
      const coverSrc = res.url
      const saved = await scheduleService.save(coverSrc)
      // setSchedule(saved)
      const newSchedules = await loadSchedules()

      setSchedule({ ...saved })
    } catch (err) {
      // // console.log(err)
      showErrorMsg(
        prefs.isEnglish ? `Couldn't upload image` : 'העלאת תמונה נכשלה'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const origin = {
    path: '/class',
    he: 'שיעורים',
    eng: 'Class',
  }

  const links = [
    {
      path: '/class/schedule',
      he: 'לוח החוגים',
      eng: 'Schedule',
    },
    {
      path: '/class/trainer',
      he: 'המדריכים שלנו',
      eng: 'Our Instructors',
    },
  ]

  function getFromTime(from) {
    const array = from.split(':')
    let hour = array[0]
    hour = +hour
    let state
    if (hour >= 14) {
      state = 'evening'
    }
    if (hour < 14) {
      state = 'morning'
    }
    return state
  }

  const onPrintSchedule = () => {
    const schedule = scheduleRef.current
    if (!schedule) {
      showErrorMsg(prefs.isEnglish ? `Couldn't print` : 'לא היה ניתן להדפיס')
      return
    }

    const printWindow = window.open('', 'PRINT', 'width=600,height=400')
    const now = new Date()
    const monthYear = prefs.isEnglish
      ? `${now.toLocaleString('en-US', { month: 'long' })} ${now.getFullYear()}`
      : `${now.toLocaleString('he-IL', { month: 'long' })} ${now.getFullYear()}`

    // Clone the schedule and add opening hours
    const scheduleClone = schedule.cloneNode(true)
    const dayContainers = scheduleClone.querySelectorAll('.day-container')
    const isJulyOrAugust = [6, 7].includes(new Date().getMonth())

    dayContainers.forEach((container, index) => {
      if (index === 4 || index === 5) {
        // Thursday and Friday
        const openingHoursRow = document.createElement('div')
        openingHoursRow.className = 'hour-container'
        openingHoursRow.style.cssText = `
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          margin: 5px;
          padding: 8px;
          font-size: 11px;
          color: #2C3E50;
          margin-top: auto;
          height: 180px;
        `

        const content =
          index === 4
            ? // Pool times (Thursday cell)
              `<div style="height: 100%; display: flex; flex-direction: column; text-align: ${
                prefs.isEnglish ? 'left' : 'right'
              }; direction: ${prefs.isEnglish ? 'ltr' : 'rtl'}">
            <div style="font-weight: bold; color: #4A90E2; margin-bottom: 8px; text-align: center; font-size: 14px; border-bottom: 1px solid #e0e0e0; padding-bottom: 4px;">
              ${prefs.isEnglish ? 'Pool Hours' : 'שעות בריכה'}
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
              <tr style="border-bottom: 1px solid #f0f0f0">
                <td style="padding: 3px; width: 30%; vertical-align: top;"><strong>${
                  prefs.isEnglish ? 'Sun' : 'ראשון'
                }</strong></td>
                <td style="padding: 3px; text-align: center;">
                  06:00-13:00<br>15:00-21:00
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0">
                <td style="padding: 3px; vertical-align: top;"><strong>${
                  prefs.isEnglish ? 'Mon-Thu' : 'שני-חמישי'
                }</strong></td>
                <td style="padding: 3px; text-align: center;">06:00-21:00</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0">
                <td style="padding: 3px; vertical-align: top;"><strong>${
                  prefs.isEnglish ? 'Fri' : 'שישי'
                }</strong></td>
                <td style="padding: 3px; text-align: center;">06:00-${
                  isJulyOrAugust ? '18:00' : '17:00'
                }</td>
              </tr>
              <tr>
                <td style="padding: 3px; vertical-align: top;"><strong>${
                  prefs.isEnglish ? 'Sat' : 'שבת'
                }</strong></td>
                <td style="padding: 3px; text-align: center;">08:00-${
                  isJulyOrAugust ? '18:00' : '17:00'
                }</td>
              </tr>
            </table>
          </div>`
            : // Gym times (Friday cell)
              `<div style="height: 100%; display: flex; flex-direction: column; text-align: ${
                prefs.isEnglish ? 'left' : 'right'
              }; direction: ${prefs.isEnglish ? 'ltr' : 'rtl'}">
            <div style="font-weight: bold; color: #4A90E2; margin-bottom: 8px; text-align: center; font-size: 14px; border-bottom: 1px solid #e0e0e0; padding-bottom: 4px;">
              ${prefs.isEnglish ? 'Gym Hours' : 'שעות חדר כושר'}
            </div>
            <table style="width: 100%; border-collapse: collapse;  font-size: 10px;">
              <tr style="border-bottom: 1px solid #f0f0f0">
                <td style="padding: 3px; width: 30%; vertical-align: top;"><strong>${
                  prefs.isEnglish ? 'Sun' : 'ראשון'
                }</strong></td>
                <td style="padding: 3px; text-align: center;">
                  06:00-13:00<br>16:00-21:00
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0">
                <td style="padding: 3px; vertical-align: top;"><strong>${
                  prefs.isEnglish ? 'Mon-Wed' : 'שני-רביעי'
                }</strong></td>
                <td style="padding: 3px; text-align: center;">06:00-21:00</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0">
                <td style="padding: 3px; vertical-align: top;"><strong>${
                  prefs.isEnglish ? 'Thu' : 'חמישי'
                }</strong></td>
                <td style="padding: 3px; text-align: center;">
                  06:00-13:00<br>16:00-21:00
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0">
                <td style="padding: 3px; vertical-align: top;"><strong>${
                  prefs.isEnglish ? 'Fri' : 'שישי'
                }</strong></td>
                <td style="padding: 3px; text-align: center;">06:00-16:00</td>
              </tr>
              <tr>
                <td style="padding: 3px; vertical-align: top;"><strong>${
                  prefs.isEnglish ? 'Sat' : 'שבת'
                }</strong></td>
                <td style="padding: 3px; text-align: center;">08:00-16:00</td>
              </tr>
            </table>
          </div>`

        // Make the container flex to push the hours to the bottom
        container.style.display = 'flex'
        container.style.flexDirection = 'column'

        openingHoursRow.innerHTML = content
        container.appendChild(openingHoursRow)
      }
    })

    printWindow.document.write(`
    <html>
      <head>
        <title>${
          prefs.isEnglish ? 'Class Schedule' : 'מערכת החוגים'
        } - ${monthYear}</title>
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');

        @page {
          size: A4 landscape;
          margin: 5mm;
        }

        body {
          font-family: ${prefs.isEnglish ? 'Roboto' : 'Heebo'}, sans-serif;
          margin: 0;
          padding: 10px;
          background-color: #f5f5f5;
          position: relative;
          overflow: hidden;
        }



        .header {
          text-align: center;
          margin: 5px 0 10px;
          padding: 5px;
          background: linear-gradient(135deg, #4A90E2 0%, #2C3E50 100%);
          color: white;
          // background: linear-gradient(
          //   135deg,
          //   #6ec1e48e 0%,
          //   #a8e6a147 100%
          // );
          // color:#2C3E50;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        }

        .header::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.1) 50%, transparent 55%);
          animation: shine 2s infinite;
        }

        .header h1 {
          margin: 0;
          font-size: 20px;
          font-weight: 500;
        }

        .header p {
          margin: 3px 0 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .schedule-container {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1px;
          background-color: white;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          direction: ${prefs.isEnglish ? 'ltr' : 'rtl'};
          page-break-inside: avoid;
          max-height: calc(100vh - 100px);
        }

        .day-container {
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          background-color: white;
          page-break-inside: avoid;
        }

        .day-name {
          background: linear-gradient(to right, #2C3E50, #3498db);
          color: white;
          // background: linear-gradient(
          //   135deg,
          //   #6ec1e48e 0%,
          //   #a8e6a147 100%
          // );
          // color:#2C3E50;
          padding: 6px;
          text-align: center;
          font-weight: bold;
          font-size: 16px;
        }

        .hour-container {
          padding: 6px;
          border-bottom: 1px solid #eee;
          transition: background-color 0.3s;
        }

        .hour-container.morning {
          background: linear-gradient(45deg, #f8f9fa 0%, #ffffff 100%);
        }

        .hour-container.evening {
          background: linear-gradient(45deg, #e9ecef 0%, #f8f9fa 100%);
        }

        .occurrence-container {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: center;
        }

        .occurrence-container b {
          color: #2C3E50;
          font-size: 14px;
          // white-space: nowrap;
          // overflow: hidden;
          // text-overflow: ellipsis;
        }
        
        .time-container {
          color: #4A90E2;
          font-weight: 500;
          font-size: 12px;
        }
        .occurrence-container span {
          color: #2C3E50;
          font-size: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .icon {
          display: inline-block;
          width: 12px;
          height: 12px;
          margin: 0 auto;
        }

 
        .icon.morning svg {
          
          // fill: #f39c12;
          fill: #df8d0b;

        }

        .icon.evening svg {
          fill: #34495e;

        }

        @media print {
          body {
            background-color: white;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .schedule-container {
            box-shadow: none;
          }

          .header::after {
            display: none;
          }
        }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${prefs.isEnglish ? 'Class Schedule' : 'מערכת החוגים'}</h1>
          <p>${monthYear}</p>
        </div>
        ${scheduleClone.outerHTML}
      </body>
    </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [windowDimensions])

  const onDownloadSchedule = async () => {
    const el = scheduleRef.current
    if (!el) return

    await document.fonts.ready

    // Create a wrapper div for the header and schedule
    const wrapper = document.createElement('div')
    wrapper.style.cssText = `
      background-color: #f5f5f5;
      padding: 10px;
      position: relative;
      width: 1123px; /* A4 Landscape width at 300 DPI */
      height: 794px; /* A4 Landscape height at 300 DPI */
    `

    // Add sports figure watermarks
    const watermark = document.createElement('div')
    watermark.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.05;
      pointer-events: none;
      z-index: 1;
    `

    wrapper.appendChild(watermark)

    // Create and style the header
    const header = document.createElement('div')
    header.style.cssText = `
      text-align: center;
      margin: 0;
      margin-bottom: 2.5px;
      padding: 10px;
      background: linear-gradient(135deg, #4A90E2 0%, #2C3E50 100%);
      color: white;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      z-index: 2;
      display:grid;
      align-items: center;
      justify-content: center;
    `

    // Add decorative line to header
    const decorativeLine = document.createElement('div')
    decorativeLine.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(to right, 
        transparent 0%,
        rgba(255,255,255,0.5) 50%,
        transparent 100%
      );
    `
    header.appendChild(decorativeLine)

    const now = new Date()
    const monthYear = prefs.isEnglish
      ? `${now.toLocaleString('en-US', { month: 'long' })} ${now.getFullYear()}`
      : `${now.toLocaleString('he-IL', { month: 'long' })} ${now.getFullYear()}`

    const title = document.createElement('h1')
    title.style.cssText = `
      margin: 0;
      font-size: 28px;
      font-weight: 500;
      // font-family: ${prefs.isEnglish ? 'Roboto' : 'Heebo'};
      position: relative;
      bottom: 10px;

    `
    title.textContent = prefs.isEnglish ? 'Class Schedule' : 'מערכת החוגים'

    const subtitle = document.createElement('p')
    subtitle.style.cssText = `
      margin: 5px 0 0;
      font-size: 18px;
      opacity: 0.9;
      text-align: center;
      // font-family: ${prefs.isEnglish ? 'Roboto' : 'Heebo'};
      position: relative;
      bottom: 10px;
    `
    subtitle.textContent = monthYear

    header.appendChild(title)
    header.appendChild(subtitle)

    // Clone and style the schedule
    const scheduleClone = el.cloneNode(true)
    scheduleClone.style.cssText = `
      background-color: white;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 2;
      position: relative;
      display: grid;
      grid-template-columns: repeat(6, 1fr);

    `

    // Add opening hours as a row in the schedule
    const dayContainers = scheduleClone.querySelectorAll('.day-container')
    const isJulyOrAugust = [6, 7].includes(new Date().getMonth())

    dayContainers.forEach((container, index) => {
      // container.style.display = 'flex'
      // container.style.flexDirection = 'column'
      // container.style.height = '100%'
      // container.style.height = '600px'
      container.style.display = 'grid'
      container.style.display = 'flex'
      // console.log(container)
      if (index === 4 || index === 5) {
        // Thursday and Friday
        const openingHoursRow = document.createElement('div')
        openingHoursRow.className = 'hour-container'
        openingHoursRow.style.cssText = `
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          margin: 5px;
          padding: 8px;
          font-size: 11px;
          color: #2C3E50;
          margin-top: auto;
          height: 180px;

          // display: grid;
          // align-self: end;
          justify-self: stretch;

          position:relative;


        `

        const content =
          index === 4
            ? // Pool times (Thursday cell)
              `<div style="height: 100%; display: flex; flex-direction: column; text-align: ${
                prefs.isEnglish ? 'left' : 'right'
              }; direction: ${
                prefs.isEnglish ? 'ltr' : 'rtl'
              }; position:absolute; bottom:0; left:0; right:0;">
          <div style="font-weight: bold; color: #4A90E2; margin-bottom: 8px; text-align: center; font-size: 14px; border-bottom: 1px solid #e0e0e0; padding-bottom: 4px;">
            ${prefs.isEnglish ? 'Pool Hours' : 'שעות בריכה'}
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <tr style="border-bottom: 1px solid #f0f0f0" margin-bottom: 4px;">
              <td style="padding: 5px; width: 30%; vertical-align: top;"><strong>${
                prefs.isEnglish ? 'Sun' : 'ראשון'
              }</strong></td>
              <td style="padding: 5px; text-align: center;">
                06:00-13:00<br>15:00-21:00
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0" margin-bottom: 4px;">
              <td style="padding: 5px; vertical-align: top;"><strong>${
                prefs.isEnglish ? 'Mon-Thu' : 'שני-חמישי'
              }</strong></td>
              <td style="padding: 5px; text-align: center;">06:00-21:00</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0" margin-bottom: 4px;">
              <td style="padding: 5px; vertical-align: top;"><strong>${
                prefs.isEnglish ? 'Fri' : 'שישי'
              }</strong></td>
              <td style="padding: 5px; text-align: center;">06:00-${
                isJulyOrAugust ? '18:00' : '17:00'
              }</td>
            </tr>
            <tr margin-bottom: 4px;">
              <td style="padding: 5px; vertical-align: top;"><strong>${
                prefs.isEnglish ? 'Sat' : 'שבת'
              }</strong></td>
              <td style="padding: 5px; text-align: center;">08:00-${
                isJulyOrAugust ? '18:00' : '17:00'
              }</td>
            </tr>
          </table>
        </div>`
            : // Gym times (Friday cell)
              `<div style="height: 100%; display: flex; flex-direction: column; text-align: ${
                prefs.isEnglish ? 'left' : 'right'
              }; direction: ${prefs.isEnglish ? 'ltr' : 'rtl'}">
          <div style="font-weight: bold; color: #4A90E2; margin-bottom: 8px; text-align: center; font-size: 14px; border-bottom: 1px solid #e0e0e0; padding-bottom: 4px;">
            ${prefs.isEnglish ? 'Gym Hours' : 'שעות חדר כושר'}
          </div>
          <table style="width: 100%; border-collapse: collapse;  font-size: 10px;">
            <tr style="border-bottom: 1px solid #f0f0f0 margin-bottom: 4px;">
              <td style="padding: 3px; width: 30%; vertical-align: top;"><strong>${
                prefs.isEnglish ? 'Sun' : 'ראשון'
              }</strong></td>
              <td style="padding: 3px; text-align: center;">
                06:00-13:00<br>16:00-21:00
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0 margin-bottom: 4px;">
              <td style="padding: 3px; vertical-align: top;"><strong>${
                prefs.isEnglish ? 'Mon-Wed' : 'שני-רביעי'
              }</strong></td>
              <td style="padding: 3px; text-align: center;">06:00-21:00</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0 margin-bottom: 4px;">
              <td style="padding: 3px; vertical-align: top;"><strong>${
                prefs.isEnglish ? 'Thu' : 'חמישי'
              }</strong></td>
              <td style="padding: 3px; text-align: center;">
                06:00-13:00<br>16:00-21:00
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0 margin-bottom: 4px;">
              <td style="padding: 3px; vertical-align: top;"><strong>${
                prefs.isEnglish ? 'Fri' : 'שישי'
              }</strong></td>
              <td style="padding: 3px; text-align: center;">06:00-16:00</td>
            </tr>
            <tr margin-bottom: 4px;">
              <td style="padding: 3px; vertical-align: top;"><strong>${
                prefs.isEnglish ? 'Sat' : 'שבת'
              }</strong></td>
              <td style="padding: 3px; text-align: center;">08:00-16:00</td>
            </tr>
          </table>
        </div>`

        openingHoursRow.innerHTML = content
        container.appendChild(openingHoursRow)
      }
    })

    // Style schedule elements
    scheduleClone.querySelectorAll('.day-container').forEach((day) => {
      day.style.cssText = `
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        overflow: hidden;
        display: flex;
        flex-direction: column;

      `
    })

    scheduleClone.querySelectorAll('.day-name').forEach((dayName) => {
      dayName.style.cssText = `
        background: linear-gradient(to right, #2C3E50, #3498db);
        color: white;
        padding: 4px;
        font-weight: bold;
        text-align: center;
        font-size: 24px;
        height: 32px;
        display:grid;
        align-items: center;
        justify-content: center;
        grid-template-rows: 1fr;
      `
    })
    const hourContainers = scheduleClone.querySelectorAll('.hour-container')
    hourContainers.forEach((hourContainer) => {
      hourContainer.style.borderBottom = `1px solid #eee;
        `
      hourContainer.style.display = 'grid'
      hourContainer.style.alignItems = 'center'
      hourContainer.style.justifyContent = 'stretch'
    })
    scheduleClone.querySelectorAll('.hour-container').forEach((hour) => {
      if (hour.classList.contains('morning')) {
        hour.style.background =
          'linear-gradient(45deg, #f8f9fa 0%, #ffffff 100%)'
      } else if (hour.classList.contains('evening')) {
        hour.style.background =
          'linear-gradient(45deg, #e9ecef 0%, #f8f9fa 100%)'
      }
      hour.style.padding = '5px'

      hour
        .querySelectorAll('.occurrence-container')
        .forEach((occurrence, lineIndex, array) => {
          occurrence.style.position = 'relative'
          occurrence.style.display = 'grid'
          occurrence.style.alignItems = 'center'
          occurrence.style.gridTemplateColumns = '1fr'
          occurrence.style.gap = '0.2em'
          occurrence.style.textAlign = 'center'
          // occurrence.style.padding = '5px 10px'
          occurrence.style.paddingBottom = '5px'
          // occurrence.style.padding = '0, 5px'
          occurrence.style.fontSize = '12px'
          // occurrence.style.borderBottom = '1px solid #eee'
          const elClassName = occurrence.querySelector('b')
          elClassName.style.fontSize = '16px'
          elClassName.style.fontWeight = 'bold'
          const elIcon = occurrence.querySelector('.icon')
          elIcon.querySelector('svg').style.fontSize = '18px'
          elIcon.style.position = 'absolute'
          elIcon.style.right = '2px'
          elIcon.style.top = '2px'
          elIcon.style.height = '18px'
          elIcon.classList.contains('morning')
            ? (elIcon.querySelector('svg').style.fill = '#df8d0b')
            : (elIcon.querySelector('svg').style.fill = '#34495e')
        })
      // hour.style.display = 'grid'
      // hour.style.gridTemplateColumns = '1fr'
    })

    const dayNames = scheduleClone.querySelectorAll('.day-name')
    dayNames.forEach((dayName) => {
      dayName.style.fontSize = '20px'
      dayName.style.fontWeight = 'bold'
      dayName.style.position = 'relative'
      dayName.style.padding = '0'

      const elB = dayName.querySelector('b')
      elB.style.position = 'absolute'
      elB.style.top = '-10px'
      elB.style.left = '0'
      elB.style.right = '0'
      elB.style.margin = '0'
      elB.style.display = 'grid'
      elB.style.alignItems = 'center'
      elB.style.justifyContent = 'center'
      elB.style.gridTemplateRows = '1fr'
    })

    // Add elements to wrapper
    wrapper.appendChild(header)
    wrapper.appendChild(scheduleClone)

    // Add wrapper to document temporarily
    document.body.appendChild(wrapper)

    // Take screenshot with html2canvas
    const canvas = await html2canvas(wrapper, {
      scale: 2,
      backgroundColor: '#f5f5f5',
      useCORS: true,
      logging: false,
      width: 1123, // A4 Landscape width at 300 DPI
      height: 794, // A4 Landscape height at 300 DPI
    })

    // Remove wrapper
    document.body.removeChild(wrapper)

    // Create PDF with exact A4 dimensions
    const imgData = canvas.toDataURL('image/jpeg', 1.0)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
    })

    pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210) // A4 dimensions in mm

    const fileName = prefs.isEnglish
      ? `Schedule - ${monthYear}`
      : `מערכת החוגים - ${monthYear}`

    pdf.save(`${fileName}.pdf`)
  }

  return (
    <section className='schedule'>
      <h2>{prefs.isEnglish ? 'Class' : 'שיעורים'}</h2>
      <Nav
        origin={origin}
        links={links}
      />

      <HeadContainer text={{ he: 'מערכת החוגים', eng: 'Schedule' }} />

      <div className='controller-container'>
        <div className='icons-container'>
          <div className='icon-container'>
            <b>{prefs.isEnglish ? 'Morning' : 'בוקר'}</b>
            <b>-</b>
            <div className='icon morning'>
              <WbSunnyIcon />
            </div>
          </div>
          <div className='icon-container'>
            <b>{prefs.isEnglish ? 'Evening' : 'ערב'}</b>
            <b>-</b>
            <div className='icon evening'>
              <BedtimeIcon />
            </div>
          </div>
        </div>
        <div className='download-container'>
          <Button
            variant='contained'
            onClick={onDownloadSchedule}
          >
            {prefs.isEnglish ? 'Download' : 'הורדה'}
            <DownloadIcon />
          </Button>
        </div>
        <div className='print-container'>
          <Button
            variant='contained'
            onClick={onPrintSchedule}
          >
            {prefs.isEnglish ? 'Print' : 'הדפסה'}
            <PrintIcon />
          </Button>
        </div>
      </div>
      <div
        ref={scheduleRef}
        className={`schedule-container ${prefs.isEnglish ? '' : 'rtl'} ${
          prefs.isDarkMode ? 'dark-mode' : ''
        }`}
      >
        {daysOfWeek.map((day) => {
          let counter = [1, 2, 3, 4, 5, 6]

          return (
            <div
              className='day-container'
              key={`${makeId()}${day}`}
            >
              <div className='hour-container day day-name'>
                <b>
                  {prefs.isEnglish
                    ? capitalizeFirstLetter(day)
                    : translateDayToHebrew(day)}
                </b>
              </div>
              {occurrs.map((occur) => {
                return (
                  occur.day === day && (
                    <div
                      className={`hour-container ${getFromTime(occur.from)}`}
                      key={`${makeId()}`}
                    >
                      <div className='occurrence-container'>
                        <b>
                          {prefs.isEnglish ? occur.title.eng : occur.title.he}
                        </b>
                        <span
                          className='time-container'
                          style={{ direction: 'ltr' }}
                        >{`${occur.from}-${occur.to}`}</span>
                        <span>
                          {prefs.isEnglish
                            ? occur.trainer.name.eng
                            : occur.trainer.name.he}
                        </span>
                        <div className={`icon ${getFromTime(occur.from)}`}>
                          {(getFromTime(occur.from) === 'morning' && (
                            <WbSunnyIcon />
                          )) || <BedtimeIcon />}
                        </div>
                      </div>
                    </div>
                  )
                )
              })}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function getDefaultTimes() {
  return [
    {
      _id: makeId(),
      dayName: {
        he: 'ראשון',
        eng: 'Sunday',
      },
      extra: null,
      times: {
        pool: [
          {
            from: '06:00',
            to: '13:00',
          },
          {
            from: '15:00',
            to: '21:00',
          },
        ],
        gym: [
          {
            from: '06:00',
            to: '13:00',
          },
          {
            from: '16:00',
            to: '21:00',
          },
        ],
      },
    },
    {
      _id: makeId(),
      dayName: {
        he: 'שני',
        eng: 'Monday',
      },
      extra: null,
      times: {
        pool: [
          {
            from: '06:00',
            to: '21:00',
          },
        ],
        gym: [
          {
            from: '06:00',
            to: '21:00',
          },
        ],
      },
    },
    {
      _id: makeId(),
      dayName: {
        he: 'שלישי',
        eng: 'Tuesday',
      },
      extra: null,

      times: {
        pool: [
          {
            from: '06:00',
            to: '21:00',
          },
        ],
        gym: [
          {
            from: '06:00',
            to: '21:00',
          },
        ],
      },
    },
    {
      _id: makeId(),
      dayName: {
        he: 'רביעי',
        eng: 'Wednesday',
      },
      extra: null,

      times: {
        pool: [
          {
            from: '06:00',
            to: '21:00',
          },
        ],
        gym: [
          {
            from: '06:00',
            to: '21:00',
          },
        ],
      },
    },
    {
      _id: makeId(),
      dayName: {
        he: 'חמישי',
        eng: 'Thursday',
      },
      extra: null,

      times: {
        pool: [
          {
            from: '06:00',
            to: '21:00',
          },
        ],
        gym: [
          {
            from: '06:00',
            to: '13:00',
          },
          {
            from: '16:00',
            to: '21:00',
          },
        ],
      },
    },
    {
      _id: makeId(),
      dayName: {
        he: 'שישי',
        eng: 'Friday',
      },
      extra: null,

      times: {
        pool: [
          {
            from: '06:00',
            to: isJulyOrAugust ? '18:00' : '17:00',
          },
        ],
        gym: [
          {
            from: '06:00',
            to: '16:00',
          },
        ],
      },
    },
    {
      _id: makeId(),
      dayName: {
        he: 'שבת',
        eng: 'Saturday',
      },
      extra: null,

      times: {
        pool: [
          {
            from: '08:00',
            to: isJulyOrAugust ? '18:00' : '17:00',
          },
        ],
        gym: [
          {
            from: '08:00',
            to: '16:00',
          },
        ],
      },
    },
  ]
}
