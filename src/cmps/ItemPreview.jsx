import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import picture from '../../public/imgs/picture.jpg'

export function ItemPreview({ item }) {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  return (
    <article className='preview'>
      <Link to={`/item/${item._id}`}>
        {prefs.isEnglish ? item.title.eng : item.title.he}
      </Link>
      <div className='img-container'>
        <img src={picture} alt='' />
      </div>
    </article>
  )
}
