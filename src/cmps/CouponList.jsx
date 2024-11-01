import { useSelector } from 'react-redux'

import { CouponPreview } from './CouponPreview.jsx'

export function CouponList({ coupons, setCoupons, onDeleteCoupon }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  return (
    <div className='coupon-list-container'>
      <div className='list-header'>
        <b>{prefs.isEnglish ? 'Title' : 'כותרת'}</b>
        <div className='info-container'>
          <span>{prefs.isEnglish ? 'Code' : 'קוד'}</span>
          <span>{prefs.isEnglish ? 'Discount' : 'הנחה'}</span>
        </div>
        {/* <span>{prefs.isEnglish ? 'Active' : 'פעיל'}</span> */}
      </div>
      {coupons.map((coupon) => {
        return (
          <CouponPreview
            coupon={coupon}
            setCoupons={setCoupons}
            onDeleteCoupon={onDeleteCoupon}
          />
        )
      })}
    </div>
  )
}
