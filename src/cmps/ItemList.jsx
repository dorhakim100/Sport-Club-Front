import { useNavigate, useParams } from 'react-router-dom'
import { userService } from '../services/user/user.service'
import { ItemPreview } from './ItemPreview'
import { useSelector } from 'react-redux'
import { useState } from 'react'

import { smoothScroll } from '../services/util.service'

import { AddToCartButton } from './AddToCartButton'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'

export function ItemList({ items, onRemoveItem, onUpdateItem, isGrid }) {
  const navigate = useNavigate()
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  function shouldShowActionBtns(item) {
    const user = userService.getLoggedinUser()

    if (!user) return false
    if (user.isAdmin) return true
    // return item.owner?._id === user._id
  }

  const [isHover, setIsHover] = useState(false)

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
            className='item-container'
            onClick={(e) => {
              if (
                e.target.closest('.add-to-cart-btn') ||
                e.target.closest('.edit-btn')
              ) {
                e.stopPropagation()
                return
              }
              if (isHover) return
              navigate(`/item/${item._id}`)
              smoothScroll()
            }}
          >
            <ItemPreview item={item} />
            <div
              className='actions'
              style={{ direction: 'ltr' }}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              <AddToCartButton item={item} onRemoveItem={onRemoveItem} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
