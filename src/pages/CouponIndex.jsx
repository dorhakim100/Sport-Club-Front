import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { couponService } from '../services/coupon/coupon.service'
import { loadCoupons, removeCoupon } from '../store/actions/coupon.actions'

import { HeadContainer } from '../cmps/HeadContainer'
import { CouponList } from '../cmps/CouponList'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { setIsLoading } from '../store/actions/system.actions'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function CouponIndex() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const coupons = useSelector(
    (stateSelector) => stateSelector.couponModule.coupons
  )

  const head = {
    he: 'קופונים',
    eng: 'Coupons',
  }

  const setCoupons = async () => {
    try {
      setIsLoading(true)
      const c = await loadCoupons()
      console.log(c)
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish ? `Couldn't load coupons` : 'לא היה ניתן לטעון קופונים'
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setCoupons()
  }, [])

  async function onDeleteCoupon(couponId) {
    setIsLoading(true)
    try {
      await removeCoupon(couponId)
      showSuccessMsg(prefs.isEnglish ? 'Coupon removed' : 'קופון הוסר')
      await setCoupons()
    } catch (err) {
      console.log(err)
      showErrorMsg(prefs.isEnglish ? `Couldn't remove coupon` : 'קופון לא הוסר')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='coupon-index-container'>
      <HeadContainer text={head} />
      <CouponList
        coupons={coupons}
        setCoupons={setCoupons}
        onDeleteCoupon={onDeleteCoupon}
      />
    </div>
  )
}
