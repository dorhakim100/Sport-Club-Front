import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { CircularProgress } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'

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

  const theme = useMemo(
    () =>
      createTheme({
        direction: prefs.isEnglish ? 'ltr' : 'rtl',
        palette: {
          mode: prefs.isDarkMode ? 'dark' : 'light',
          primary: {
            main: prefs.isDarkMode ? '#90caf9' : '#1976d2',
          },
          secondary: {
            main: prefs.isDarkMode ? '#f48fb1' : '#f50057',
          },
          background: {
            default: prefs.isDarkMode ? '#121212' : '#ffffff',
            paper: prefs.isDarkMode ? '#1d1d1d' : '#f5f5f5',
          },
          text: {
            primary: prefs.isDarkMode ? '#ffffff' : '#000000',
            secondary: prefs.isDarkMode ? '#b0bec5' : '#424242',
          },
        },
      }),
    [prefs.isEnglish, prefs.isDarkMode]
  )

  const cacheRtl = useMemo(
    () =>
      createCache({
        key: 'muirtl-earnings',
        stylisPlugins: [prefixer, rtlPlugin],
      }),
    []
  )

  const cacheLtr = useMemo(
    () =>
      createCache({
        key: 'muiltr-earnings',
        stylisPlugins: [prefixer],
      }),
    []
  )

  useEffect(() => {
    handleCalculate()
  }, [])

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
    } catch {
      showErrorMsg(
        prefs.isEnglish
          ? `Couldn't load earnings`
          : 'לא היה ניתן לטעון הכנסות'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        direction: prefs.isEnglish ? 'ltr' : 'rtl',
      }}
      className={`earnings-banner ${prefs.isDarkMode ? 'dark-mode' : ''}`}
    >
      <Typography variant='subtitle1' sx={{ mb: 1.5, fontWeight: 600 }}>
        {labels.title}
      </Typography>
      <CacheProvider value={prefs.isEnglish ? cacheLtr : cacheRtl}>
        <ThemeProvider theme={theme}>
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
              />
              <DatePicker
                label={labels.to}
                value={to}
                onChange={(v) => setTo(v)}
                format='DD/MM/YYYY'
              />
              <Button
                variant='contained'
                onClick={handleCalculate}
                disabled={loading}
                sx={{
                  alignSelf: { xs: 'stretch', sm: 'center' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  minWidth: '100px',
                }}
              >
                {labels.calculate}
                {loading ? (
                  <CircularProgress size={15} color='inherit' />
                ) : (
                  <LocalAtmIcon />
                )}
              </Button>
              {earnings !== null && (
                <Box sx={{ minWidth: 120 }}>
                  <Typography variant='body2' color='text.secondary'>
                    {labels.result}
                  </Typography>
                  <Typography variant='h6' component='span'>
                    {earnings.toLocaleString(
                      prefs.isEnglish ? 'en-IL' : 'he-IL',
                      { style: 'currency', currency: 'ILS' }
                    )}
                  </Typography>
                </Box>
              )}
            </Stack>
          </LocalizationProvider>
        </ThemeProvider>
      </CacheProvider>
    </Paper>
  )
}
