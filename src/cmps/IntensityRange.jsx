import { useSelector } from 'react-redux'

export function IntensityRange({ intensity, handleChange, isReadOnly }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  return (
    <div className='intensity-slider'>
      <input
        className={
          prefs.isEnglish
            ? `intensity-range ltr ${isReadOnly ? 'read-only' : ''}`
            : `intensity-range ${isReadOnly ? 'read-only' : ''}`
        }
        type='range'
        onChange={handleChange}
        value={intensity}
        min='1'
        max='5'
        step='1'
        readOnly={isReadOnly}
        name='intensity'
      />
      <div className='intensity-labels'>
        <>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </>
      </div>
    </div>
  )
}
