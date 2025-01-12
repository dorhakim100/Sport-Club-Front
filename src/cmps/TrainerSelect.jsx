import * as React from 'react'
import { useState, useEffect } from 'react'
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

export function TrainerSelect({
  prefs,
  trainers,
  editClass,
  setEditClass,
  editOccur,
  setEditOccur,
  id,
  occur,
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

  const [selectedTrainer, setSelectedTrainer] = useState('')

  const handleChange = (event) => {
    const trainerToSet = event.target.value

    setTrainerToClass(trainerToSet)
  }

  const setTrainerToClass = (trainerToSet) => {
    const idx = editClass.occurrences.findIndex(
      (occurrence) => occurrence.id === occur.id
    )

    const newOccur = {
      ...occur,
      trainer: { id: trainerToSet._id, name: trainerToSet.name },
    }

    editClass.occurrences.splice(idx, 1, newOccur)

    setSelectedTrainer(trainerToSet)

    const classToSet = { ...editClass }
    setEditClass(classToSet)
  }
  useEffect(() => {
    const trainerToSet = trainers.find(
      (trainer) => trainer._id === occur.trainer.id
    )
    setSelectedTrainer(trainerToSet)
  }, [occur])

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
          }}
          required
        >
          <InputLabel id='trainer'>
            {prefs.isEnglish ? 'Trainer' : 'מדריך'}
          </InputLabel>
          <Select
            labelId='trainer'
            id='trainer'
            onChange={handleChange}
            value={selectedTrainer}
            MenuProps={{
              disableScrollLock: true, // This prevents adding padding and overflow to the body
            }}
          >
            {trainers.map((trainer) => {
              return (
                <MenuItem
                  key={`${trainer._id}Select`}
                  value={trainer}
                  sx={{
                    textAlign: prefs.isEnglish ? 'left' : 'right',
                    display: 'flex',
                    justifyContent: prefs.isEnglish ? 'flex-start' : 'flex-end',
                  }}
                >
                  <em>
                    {prefs.isEnglish ? trainer.name.eng : trainer.name.he}
                  </em>
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </ThemeProvider>
    </CacheProvider>
  )
}
