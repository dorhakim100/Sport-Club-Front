import { useMemo, useState } from 'react'

import { useSelector } from 'react-redux'

import Marquee from 'react-fast-marquee'

import { PlayButton } from '../PlayButton/PlayButton'

import Divider from '@mui/material/Divider'

export function NewsBanner() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const [isPlaying, setIsPlaying] = useState(true)

  const direction = useMemo(() => {
    return prefs.isEnglish ? 'left' : 'right'
  }, [prefs.isEnglish])

  const setPlaying = () => {
    setIsPlaying(true)
  }

  const setPaused = () => {
    setIsPlaying(false)
  }

  const togglePlaying = () => {
    setIsPlaying((prevState) => !prevState)
  }

  return (
    <div className={`news-banner ${prefs.isEnglish ? 'ltr' : 'rtl'}`}>
      <PlayButton isPlaying={isPlaying} onClick={togglePlaying} />
      <h2 className="title">bla bla bla</h2>
      <Divider orientation="vertical" flexItem className="divider" />
      <div
        className="message-container"
        onMouseEnter={setPaused}
        onMouseLeave={setPlaying}
      >
        <Marquee
          direction={direction}
          className={`message ${direction}`}
          play={isPlaying}
        >
          bla bla bla
        </Marquee>
      </div>
    </div>
  )
}
