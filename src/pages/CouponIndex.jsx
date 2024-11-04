import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { couponService } from '../services/coupon/coupon.service'
import {
  addCoupon,
  loadCoupons,
  removeCoupon,
} from '../store/actions/coupon.actions'

import { HeadContainer } from '../cmps/HeadContainer'
import { CouponList } from '../cmps/CouponList'
import { Controller } from '../cmps/Controller.jsx'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { setIsLoading } from '../store/actions/system.actions'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function CouponIndex() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const navigate = useNavigate()

  const coupons = useSelector(
    (stateSelector) => stateSelector.couponModule.coupons
  )

  const [filter, setFilter] = useState({
    pageIdx: 0,
    isAll: false,
  })

  const [maxPage, setMaxPage] = useState()

  const head = {
    he: 'קופונים',
    eng: 'Coupons',
  }

  const setCoupons = async () => {
    try {
      setIsLoading(true)
      const c = await loadCoupons(filter)
      if (c.length === 0) {
        const pageToSet = filter.pageIdx - 1
        setFilter({ ...filter, pageIdx: pageToSet })
        return
      }
      const max = await couponService.getMaxPage()
      setMaxPage(max)
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
  }, [filter])

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

  async function onAddCoupon() {
    setIsLoading(true)
    const coupon = couponService.getEmptyCoupon()
    delete coupon._id
    try {
      const savedCoupon = await addCoupon(coupon)
      showSuccessMsg(prefs.isEnglish ? `Coupon added` : 'קופון נוסף')
      navigate(`/admin/coupon/edit/${savedCoupon._id}`)
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish ? `Couldn't add coupon` : 'לא היה ניתן להוסיף קופון'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='coupon-index-container'>
      <HeadContainer text={head} />
      <Controller
        filter={filter}
        setFilter={setFilter}
        maxPage={maxPage}
        onAdd={onAddCoupon}
      />
      <CouponList
        coupons={coupons}
        setCoupons={setCoupons}
        onDeleteCoupon={onDeleteCoupon}
      />
    </div>
  )
}
