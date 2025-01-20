import { useSelector } from 'react-redux'

export function HeadContainer({ text }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const langText = prefs.isEnglish ? text.eng : text.he

  return (
    <div className={`head-container ${prefs.isDarkMode ? 'dark-mode' : ''}`}>
      <h3>
        <span
          style={
            prefs.isDarkMode
              ? { backgroundColor: '#2C3E50' }
              : { backgroundColor: '#F5F5F5' }
          }
        >
          {langText}
        </span>
      </h3>
    </div>
  )
}
