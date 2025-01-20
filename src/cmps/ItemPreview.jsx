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

  return (
    <article className='preview'>
      <Link
        onClick={() => smoothScroll()}
        to={`/item/${item._id}`}
        className={prefs.isDarkMode ? 'dark-mode' : ''}
      >
        {prefs.isEnglish ? item.title.eng : item.title.he}
      </Link>
      {/* {user && user.isAdmin && typeof item.quantity === 'number' && ( */}

      <div
        className={
          user && user.isAdmin && typeof item.stockQuantity === 'number'
            ? 'quantity-container visible'
            : 'quantity-container'
        }
      >
        <span>{prefs.isEnglish ? 'Quantity:' : 'מלאי:'}</span>
        <span>{item.stockQuantity}</span>
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
