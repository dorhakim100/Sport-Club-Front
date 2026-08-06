import { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'

import { showErrorMsg } from '../services/event-bus.service'
import { userService } from '../services/user/user.service'
import { couponService } from '../services/coupon/coupon.service'

import { HeadContainer } from '../cmps/HeadContainer'
import { CartList } from '../cmps/CartList.jsx'
import {
  loadOriginalItems,
  loadUser,
  setCartState,
  updateCart,
  updateStoreUser,
} from '../store/actions/user.actions'
import {
  setIsLoading,
  setIsModal,
  setModalMessage,
} from '../store/actions/system.actions'

import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
} from '@mui/material'
import Divider from '@mui/material/Divider'
import { paymentService } from '../services/payment/payment.service'
import { setOriginalItems } from '../store/actions/user.actions'
import { setOriginalPrice } from '../store/actions/user.actions'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'

const cardsRead = {
  he: [
    'הכניסה כוללת סופי שבוע וחגים',
    'ביקורים במחיר מוזל',
    'בכרטיסיית 12 ביקורים תוקף הכרטיסייה לשנה מיום הרכישה',
    'בכרטיסיית 20 ביקורים תוקף הכרטיסייה עד לסוף השנה שבה נרכשה',
    'ניתן לממש עד 6 ניקובים בכניסה אחת',
    'אין לקיים ימי הולדת ומסיבות ללא תאום מראש מול משרד המועדון',
    'הרחצה לבעלי שיער ארוך עם כובע ים בלבד',
    'חל איסור להכניס משלוחי מזון חיצוניים לשטח המועדון',
    'אסור לעשן בכל שטח המועדון',
    'חל איסור מוחלט על הכנסת צידניות ו/או בקבוקי זכוכית',
    'השגיחו על ילדיכם שלא יעשו את צרכיהם בשטחי הדשא וליד העצים',
  ],
  eng: [
    'Entrance includes weekend and holidays',
    'Visits at a discounted price',
    'The 12 visits card is valid for one year from the date of purchase',
    'The 20 visits card is valid for the end of the year in which it was purchased',
    'Up to 6 visitors can enter in a single visit',
    'Birthday parties and events require prior coordination with the club office',
    'Swimming for individuals with long hair is permitted only with a swim cap',
    'External food deliveries are not allowed within the club premises',
    'Smoking is prohibited throughout the club area',
    'The entry of coolers and/or glass bottles is strictly forbidden',
    'Please ensure your children do not relieve themselves on the grass or near the trees',
  ],
}

export function Cart() {
  const cart = useSelector((stateSelector) => stateSelector.userModule.cart)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const isLoading = useSelector(
    (stateSelector) => stateSelector.systemModule.isLoading
  )
  const originalPrice = useSelector(
    (stateSelector) => stateSelector.userModule.originalPrice
  )
  const originalItems = useSelector(
    (stateSelector) => stateSelector.userModule.originalItems
  )

  const [fullCart, setFullCart] = useState(null)

  const [coupon, setCoupon] = useState('')
  // const [originalPrice, setOriginalPrice] = useState()
  const [discount, setDiscount] = useState()
  const isDiscount = useRef(false)
  const isApplyingCoupon = useRef(false)
  const appliedCouponCode = useRef('')

  const isFirstRender = useRef(true)
  const phoneInputContainerRef = useRef(null)

  const [checkoutPhone, setCheckoutPhone] = useState(() => user?.phone ?? '')
  const [phoneFieldInvalid, setPhoneFieldInvalid] = useState(false)
  const [cardTermsAccepted, setCardTermsAccepted] = useState(false)

  const hasCard = useMemo(() => {
    if (!cart || cart?.length === 0) return false
    return cart.some((item) => item.types?.includes('card'))
  }, [cart])

  useEffect(() => {
    setCheckoutPhone(user?.phone ?? '')
  }, [user?.phone])

  const headText = user
    ? { eng: user.fullname, he: user.fullname }
    : { eng: 'Login First', he: 'יש להתחבר' }

  useEffect(() => {
    if (!user?._id) return
    setCart()
  }, [user?._id])

  useEffect(() => {
    if (originalItems.length) return

    loadOriginalItems(cart)
  }, [originalItems.length, cart])

  const total = useMemo(() => {
    if (!fullCart) return
    let total = 0
    if (!cart) return
    const cartTotal = cart.reduce(
      (accu, item) => accu + item.price * item.quantity,
      total
    )
    // setCartTotal(cartTotal)

    if (isDiscount.current) {
      const discountToSet = originalPrice - cartTotal

      setDiscount(discountToSet)
    }
    return cartTotal
  }, [cart]) // using useMemo to prevent calculating each and every render

  const containsDiscount = useMemo(() => {
    return cart.some((item) => item.isDiscount)
  }, [cart])

  async function setCart(discount) {
    if (cart.length === 0) return
    try {
      setIsLoading(true)
      // const logged = await userService.getLoggedinUser()

      const loaded = await loadUser(user._id)
      // const loaded = user
      updateStoreUser(loaded)

      const fetchedCart = await userService.getCartItems(cart)
      const originalFetchedCart = await userService.getCartItems(originalItems)

      isFirstRender.current === false
      // setOriginalPrice(total)

      const originalItemsToSet = [...originalFetchedCart]
      if (
        loaded.memberStatus.isMember &&
        loaded.memberStatus.expiry > Date.now()
      ) {
        fetchedCart.forEach((item) => {
          if (item.types.includes('card')) {
            const idx = fetchedCart.findIndex(
              (cartItem) => cartItem.id === item.id
            )
            let itemToModify = fetchedCart[idx]
            const idxToModify = originalItemsToSet.findIndex(
              (originalItem) => originalItem.id === item.id
            )
            if (idxToModify !== -1) {
              originalItemsToSet.splice(idxToModify, 1, item)
            } else {
              originalItemsToSet.push(item)
            }
            setOriginalItems([...originalItemsToSet])

            itemToModify = {
              ...itemToModify,
              price: 500,
              isDiscount: true,
              addedAt: Date.now(),
            }
            fetchedCart.splice(idx, 1, itemToModify)
          }
        })
      } else if (discount) {
        setOriginalPrice(total)
        // setPriceBeforeDiscount(total)
        // setOriginalPrice(total)
        isDiscount.current = true
        fetchedCart.forEach((item) => {
          const matchedDiscountItem = discount.items.find(
            (itemToCheck) => itemToCheck.id === item.id
          )

          if (!matchedDiscountItem) return // Skip if no match is found
          if (item.isDiscount) return // Skip if item is already discounted

          const idx = fetchedCart.findIndex(
            (cartItem) => cartItem.id === item.id
          )

          let itemToModify = fetchedCart[idx]

          const idxToModify = originalItemsToSet.findIndex(
            (originalItem) => originalItem.id === item.id
          )
          if (idxToModify !== -1) {
            originalItemsToSet.splice(idxToModify, 1, item)
          } else {
            originalItemsToSet.push(item)
          }
          setOriginalItems([...originalItemsToSet])

          if (discount.type === 'fixed') {
            const originalItem = originalItemsToSet.find(
              (originalItem) => originalItem.id === item.id
            )
            const basePrice = originalItem?.price ?? itemToModify.price
            itemToModify = {
              ...itemToModify,
              price: basePrice - discount.amount,
              isDiscount: true,
              addedAt: Date.now(),
            }
          }

          if (discount.type === 'percentage') {
            const originalItem = originalItemsToSet.find(
              (originalItem) => originalItem.id === item.id
            )
            const basePrice = originalItem?.price ?? itemToModify.price
            itemToModify = {
              ...itemToModify,
              price: basePrice - basePrice * (discount.amount / 100),
              isDiscount: true,
              addedAt: Date.now(),
            }
          }

          fetchedCart.splice(idx, 1, itemToModify)
        })
      } else {
        fetchedCart.forEach((item) => {
          const idx = fetchedCart.findIndex(
            (cartItem) => cartItem.id === item.id
          )
          const originalItem = originalItemsToSet.find(
            (originalItem) => originalItem.id === item.id
          )
          const basePrice = originalItem?.price ?? fetchedCart[idx].price
          fetchedCart[idx].price = basePrice
          fetchedCart[idx].isDiscount = false
          fetchedCart[idx].addedAt = Date.now()
        })
      }
      setFullCart([...fetchedCart])
      const userToUpdate = { ...loaded, items: [...fetchedCart] }

      await updateCart(userToUpdate)
      setCartState(fetchedCart)
    } catch (err) {
      // console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function onEnterCoupon({ target }) {
    if (containsDiscount) return
    if (isApplyingCoupon.current) return
    if (!coupon?.trim()) return
    const normalizedCouponCode = coupon.trim().toUpperCase()
    if (
      isDiscount.current &&
      appliedCouponCode.current === normalizedCouponCode
    )
      return

    try {
      isApplyingCoupon.current = true
      setIsLoading(true)
      const couponCode = normalizedCouponCode

      const res = await couponService.getDiscount(couponCode)

      await setCart(res)
      appliedCouponCode.current = couponCode
      // showSuccessMsg(
      //   prefs.isEnglish ? 'Coupon added successfully' : 'קופון נוסף בהצלחה'
      // )
      if (res.code === 'MOMS80') {
        setModalMessage({
          he: 'רכשת במכירה המוקדמת ומגיעה לך כניסה נוספת מתנה! 😀',
          eng: 'You get a free entry to use at the office 😀',
          isDiscount: true,
        })
        setIsModal(true)
      }
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish ? `Couldn't load coupon` : 'לא ניתן היה לטעון קופון'
      )
    } finally {
      isApplyingCoupon.current = false
      setIsLoading(false)
    }
  }

  function triggerPhoneFieldShake() {
    const el = phoneInputContainerRef.current
    if (!el) return
    el.classList.remove('phone-field-shake')
    void el.offsetWidth
    el.classList.add('phone-field-shake')
  }

  async function onPay() {
    try {
      if (!checkoutPhone.trim()) {
        setPhoneFieldInvalid(true)
        triggerPhoneFieldShake()
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([35, 25, 35])
        }
        return
      }

      setIsLoading(true)

      const order = createOrder()

      const url = await paymentService.createNewOrderLink(order)

      setIsLoading(false)
      openPelecardLink(url)
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish ? `Couldn't start payment` : 'לא ניתן להתחיל תשלום'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const createOrder = () => {
    const order = {
      ...paymentService.getEmptyOrder(),
      items: cart,
      amount: total,
      user: {
        id: user._id,
        name: user.fullname,
        phone: checkoutPhone.trim(),
        email: user.email,
      },
      coupon: coupon,
    }

    return order
  }

  const openPelecardLink = (link) => {
    // window.open(link)
    window.location.href = link
  }

  const onOpenCardTerms = () => {
    setModalMessage({
      eng: 'Card terms',
      he: 'תנאי הכרטיסייה',
      extra: (
        <ul className='card-terms-list'>
          {(prefs.isEnglish ? cardsRead.eng : cardsRead.he).map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ul>
      ),
    })
    setIsModal(true)
  }

  return (
    <section className='cart-page-container'>
      <h2>{prefs.isEnglish ? 'Shopping Cart' : 'סל הקניות'}</h2>
      <HeadContainer text={headText} />
      <div className='cart-container'>
        {fullCart && (
          <CartList
            cart={cart}
            setCart={setCart}
          />
        )}
        {fullCart && (
          <div className='total-container'>
            {isDiscount.current && originalPrice && (
              <div
                style={{ fontSize: '0.8em', display: 'grid', direction: 'ltr' }}
              >
                <b>₪{originalPrice}</b>
                <b>-₪{discount}</b>

                <Divider
                  orientation='horizontal'
                  flexItem
                />
              </div>
            )}
            <b>₪{total}</b>
            <Divider
              orientation='horizontal'
              flexItem
            />
            {!containsDiscount && !discount && (
              <div className='discount-container'>
                <div
                  className={`input-container ${
                    prefs.isDarkMode && 'dark-mode'
                  } enter-code-container`}
                >
                  <input
                    type='search'
                    placeholder={prefs.isEnglish ? 'Coupon code' : 'קוד קופון'}
                    onChange={(event) => setCoupon(event.target.value)}
                    value={coupon}
                  />
                  <Button
                    variant='contained'
                    onClick={onEnterCoupon}
                    disabled={isLoading || isApplyingCoupon.current}
                  >
                    {prefs.isEnglish ? 'Enter' : 'אישור'}
                  </Button>
                </div>
              </div>
            )}
            {!containsDiscount && (
              <Divider
                orientation='horizontal'
                flexItem
              />
            )}

            <div
              ref={phoneInputContainerRef}
              onAnimationEnd={(e) => {
                if (e.target !== e.currentTarget) return
                if (e.animationName === 'cart-phone-shake') {
                  e.currentTarget.classList.remove('phone-field-shake')
                }
              }}
              className={`input-container checkout-phone ${
                prefs.isDarkMode && 'dark-mode'
              } ${phoneFieldInvalid ? 'phone-field-shake' : ''}`}
            >
              <Typography
                variant='body1'
                color='text.secondary'
              >
                {prefs.isEnglish ? 'Phone number' : 'טלפון לקבלת הזמנה'}
              </Typography>

              <input
                type='search'
                inputMode='tel'
                autoComplete='tel'
                className={phoneFieldInvalid ? 'error' : ''}
                placeholder={prefs.isEnglish ? 'Phone' : 'טלפון'}
                value={checkoutPhone}
                onChange={(e) => {
                  setCheckoutPhone(e.target.value)
                  if (phoneFieldInvalid) setPhoneFieldInvalid(false)
                }}
              />
            </div>

            {hasCard && (
              <div className='card-terms-container'>
                <FormControlLabel
                  control={<Checkbox />}
                  label={
                    prefs.isEnglish
                      ? 'I accept the card terms'
                      : 'אני מאשר את תנאי הכרטיסייה'
                  }
                  checked={cardTermsAccepted}
                  onChange={(e) => setCardTermsAccepted(e.target.checked)}
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      margin: 0,
                      fontSize: '14px',
                    },
                  }}
                />
                <IconButton onClick={onOpenCardTerms}>
                  <RemoveRedEyeIcon />
                </IconButton>
              </div>
            )}

            <Button
              variant='contained'
              disabled={(hasCard && !cardTermsAccepted) || cart?.length === 0}
              onClick={() => {
                // smoothScroll()
                // navigate(`/user/${user._id}/cart/paying`)
                onPay()
              }}
            >
              {prefs.isEnglish ? 'Checkout' : 'תשלום'}
            </Button>
          </div>
        )}
        {!fullCart && (
          <b className='empty-cart'>
            {prefs.isEnglish
              ? 'Add items to cart'
              : 'יש להוסיף פריטים לעגלת הקניות'}
          </b>
        )}
      </div>
    </section>
  )
}
