import { useSelector } from 'react-redux'

import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import PlaceIcon from '@mui/icons-material/Place'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import MailIcon from '@mui/icons-material/Mail'

export function AppFooter() {
  const count = useSelector((storeState) => storeState.userModule.count)

  const address = 'קרן היסוד 19, כפר שמריהו'
  const phone = '09-958-0404'
  const email = 'service.kfar@gmail.com'
  const rights = `כל הזכויות שמורות למועדון הספורט כפר שמריהו`

  return (
    <footer className='app-footer full'>
      <div className='contact-container'>
        <div className='method-container address'>
          <PlaceIcon />
          <span>{address}</span>
        </div>
        <div className='method-container phone'>
          <LocalPhoneIcon />
          <span>{phone}</span>
        </div>
        <div className='method-container email'>
          <MailIcon />
          <span>{email}</span>
        </div>
      </div>
      <div className='links-container'>
        <div className='facebook-container'>
          <FacebookIcon />
        </div>
        <div className='instagram-container'>
          <InstagramIcon />
        </div>
      </div>
      <span>{rights} &copy; 2024</span>
    </footer>
  )
}
