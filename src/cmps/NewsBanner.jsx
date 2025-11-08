import { useMemo, useState, useEffect } from 'react'

import { useSelector } from 'react-redux'

import Marquee from 'react-fast-marquee'

import { setIsLoading } from '../store/actions/system.actions'
import { loadUpdates } from '../store/actions/update.actions'
import { showErrorMsg } from '../services/event-bus.service'

import { PlayButton } from './PlayButton'

import Divider from '@mui/material/Divider'

import newsBannerJson from '../../public/jsons/NewsBanner/news-banner.json'
import { updateService } from '../services/update/update.service'

export function NewsBanner() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const isScrolled = useSelector(
    (stateSelector) => stateSelector.systemModule.isScrolled
  )

  const updates = useSelector(
    (stateSelector) => stateSelector.updateModule.updates
  )

  const [isPlaying, setIsPlaying] = useState(true)

  const [updatesText, setUpdatesText] = useState('')

  const direction = useMemo(() => {
    return 'right'
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

  const getUpdatesText = async () => {
    if (!updates || updates.length === 0) {
      try {
        setIsLoading(true)
        await loadUpdates(updateService.getDefaultFilter())
      } catch (err) {
        showErrorMsg(prefs.isEnglish ? 'No updates found' : 'אין עדכונים')
        return
      } finally {
        setIsLoading(false)
      }
      return ''
    }

    const updatesText = updates.reverse().map((update) => {
      return `${new Date(update.createdAt).toLocaleDateString('he')} - ${
        update.title
      } - ${update.content}`
    })

    setUpdatesText(updatesText.join(' | '))
  }
  useEffect(() => {
    getUpdatesText()
  }, [updates, prefs.isEnglish])

  return (
    <div
      className={`news-banner ${prefs.isEnglish ? 'ltr' : 'rtl'} ${
        isScrolled ? 'scrolled' : ''
      } ${prefs.isDarkMode ? 'dark-mode' : ''}`}
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
          {updatesText}
        </Marquee>
      </div>
    </div>
  )
}
