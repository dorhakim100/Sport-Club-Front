import { useMemo, useState } from 'react'

import { useSelector } from 'react-redux'

import Marquee from 'react-fast-marquee'

import { PlayButton } from './PlayButton'

import Divider from '@mui/material/Divider'

import newsBannerJson from '../../public/jsons/NewsBanner/news-banner.json'

export function NewsBanner() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const isScrolled = useSelector(
    (stateSelector) => stateSelector.systemModule.isScrolled
  )

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
    <div
      className={`news-banner ${prefs.isEnglish ? 'ltr' : 'rtl'} ${
        isScrolled ? 'scrolled' : ''
      }`}
    >
      <PlayButton isPlaying={isPlaying} onClick={togglePlaying} />
      <h2 className="title">
        {newsBannerJson.title[prefs.isEnglish ? 'eng' : 'he']}
      </h2>
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
