import { useState } from 'react'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import { paymentService } from '../services/payment/payment.service'
import { showErrorMsg } from '../services/event-bus.service'

function monthRangeDefaults() {
  const now = dayjs()
  return {
    start: now.startOf('month'),
    end: now.endOf('month'),
  }
}

export function EarningsBanner() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const defaults = monthRangeDefaults()
  const [from, setFrom] = useState(defaults.start)
  const [to, setTo] = useState(defaults.end)
  const [earnings, setEarnings] = useState(null)
  const [loading, setLoading] = useState(false)

  const labels = prefs.isEnglish
    ? {
        title: 'Earnings',
        from: 'From: ',
        to: 'To: ',
        calculate: 'Calculate',
        result: 'Total',
      }
    : {
        title: 'הכנסות',
        from: 'מתאריך: ',
        to: 'עד תאריך: ',
        calculate: 'חשב',
        result: 'סה״כ',
      }

  async function handleCalculate() {
    if (!from || !to) {
      showErrorMsg(
        prefs.isEnglish ? 'Please select both dates' : 'נא לבחור את שתי התאריכים'
      )
      return
    }
    if (from.isAfter(to)) {
      showErrorMsg(
        prefs.isEnglish
          ? 'Start date must be before end date'
          : 'תאריך ההתחלה חייב להיות לפני תאריך הסיום'
      )
      return
    }

    try {
      setLoading(true)
      const fromStr = from.startOf('day').format('YYYY-MM-DD')
      const toStr = to.endOf('day').format('YYYY-MM-DD')
      const value = await paymentService.getEarnings({
        from: fromStr,
        to: toStr,
      })
      setEarnings(Number.isFinite(value) ? value : 0)
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish
          ? `Couldn't load earnings`
          : 'לא היה ניתן לטעון הכנסות'
      )
    } finally {
      setLoading(false)
    }
  }

  const pickerSx = {
    direction: prefs.isEnglish ? 'ltr' : 'rtl',
    '& .MuiInputBase-input': {
      color: prefs.isDarkMode ? 'white' : undefined,
    },
    '& .MuiIconButton-root': {
      color: prefs.isDarkMode ? 'white' : undefined,
    },
  }

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        direction: prefs.isEnglish ? 'ltr' : 'rtl',      }}
        className={`earnings-banner ${prefs.isDarkMode ? 'dark-mode' : ''}`}
    >
      <Typography variant='subtitle1' sx={{ mb: 1.5, fontWeight: 600 }}>
        {labels.title}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          gap={1}
          alignItems={{ sm: 'center' }}
          flexWrap='wrap'
        >
          <DatePicker
            label={labels.from}
            value={from}
            onChange={(v) => setFrom(v)}
            format='DD/MM/YYYY'
            sx={pickerSx}
          />
          <DatePicker
            label={labels.to}
            value={to}
            onChange={(v) => setTo(v)}
            format='DD/MM/YYYY'
            sx={pickerSx}
          />
          <Button
            variant='contained'
            onClick={handleCalculate}
            disabled={loading}
            sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
          >
            {labels.calculate}
          </Button>
          {earnings !== null && (
            <Box sx={{ minWidth: 120 }}>
              <Typography variant='body2' color={prefs.isDarkMode ? 'white' : 'text.secondary'}>
                {labels.result}
              </Typography>
              <Typography variant='h6' component='span'>
                {earnings.toLocaleString(prefs.isEnglish ? 'en-IL' : 'he-IL', { style: 'currency', currency: 'ILS' })}
              </Typography>
            </Box>
          )}
        </Stack>
      </LocalizationProvider>
    </Paper>
  )
}
