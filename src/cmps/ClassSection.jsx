import { useSelector } from 'react-redux'

export function ClassSection({ clas }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  return (
    <div className='class-section-container'>
      <b>{prefs.isEnglish ? clas.title.eng : clas.title.he}</b>
    </div>
  )
}
