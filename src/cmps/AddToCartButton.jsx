import { useNavigate, useParams } from 'react-router-dom'
import { userService } from '../services/user/user.service'
import { ItemPreview } from './ItemPreview'
import { useSelector } from 'react-redux'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'

export function AddToCartButton({ item }) {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  function shouldShowActionBtns(item) {
    const user = userService.getLoggedinUser()

    if (!user) return false
    if (user.isAdmin) return true
    // return item.owner?._id === user._id
  }

  return (
    (shouldShowActionBtns(item) && (
      <ButtonGroup
        variant='contained'
        aria-label='Basic button group'
        style={{ direction: 'ltr' }}
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
    )
  )
}
