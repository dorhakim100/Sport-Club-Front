import * as React from 'react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

export function ItemOptions({ options, setItemOption }) {
  const [alignment, setAlignment] = useState()

  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment)
    setItemOption(newAlignment)
  }

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label='text alignment'
      sx={{
        direction: 'ltr',
      }}
    >
      {options.map((option) => {
        return (
          <ToggleButton
            value={option.id}
            aria-label='left aligned'
            key={option.id + 'Toggle'}
            sx={{
              // Common dark mode styling
              ...(prefs.isDarkMode && {
                color: 'white',
                borderColor: '#181e24',
              }),
              // Styling for the active (selected) state
              '&.Mui-selected': {
                // backgroundColor: prefs.isDarkMode ? 'grey.800' : 'grey.300',
                color: prefs.isDarkMode ? 'primary.main' : 'primary.main',
                '&:hover': {
                  //   backgroundColor: prefs.isDarkMode ? 'grey.700' : 'grey.200',
                },
              },
            }}
          >
            {prefs.isEnglish ? option.title.eng : option.title.he}
          </ToggleButton>
        )
      })}
    </ToggleButtonGroup>
  )
}
