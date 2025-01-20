import { useDispatch, useSelector } from 'react-redux'

import { Link, useParams, useNavigate } from 'react-router-dom'

import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton'

import { setIsLoading } from '../store/actions/system.actions.js'

import { couponService } from '../services/coupon/coupon.service.js'
import { updateCoupon } from '../store/actions/coupon.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { uploadService } from '../services/upload.service.js'

import { itemService } from '../services/item/item.service.js'

import { HeadContainer } from '../cmps/HeadContainer.jsx'
import { Switch } from '../cmps/Switch.jsx'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

export function CouponEdit() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const isLoading = useSelector(
    (storeState) => storeState.systemModule.isLoading
  )

  const types = ['gym', 'studio', 'yoga']

  const params = useParams()
  const navigate = useNavigate()

  const [coupon, setCoupon] = useState({ types: [] })
  const [editCoupon, setEditCoupon] = useState(couponService.getEmptyCoupon())
  const [items, setItems] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const text = {
    he: 'קופון',
    eng: 'Coupon',
  }

  useEffect(() => {
    loadCoupon()
  }, [params.couponId])

  async function loadCoupon() {
    if (params.couponId === undefined) return
    try {
      setIsLoading(true)
      const coupon = await couponService.getById(params.couponId)

      setEditCoupon({ ...coupon })
      setCoupon({ ...coupon })
      await getItems()
    } catch (err) {
      // // console.log(err)
      showErrorMsg('Cannot load coupon')
      navigate('/coupon')
    } finally {
      setIsLoading(false)
    }
  }

  async function getItems() {
    try {
      setIsLoading(true)
      const itemsToSet = await itemService.query({ isAll: true })

      setItems(itemsToSet)
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish ? `Couldn't load items` : 'טעינת מוצרים נכשלה'
      )
    } finally {
      setIsLoading(false)
    }
  }

  function handleChange({ target }) {
    const field = target.name
    let value = target.value
    let checkedButton = target.id
    const array = checkedButton.split('|')
    checkedButton = array[1]

    const itemsToCheck = editCoupon.items
    let newItems = []

    const key = prefs.isEnglish ? 'eng' : 'he'

    switch (target.type) {
      case 'number':
      case 'range':
        value = +value || ''
        break

      case 'checkbox':
        if (field === 'items') {
          if (
            itemsToCheck.some((itemToCheck) => itemToCheck.id === checkedButton)
          ) {
            const idx = editCoupon.items.findIndex(
              (item) => item.id === checkedButton
            )
            editCoupon.items.splice(idx, 1)
            newItems = [...editCoupon.items]
          } else {
            const item = items.find((item) => item._id === checkedButton)
            editCoupon.items.push({
              id: checkedButton,
              title: item.title,
            })
            newItems = [...editCoupon.items]
          }
          setEditCoupon({ ...editCoupon, items: newItems })
          return
        }

        if (field === 'type') {
          const stateToSet =
            editCoupon.type === 'fixed' ? 'percentage' : 'fixed'
          setEditCoupon({ ...editCoupon, type: stateToSet })
          return
        }

        return
        break
      case 'text':
        if (field === 'code') {
          setEditCoupon({ ...editCoupon, [field]: value })
          return
        }

        setEditCoupon({
          ...editCoupon,
          [field]: {
            ...editCoupon[field],
            [key]: value,
          },
        })

        return
      case 'textarea':
        setEditCoupon({
          ...editCoupon,
          [field]: {
            ...editCoupon[field],
            [key]: value,
          },
        })

        return
      default:
        break
    }

    setEditCoupon({ ...editCoupon, [field]: value })
  }

  async function onSaveCoupon(ev) {
    ev.preventDefault()
    const { name, types } = editCoupon

    setIsLoading(true)
    try {
      const savedCoupon = await updateCoupon(editCoupon)
      showSuccessMsg(
        prefs.isEnglish ? 'Coupon edited successfully' : 'קופון נערך בהצלחה'
      )
    } catch (err) {
      // // console.log(err)
      showErrorMsg(
        prefs.isEnglish
          ? `Coupon couldn't be edited`
          : 'לא היה ניתן לערוך קופון'
      )
    } finally {
      setIsLoading(false)
    }
  }

  function renderImg({ target }) {
    const ImgSrc = target.value
    setImg(ImgSrc)
  }

  async function uploadFile(ev) {
    setIsLoading(true)
    try {
      const res = await uploadService.uploadImg(ev)

      const ImgSrc = res.url
      setImg(ImgSrc)
      setEditCoupon({ ...editCoupon, img: ImgSrc })
    } catch (err) {
      // // console.log(err)
      showErrorMsg(
        prefs.isEnglish ? `Couldn't upload image` : 'לא היה ניתן לעלות תמונה'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlur = (e) => {
    const value = parseFloat(e.target.value)
    const max = editCoupon.type === 'percentage' ? 100 : Number.MAX_SAFE_INTEGER

    if (value < 0 || value > max) {
      setErrorMessage(
        prefs.isEnglish
          ? `Discount cannot be more than ${max}%`
          : `הנחה לא יכולה להיות מעל ${max}%`
      )
    } else {
      setErrorMessage('')
    }
  }

  return (
    <>
      <HeadContainer text={text} />
      <section className='coupon-edit-container'>
        <form action='' className='coupon-edit-form' onSubmit={onSaveCoupon}>
          <div
            className={
              prefs.isDarkMode
                ? 'input-container name dark-mode'
                : 'input-container name'
            }
          >
            {/* <label htmlFor='' style={{ backgroundColor: 'transparent' }}>
              {prefs.isEnglish ? 'Name:' : 'כותרת:'}
            </label> */}
            <input
              onChange={handleChange}
              name='title'
              type='text'
              value={
                prefs.isEnglish ? editCoupon.title.eng : editCoupon.title.he
              }
              style={{ gridColumn: '1/-1' }}
              placeholder={prefs.isEnglish ? 'Name:' : 'כותרת:'}
            />
          </div>
          <div
            className={
              prefs.isDarkMode
                ? 'input-container name dark-mode'
                : 'input-container name'
            }
          >
            {/* <label htmlFor='' style={{ backgroundColor: 'transparent' }}>
              {prefs.isEnglish ? 'Code:' : 'קוד:'}
            </label> */}
            <input
              onChange={handleChange}
              name='code'
              type='text'
              value={editCoupon.code}
              style={{ gridColumn: '1/-1' }}
              placeholder={prefs.isEnglish ? 'Code:' : 'קוד:'}
            />
          </div>
          <div
            className={
              prefs.isDarkMode
                ? 'input-container discount dark-mode'
                : 'input-container discount'
            }
          >
            <label htmlFor='' style={{ backgroundColor: 'transparent' }}>
              {prefs.isEnglish ? 'Discount:' : 'הנחה:'}
            </label>
            <input
              onChange={handleChange}
              name='amount'
              type='number'
              max={editCoupon.type === 'percentage' ? 100 : undefined}
              value={editCoupon.amount}
              onBlur={handleBlur}
            />

            <span>{(editCoupon.type === 'percentage' && '%') || '₪'}</span>
            {editCoupon.type === 'percentage' &&
              editCoupon.amount > 100 &&
              errorMessage && (
                <span style={{ gridColumn: '1/-1' }}>{errorMessage}</span>
              )}
          </div>
          <Switch
            isFixed={editCoupon.type === 'fixed' ? true : false}
            handleChange={handleChange}
          />
          <div className='input-container active'>
            <div
              className={`checkbox-container ${
                prefs.isDarkMode && 'dark-mode'
              }`}
            >
              <label htmlFor={`isActive${coupon._id}`}>
                {prefs.isEnglish ? 'Active' : 'פעיל'}
              </label>
              <input
                type='checkbox'
                name=''
                id={`isActive${coupon._id}`}
                checked={editCoupon.isActive}
              />
            </div>
          </div>
          <div className='eligible-container'>
            {items.map((item) => {
              return (
                <div
                  className={`checkbox-container ${
                    prefs.isDarkMode && 'dark-mode'
                  }`}
                  key={`eligibleCheckbox${item._id}`}
                >
                  <label htmlFor={`isEligible|${item._id}`}>
                    {prefs.isEnglish ? item.title.eng : item.title.he}
                  </label>
                  <input
                    type='checkbox'
                    name='items'
                    id={`isEligible|${item._id}`}
                    checked={editCoupon.items.some(
                      (itemToCheck) => itemToCheck.id === item._id
                    )}
                    onChange={handleChange}
                  />
                </div>
              )
            })}
          </div>
          <LoadingButton variant='contained' type='submit' loading={isLoading}>
            {prefs.isEnglish ? 'Submit' : 'בצע'}
          </LoadingButton>
        </form>
      </section>{' '}
    </>
  )
}
