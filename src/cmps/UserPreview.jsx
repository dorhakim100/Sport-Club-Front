import React from 'react'
import { useNavigate } from 'react-router-dom'
import { smoothScroll } from '../services/util.service'

const emptyProfile =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'

export function UserPreview({ user }) {
  console.log(user)
  const navigate = useNavigate()

  const navigateToUser = (event) => {
    event.preventDefault() // Stop the link from navigating immediately
    smoothScroll()

    setTimeout(() => {
      navigate(`/user/${user._id}`)
    }, 300) // Adjust time based on your smoothScroll timing
  }
  return (
    <div className={`list-item-container user`} onClick={navigateToUser}>
      <div className='img-container'>
        <img src={user.imgUrl || emptyProfile} alt='' />
      </div>
      <b>{user.fullname}</b>
    </div>
  )
}
