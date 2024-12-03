import * as React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import rtlPlugin from 'stylis-plugin-rtl'
import { prefixer } from 'stylis'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

// Consuming the outer theme is only required with coexisting themes, like in this documentation.
// If your app/website doesn't deal with this, you can have just:

export function SortSelect({
  prefs,
  filterToEdit,
  setFilterToEdit,
  isMessages,
}) {
  const theme = createTheme({
    direction: prefs.isEnglish ? 'ltr' : 'rtl',
    palette: {
      mode: prefs.isDarkMode ? 'dark' : 'light', // Switch between light and dark mode
      primary: {
        main: prefs.isDarkMode ? '#90caf9' : '#1976d2', // Blue for light mode, lighter blue for dark mode
      },
      secondary: {
        main: prefs.isDarkMode ? '#f48fb1' : '#f50057', // Pink variations for light and dark mode
      },
      background: {
        default: prefs.isDarkMode ? '#121212' : '#ffffff', // Dark background for dark mode, white for light
        paper: prefs.isDarkMode ? '#1d1d1d' : '#f5f5f5', // Paper background for elements
      },
      text: {
        primary: prefs.isDarkMode ? '#ffffff' : '#000000', // White text in dark mode, black text in light mode
        secondary: prefs.isDarkMode ? '#b0bec5' : '#424242', // Gray for secondary text
      },
    },
  })
  // Create RTL cache
  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  })

  // Create LTR cache
  const cacheLtr = createCache({
    key: 'muiltr',
    stylisPlugins: [prefixer], // Only prefixer, no RTL plugin
  })

  const handleChange = (event) => {
    const sortDir = event.target.value
    setFilterToEdit({ ...filterToEdit, sortDir, pageIdx: 0 })
  }

  // Create theme based on language preference
  // const theme = createTheme({
  //   direction: prefs.isEnglish ? 'ltr' : 'rtl',
  //   // Add other theme customization here if needed
  // })

  return (
    <CacheProvider value={prefs.isEnglish ? cacheLtr : cacheRtl}>
      <ThemeProvider theme={theme}>
        <FormControl
          variant='filled'
          sx={{
            m: 1,
            minWidth: '100%',
            maxWidth: '150px',
            margin: '0',
            justifySelf: 'end',
            alignSelf: 'start',
            textAlign: 'start',
            gridColumn: '2/4',
          }}
        >
          <InputLabel id='sort'>{prefs.isEnglish ? 'Sort' : 'מיון'}</InputLabel>
          <Select
            labelId='sort'
            id='sort'
            onChange={handleChange}
            value={filterToEdit.sortDir}
            MenuProps={{
              disableScrollLock: true, // This prevents adding padding and overflow to the body
            }}
          >
            <MenuItem
              value=''
              sx={{
                textAlign: prefs.isEnglish ? 'left' : 'right',
                display: 'flex',
                justifyContent: prefs.isEnglish ? 'flex-start' : 'flex-end',
              }}
            >
              <em>{prefs.isEnglish ? 'None' : 'איפוס'}</em>
            </MenuItem>
            <MenuItem
              value={1}
              sx={{
                textAlign: prefs.isEnglish ? 'left' : 'right',
                display: 'flex',
                justifyContent: prefs.isEnglish ? 'flex-start' : 'flex-end',
              }}
            >
              {isMessages
                ? prefs.isEnglish
                  ? 'Newest'
                  : 'החדשים'
                : prefs.isEnglish
                ? 'Low to High'
                : 'מהנמוך לגבוה'}
            </MenuItem>
            <MenuItem
              value={-1}
              sx={{
                textAlign: prefs.isEnglish ? 'left' : 'right',
                display: 'flex',
                justifyContent: prefs.isEnglish ? 'flex-start' : 'flex-end',
              }}
            >
              {isMessages
                ? prefs.isEnglish
                  ? 'Oldest'
                  : 'הישנים'
                : prefs.isEnglish
                ? 'High to Low'
                : 'מהגבוה לנמוך'}
            </MenuItem>
          </Select>
        </FormControl>
      </ThemeProvider>
    </CacheProvider>
  )
}
