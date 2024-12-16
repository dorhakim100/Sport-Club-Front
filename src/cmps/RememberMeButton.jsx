import { useSelector } from 'react-redux'
import { setIsRemember } from '../store/actions/user.actions'

export function RememberMeButton() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const isRemember = useSelector(
    (stateSelector) => stateSelector.userModule.isRemember
  )
  const setRemember = () => {
    if (isRemember) {
      setIsRemember(false)
    } else {
      setIsRemember(true)
    }
  }
  return (
    <div className='checkbox-container' style={{ marginTop: '1em' }}>
      <input
        type='checkbox'
        name=''
        id='isRemember'
        checked={isRemember}
        onChange={setRemember}
      />
      <label htmlFor='isRemember'>
        {prefs.isEnglish ? 'Remember me' : 'זכור משתמש'}
      </label>
    </div>
  )
}
