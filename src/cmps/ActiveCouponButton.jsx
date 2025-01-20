import { useSelector } from 'react-redux'

import { updateCoupon } from '../store/actions/coupon.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

export function ActiveCouponButton({ coupon, setIsHover, setChange }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  async function handleDoneChange(couponId) {
    try {
      const couponToUpdate = { ...coupon, isActive: !coupon.isActive }

      await updateCoupon(couponToUpdate)
      if (setChange) await setChange()

      showSuccessMsg(
        prefs.isEnglish
          ? 'Message marked successfully'
          : 'סימון הודעה בוצע בהצלחה'
      )
    } catch (err) {
      console.log(err)
      showErrorMsg(prefs.isEnglish ? `Couldn't mark coupon` : 'פעולה לא הצליחה')
    }
  }

  return (
    <div
      className={
        prefs.isDarkMode ? 'checkbox-container dark-mode' : 'checkbox-container'
      }
      onMouseEnter={() => {
        if (setIsHover) setIsHover(true)
      }}
      onMouseLeave={() => {
        if (setIsHover) setIsHover(false)
      }}
    >
      <label htmlFor={`${coupon._id}Done`}>
        {prefs.isEnglish ? 'Active' : 'פעיל'}
      </label>
      <input
        type='checkbox'
        name=''
        id={`${coupon._id}Done`}
        onChange={() => handleDoneChange(coupon._id)}
        checked={coupon.isActive}
      />
    </div>
  )
}
