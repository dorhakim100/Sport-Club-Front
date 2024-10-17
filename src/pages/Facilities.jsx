import { useSelector } from 'react-redux'

export function Facilities() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  return (
    <section className='facilities-container'>
      <h2> {prefs.isEnglish ? 'Facilities' : 'מתקני המועדון'}</h2>
    </section>
  )
}
