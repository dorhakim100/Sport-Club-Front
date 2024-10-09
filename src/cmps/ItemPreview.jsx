import { Link } from 'react-router-dom'

export function ItemPreview({ item }) {
  return (
    <article className='preview'>
      <header>
        <Link to={`/item/${item._id}`}>{item.vendor}</Link>
      </header>

      <p>
        Speed: <span>{item.speed.toLocaleString()} Km/h</span>
      </p>
      {item.owner && (
        <p>
          Owner: <span>{item.owner.fullname}</span>
        </p>
      )}
    </article>
  )
}
