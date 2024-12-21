import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { capitalizeFirstLetter, smoothScroll } from '../services/util.service'
import { removeCoupon } from '../store/actions/coupon.actions'

import { ActiveCouponButton } from './ActiveCouponButton'

import { Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

export function CouponPreview({ coupon, setCoupons, onDeleteCoupon }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const navigate = useNavigate()
  const [isHover, setIsHover] = useState(false)

  return (
    <div
      className='coupon-container'
      // key={coupon._id}
      onClick={() => {
        if (isHover) return
        navigate(`/admin/coupon/${coupon._id}`)
        smoothScroll()
      }}
    >
      <b>{prefs.isEnglish ? coupon.title.eng : coupon.title.he}</b>
      <div className='info-container'>
        <span>{coupon.code}</span>

        <span>{`${(coupon.type === 'fixed' && '₪') || ''}${coupon.amount}${
          (coupon.type === 'percentage' && '%') || ''
        }`}</span>
      </div>
      <div className='buttons-container'>
        <div
          className='button-container edit'
          onClick={(e) => {
            e.stopPropagation() // Prevents triggering the main onClick
            navigate(`/admin/coupon/edit/${coupon._id}`)
          }}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <IconButton aria-label='delete'>
            <EditIcon />
          </IconButton>
        </div>
        <div
          className='button-container delete'
          onClick={(e) => {
            e.stopPropagation() // Prevents triggering the main onClick
            onDeleteCoupon(coupon._id)
          }}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <IconButton aria-label='delete'>
            <DeleteIcon />
          </IconButton>
        </div>
        <ActiveCouponButton
          coupon={coupon}
          setChange={setCoupons}
          setIsHover={setIsHover}
        />
      </div>
    </div>
  )
}
