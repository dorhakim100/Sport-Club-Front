import { useNavigate, useParams } from 'react-router-dom'
import { userService } from '../services/user/user.service'
import { ItemPreview } from './ItemPreview'
import { useSelector } from 'react-redux'

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

  return (
    <section>
      <ul
        className={
          isGrid ? 'items-list-container grid' : 'items-list-container'
        }
      >
        {items.map((item) => (
          <li key={item._id} className='item-container'>
            <ItemPreview item={item} />
            <div className='actions' style={{ direction: 'ltr' }}>
              <AddToCartButton item={item} />
              {/* {(shouldShowActionBtns(item) && (
                <ButtonGroup
                  variant='contained'
                  aria-label='Basic button group'
                >
                  <Button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                      navigate(`/item/edit/${item._id}`)
                    }}
                  >
                    Edit
                  </Button>
                  <Button onClick={() => onRemoveItem(item._id)}>Remove</Button>
                </ButtonGroup>
              )) || (
                <Button variant='contained'>
                  {prefs.isEnglish ? 'Add To Cart' : 'הוסף לעגלה'}
                </Button>
              )} */}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
