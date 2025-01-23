import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { smoothScroll } from '../services/util.service'
import { Preloader } from './Preloader'

export function ItemPreview({ item }) {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const user = useSelector((storeState) => storeState.userModule.user)

  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true)
    }
  }, [])

  const navigateToItem = () => {
    // support for safari browsers
    event.preventDefault() // Stop the link from navigating immediately
    smoothScroll()

    setTimeout(() => {
      navigate(`/item/${item._id}`)
    }, 300) // Adjust time based on your smoothScroll timing
  }

  return (
    <article className='preview'>
      <Link
        onClick={navigateToItem}
        to={`/item/${item._id}`}
        className={prefs.isDarkMode ? 'dark-mode' : ''}
      >
        {prefs.isEnglish ? item.title.eng : item.title.he}
      </Link>
      {/* {user && user.isAdmin && typeof item.quantity === 'number' && ( */}

      <div className={'price-container'}>
        <span>₪{item.price}</span>
      </div>

      {/* )} */}
      <div className='img-container'>
        {!isLoaded && <Preloader img={item.cover} />}
        <img
          src={item.cover}
          alt=''
          onLoad={() => {
            setIsLoaded(true)
          }}
        />
        {/* <img src={item.cover} alt='' /> */}
      </div>
    </article>
  )
}
