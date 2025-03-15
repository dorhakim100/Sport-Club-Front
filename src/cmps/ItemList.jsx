import { useNavigate } from 'react-router-dom'
import { userService } from '../services/user/user.service'
import { ItemPreview } from './ItemPreview'
import { useSelector } from 'react-redux'
import { useState } from 'react'

import { smoothScroll } from '../services/util.service'

import { AddToCartButton } from './AddToCartButton'

export function ItemList({ items, onRemoveItem, isGrid }) {
  const navigate = useNavigate()
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const [isHover, setIsHover] = useState(false)

  const setIsHoverTrue = () => {
    setIsHover(true)
  }
  const setIsHoverFalse = () => {
    setIsHover(false)
  }

  const handleClick = (e) => {
    // support for safari browsers
    e.preventDefault() // Stop the link from navigating immediately
    const itemId = e.currentTarget.dataset.id

    if (e.target.closest('.add-to-cart-btn') || e.target.closest('.edit-btn')) {
      e.stopPropagation()
      return
    }
    if (isHover) return
    setTimeout(() => {
      navigate(`/item/${itemId}`)
    }, 300) // Adjust time based on your smoothScroll timing
    smoothScroll()
  }

  return (
    <section>
      <ul
        className={
          isGrid ? 'items-list-container grid' : 'items-list-container'
        }
      >
        {items.map((item) => (
          <li
            key={item._id}
            data-id={item._id}
            className={`item-container ${prefs.isDarkMode ? 'dark-mode' : ''}`}
            onClick={handleClick}
          >
            <ItemPreview item={item} />
            <div
              className='actions'
              style={{ direction: 'ltr' }}
              onMouseEnter={setIsHoverTrue}
              onMouseLeave={setIsHoverFalse}
            >
              <AddToCartButton item={item} onRemoveItem={onRemoveItem} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
