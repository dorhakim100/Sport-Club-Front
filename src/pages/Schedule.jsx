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

    printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        <style>

        @page {
          size: A4 landscape; /* Use A4 landscape size */
          margin: 0; /* Remove default browser margins */
        }

        .schedule-container {
          page-break-inside: avoid;
        }
        .day-container {
          page-break-inside: avoid; 
        }

        .schedule-container {
          gap: 0; 
          padding: 0;
        }
        .day-container {
          padding: 2px;
          margin: 0;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        /* All the above so the schedule will fit in only one page */
      
        /* Add styles for the printed content */
        .schedule-container{
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          justify-items:'center';
          align-items:'center';
          max-width: 297mm; 
          direction:${prefs.isEnglish ? 'ltr' : 'rtl'};
          text-align:'center';
          margin:20px
        }
        .day-container {
          border: 1px solid #ccc;
          padding: 3px;
          box-sizing: border-box;
          text-align:'center';
        }
        
        .hour-container {
          border-bottom: 1px solid #ddd;
          margin-bottom: 8px;
          padding: 3px;
          box-sizing: border-box;
          text-align:'center';
        }
        
        .occurrence-container {
          display: flex;
          flex-direction: column;
          gap: 5px;
          text-align:'center';
        }
        
        b {
          font-size: 14px;
          margin-bottom: 5px;
          text-align:'center';
        }
        
        .time-container {
          font-size: 12px;
          text-align:'center';
        }

        
        /* Hide icons completely for printing */
        .icon {
          width:5mm;
        }
      </style>
      
      </head>
      <body>
        ${schedule.outerHTML}
      </body>
    </html>
  `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()

    printWindow.close()
  }

  // const download = `
  //   <html>
  //     <head>
  //       <title>Print</title>
  //       <style>

  //       @page {
  //         size: A4 landscape; /* Use A4 landscape size */
  //         margin: 0; /* Remove default browser margins */
  //       }

  //       .schedule-container {
  //         page-break-inside: avoid;
  //       }
  //       .day-container {
  //         page-break-inside: avoid;
  //       }

  //       .schedule-container {
  //         gap: 0;
  //         padding: 0;
  //       }
  //       .day-container {
  //         padding: 2px;
  //         margin: 0;
  //       }
  //       body {
  //         font-family: Arial, sans-serif;
  //         margin: 0;
  //         padding: 0;
  //       }
  //       /* All the above so the schedule will fit in only one page */

  //       /* Add styles for the printed content */
  //       .schedule-container{
  //         display: grid;
  //         grid-template-columns: repeat(6, 1fr);
  //         justify-items:'center';
  //         align-items:'center';
  //         max-width: 297mm;
  //         direction:${prefs.isEnglish ? 'ltr' : 'rtl'};
  //         text-align:'center';
  //         margin:20px
  //       }
  //       .day-container {
  //         border: 1px solid #ccc;
  //         padding: 3px;
  //         box-sizing: border-box;
  //         text-align:'center';
  //       }

  //       .hour-container {
  //         border-bottom: 1px solid #ddd;
  //         margin-bottom: 8px;
  //         padding: 3px;
  //         box-sizing: border-box;
  //         text-align:'center';
  //       }

  //       .occurrence-container {
  //         display: flex;
  //         flex-direction: column;
  //         gap: 5px;
  //         text-align:'center';
  //       }

  //       b {
  //         font-size: 14px;
  //         margin-bottom: 5px;
  //         text-align:'center';
  //       }

  //       .time-container {
  //         font-size: 12px;
  //         text-align:'center';
  //       }

  //       /* Hide icons completely for printing */
  //       .icon {
  //         width:5mm;
  //       }
  //     </style>

  //     </head>
  //     <body>
  //       ${el.outerHTML}
  //     </body>
  //   </html>
  // `

  // const onDownloadSchedule = async () => {
  //   const el = scheduleRef.current

  //   if (!el) return
  //   await document.fonts.ready
  //   el.classList.add('light‑mode‑pdf')

  //   // 1. Save original styles
  //   const origOverflowX = el.style.overflowX
  //   const origWidth = el.style.width

  //   // 2. Expand to full content
  //   el.style.overflowX = 'visible'
  //   el.style.width = `${el.scrollWidth}px`

  //   el.style.height = '850px'

  //   // 3. Snapshot the full-width element
  //   const canvas = await html2canvas(el, { scale: 3, backgroundColor: '#fff' })

  //   // 4. Restore original styles
  //   el.style.overflowX = origOverflowX
  //   el.style.width = origWidth
  //   el.classList.remove('light‑mode‑pdf')

  //   // 5. Build PDF as before
  //   const imgData = canvas.toDataURL('image/jpeg', 0.98)
  //   const pdf = new jsPDF({
  //     orientation: 'landscape',
  //     unit: 'mm',
  //     format: 'a4',
  //   })
  //   const imgProps = pdf.getImageProperties(imgData)
  //   const pdfWidth = pdf.internal.pageSize.getWidth()
  //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

  //   pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
  //   pdf.save('schedule.pdf')
  // }

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
    el.classList.add('light‑mode‑pdf')

    // save original inline styles
    const orig = {
      overflowX: el.style.overflowX,
      width: el.style.width,
      height: el.style.height,
      minHeight: el.style.minHeight,
      maxHeight: el.style.maxHeight,
    }

    // force full width & 850px height
    const targetW = el.scrollWidth
    let targetH

    windowDimensions.width > 600 ? (targetH = 1200) : (targetH = 850)

    el.style.overflowX = 'visible'
    el.style.width = `${targetW}px`
    el.style.height = `${targetH}px`
    el.style.minHeight = `${targetH}px`
    el.style.maxHeight = 'none'

    // snapshot with forced “desktop” window size
    const canvas = await html2canvas(el, {
      scale: 3,
      backgroundColor: '#fff',
      // trick html2canvas into a large viewport:
      // width: targetW,
      height: targetH,

      windowHeight: targetH,
    })

    // restore
    Object.assign(el.style, orig)
    el.classList.remove('light‑mode‑pdf')

    // build PDF
    const imgData = canvas.toDataURL('image/jpeg', 0.98)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })
    const props = pdf.getImageProperties(imgData)
    const pdfW = pdf.internal.pageSize.getWidth()
    const pdfH = (props.height * pdfW) / props.width

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH)
    const now = new Date()

    const monthYear = prefs.isEnglish
      ? `Schedule - ${now.toLocaleString('en-US', {
          month: 'long',
        })} ${now.getFullYear()}`
      : `מערכת החוגים - ${now.toLocaleString('he-IL', {
          month: 'long',
        })} ${now.getFullYear()}`

    pdf.save(`${monthYear}.pdf`)
  }

  return (
    <section className='schedule'>
      <h2>{prefs.isEnglish ? 'Class' : 'שיעורים'}</h2>
      <Nav origin={origin} links={links} />

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
          <Button variant='contained' onClick={onDownloadSchedule}>
            {prefs.isEnglish ? 'Download' : 'הורדה'}
            <DownloadIcon />
          </Button>
        </div>
        <div className='print-container'>
          <Button variant='contained' onClick={onPrintSchedule}>
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
            <div className='day-container' key={`${makeId()}${day}`}>
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
                        <div className='icon'>
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
