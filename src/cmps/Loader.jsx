import { useSelector } from 'react-redux'

import loaderSvg from '../../public/imgs/swimming.gif' // Adjust the path according to your project structure

export function Loader() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const isLoading = useSelector(
    (storeState) => storeState.systemModule.isLoading
  )
  return (
    isLoading && (
      <div className='loader-container'>
        <img
          src={loaderSvg}
          alt=''
          style={{
            transform: prefs.isEnglish ? '' : 'scaleX(-1)',
            display: 'block',
          }}
        />
      </div>
    )
  )
}
