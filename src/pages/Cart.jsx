import { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { smoothScroll } from '../services/util.service'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { itemService } from '../services/item/item.service'
import { userService } from '../services/user/user.service'
import { loadCoupons } from '../store/actions/coupon.actions'
import { couponService } from '../services/coupon/coupon.service'

import { HeadContainer } from '../cmps/HeadContainer'
import { CartList } from '../cmps/CartList.jsx'
import { loadUser, updateCart } from '../store/actions/user.actions'
import {
  setIsLoading,
  setIsModal,
  setModalMessage,
} from '../store/actions/system.actions'
import { setCartTotal } from '../store/actions/user.actions'

import { Button } from '@mui/material'
import Divider from '@mui/material/Divider'
import { makeId } from '../services/util.service'
import { paymentService } from '../services/payment/payment.service'
import { setOriginalItem } from '../store/actions/user.actions'
import { setOriginalPrice } from '../store/actions/user.actions'

export function Cart() {
  const cart = useSelector((stateSelector) => stateSelector.userModule.cart)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const originalPrice = useSelector(
    (stateSelector) => stateSelector.userModule.originalPrice
  )

  const navigate = useNavigate()

  const [fullCart, setFullCart] = useState(null)

  const [coupon, setCoupon] = useState('')
  // const [originalPrice, setOriginalPrice] = useState()
  const [discount, setDiscount] = useState()
  const isDiscount = useRef(false)
  const [priceBeforeDiscount, setPriceBeforeDiscount] = useState(0)

  const isFirstRender = useRef(true)

  const headText = user
    ? { eng: user.fullname, he: user.fullname }
    : { eng: 'Login First', he: 'יש להתחבר' }

  useEffect(() => {
    setCart()
  }, [])

  const total = useMemo(() => {
    if (!fullCart) return
    let total = 0
    if (!cart) return
    const cartTotal = cart.reduce(
      (accu, item) => accu + item.price * item.quantity,
      total
    )
    setCartTotal(cartTotal)

    if (isDiscount.current) {
      const discountToSet = originalPrice - cartTotal

      setDiscount(discountToSet)
    }
    return cartTotal
  }, [cart]) // using useMemo to prevent calculating each and every render

  async function setCart(discount) {
    if (cart.length === 0) return
    try {
      setIsLoading(true)
      const logged = await userService.getLoggedinUser()

      const loaded = await loadUser(logged._id)

      const fetchedCart = await userService.getCartItems(cart)

      isFirstRender.current === false
      // setOriginalPrice(total)
      if (discount) {
        setOriginalPrice(total)
        // setPriceBeforeDiscount(total)
        // setOriginalPrice(total)
        isDiscount.current = true
        fetchedCart.forEach((item) => {
          const matchedDiscountItem = discount.items.find(
            (itemToCheck) => itemToCheck.id === item.id
          )

          if (!matchedDiscountItem) return // Skip if no match is found

          const idx = fetchedCart.findIndex(
            (cartItem) => cartItem.id === item.id
          )
          let itemToModify = fetchedCart[idx]
          setOriginalItem(fetchedCart[idx])

          if (discount.type === 'fixed') {
            itemToModify = {
              ...itemToModify,
              price: itemToModify.price - discount.amount,
              isDiscount: true,
            }
          }

          if (discount.type === 'percentage') {
            itemToModify = {
              ...itemToModify,
              price:
                itemToModify.price -
                itemToModify.price * (discount.amount / 100),
              isDiscount: true,
            }
          }

          fetchedCart.splice(idx, 1, itemToModify)
        })
      }
      setFullCart([...fetchedCart])
      const userToUpdate = { ...loaded, items: [...fetchedCart] }
      await updateCart(userToUpdate)
    } catch (err) {
      // // console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function onEnterCoupon({ target }) {
    try {
      setIsLoading(true)
      const res = await couponService.getDiscount(coupon)
      await setCart(res)
      showSuccessMsg(
        prefs.isEnglish ? 'Coupon added successfully' : 'קופון נוסף בהצלחה'
      )
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish ? `Couldn't load coupon` : 'לא ניתן היה לטעון קופון'
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function onPay() {
    try {
      const messageToSet = {
        he: `בימים הקרובים הזמנות דרך האתר יהיו פעילות`,
        eng: `In the following days orders from our site will be available`,
      }
      setModalMessage(messageToSet)
      setIsModal(true)
      return // till actual payments are ready

      setIsLoading(true)
      const order = createOrder()
      const url = await paymentService.createNewOrderLink(order)

      setIsLoading(false)
      // return
      openPelecardLink(url)
    } catch (err) {
      // // console.log(err)
      showErrorMsg(
        prefs.isEnglish ? `Couldn't start payment` : 'לא ניתן להתחיל תשלום'
      )
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
        phone: user.phone,
        email: user.email,
      },
    }

    return order
  }

  const openPelecardLink = (link) => {
    // window.open(link)
    window.location.href = link
  }

  return (
    <section className='cart-page-container'>
      <h2>{prefs.isEnglish ? 'Shopping Cart' : 'סל הקניות'}</h2>
      <HeadContainer text={headText} />
      <div className='cart-container'>
        {fullCart && <CartList cart={cart} setCart={setCart} />}
        {fullCart && (
          <div className='total-container'>
            {isDiscount.current && originalPrice && (
              <div
                style={{ fontSize: '0.8em', display: 'grid', direction: 'ltr' }}
              >
                <b>₪{originalPrice}</b>
                <b>-₪{discount}</b>

                <Divider orientation='horizontal' flexItem />
              </div>
            )}
            <b>₪{total}</b>
            <Divider orientation='horizontal' flexItem />
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
              <Button variant='contained' onClick={onEnterCoupon}>
                {prefs.isEnglish ? 'Enter' : 'אישור'}
              </Button>
            </div>

            <Button
              variant='contained'
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
