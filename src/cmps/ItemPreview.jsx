import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function ItemPreview({ item }) {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  return (
    <article className='preview'>
      <header>
        <Link to={`/item/${item._id}`}>
          {prefs.isEnglish ? item.title.eng : item.title.he}
        </Link>
      </header>
    </article>
  )
}
