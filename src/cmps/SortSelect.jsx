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

export function SortSelect({ prefs, filterToEdit, setFilterToEdit }) {
  const theme = createTheme({ direction: prefs.isEnglish ? 'ltr' : 'rtl' })
  // const theme = (outerTheme) =>
  //   createTheme({
  //     direction: 'rtl',
  //     palette: {
  //       mode: outerTheme.palette.mode,
  //     },
  //   })
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
    setFilterToEdit({ ...filterToEdit, sortDir })
  }

  // Create theme based on language preference
  // const theme = createTheme({
  //   direction: prefs.isEnglish ? 'ltr' : 'rtl',
  //   // Add other theme customization here if needed
  // })

  return (
    <CacheProvider value={prefs.isEnglish ? cacheLtr : cacheRtl}>
      <ThemeProvider theme={theme}>
        <FormControl variant='filled' sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id='sort'>
            {prefs.isEnglish ? 'Price' : 'מחיר'}
          </InputLabel>
          <Select
            labelId='sort'
            id='sort'
            onChange={handleChange}
            value={filterToEdit.sortDir}
          >
            <MenuItem value=''>
              <em>{prefs.isEnglish ? 'None' : 'איפוס'}</em>
            </MenuItem>
            <MenuItem value={1}>
              {prefs.isEnglish ? 'Low to High' : 'מהנמוך לגבוה'}
            </MenuItem>
            <MenuItem value={-1}>
              {prefs.isEnglish ? 'High to Low' : 'מהגבוה לנמוך'}
            </MenuItem>
          </Select>
        </FormControl>
      </ThemeProvider>
    </CacheProvider>
  )
}
