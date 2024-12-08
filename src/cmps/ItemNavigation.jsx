import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import IconButton from '@mui/material/IconButton'

export function ItemNavigation({ item, type, lastPage }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const navigate = useNavigate()

  return (
    <div className='navigation-container' style={{ direction: 'ltr' }}>
      <IconButton
        aria-label='delete'
        onClick={() => {
          navigate(lastPage)
        }}
      >
        <KeyboardReturnIcon sx={{ color: prefs.isDarkMode && 'white' }} />
      </IconButton>

      {user && user.isAdmin && (
        <Link to={`/${type}/edit/${item._id}`} className='link'>
          {prefs.isEnglish ? 'Edit' : 'עריכה'}
        </Link>
      )}
      <ButtonGroup variant='contained' aria-label='Basic button group'>
        <Link
          to={
            prefs.isEnglish
              ? `/${type}/${item.prevNext.prev}`
              : `/${type}/${item.prevNext.next}`
          }
        >
          <Button>
            <NavigateBeforeIcon></NavigateBeforeIcon>
          </Button>
        </Link>
        <Link
          to={
            prefs.isEnglish
              ? `/${type}/${item.prevNext.next}`
              : `/${type}/${item.prevNext.prev}`
          }
        >
          <Button>
            <NavigateNextIcon></NavigateNextIcon>
          </Button>
        </Link>
      </ButtonGroup>
    </div>
  )
}
