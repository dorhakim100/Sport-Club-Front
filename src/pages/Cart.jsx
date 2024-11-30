import { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { itemService } from '../services/item/item.service'
import { userService } from '../services/user/user.service'
import { loadCoupons } from '../store/actions/coupon.actions'
import { couponService } from '../services/coupon/coupon.service'

import { HeadContainer } from '../cmps/HeadContainer'
import { CartList } from '../cmps/CartList.jsx'
import { loadUser, updateCart } from '../store/actions/user.actions'
import { setIsLoading } from '../store/actions/system.actions'
import { setCartTotal } from '../store/actions/user.actions'

import { Button } from '@mui/material'
import Divider from '@mui/material/Divider'
import { makeId } from '../services/util.service'
import { orderService } from '../services/order/order.service'

export function Cart() {
  const cart = useSelector((stateSelector) => stateSelector.userModule.cart)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const navigate = useNavigate()

  console.log(user)

  const [fullCart, setFullCart] = useState(null)

  const [coupon, setCoupon] = useState('')

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
    return cartTotal
  }, [cart]) // using useMemo to prevent calculating each and every render

  async function setCart(discount) {
    if (cart.length === 0) return
    try {
      setIsLoading(true)
      const logged = await userService.getLoggedinUser()
      console.log(logged)
      const loaded = await loadUser(logged._id)
      console.log(loaded)
      const fetchedCart = await userService.getCartItems(cart)
      isFirstRender.current === false
      if (discount) {
        fetchedCart.forEach((item) => {
          const matchedDiscountItem = discount.items.find(
            (itemToCheck) => itemToCheck.id === item.id
          )

          if (!matchedDiscountItem) return // Skip if no match is found

          const idx = fetchedCart.findIndex(
            (cartItem) => cartItem.id === item.id
          )
          let itemToModify = fetchedCart[idx]

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
      console.log(user)
      console.log(fetchedCart)
      setFullCart([...fetchedCart])
      const userToUpdate = { ...loaded, items: [...fetchedCart] }
      console.log(userToUpdate)
      await updateCart(userToUpdate)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  function onCheckout() {
    try {
      setIsLoading(true)
    } catch (err) {
      console.log(err)
      showErrorMsg(prefs.isEnglish ? `Could't checkout` : 'שגיאה')
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
      const order = createOrder()
      const url = await orderService.createNewOrderLink(order)
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish ? `Couldn't start payment` : 'לא ניתן להתחיל תשלום'
      )
    }
  }

  const createOrder = () => {
    const order = {
      ...orderService.getEmptyOrder(),
      items: cart,
      amount: total,
      user: { id: user._id, name: user.fullname },
    }

    return order
  }

  return (
    <section className='cart-page-container'>
      <h2>{prefs.isEnglish ? 'Shopping Cart' : 'סל הקניות'}</h2>
      <HeadContainer text={headText} />
      <div className='cart-container'>
        {fullCart && <CartList cart={cart} setCart={setCart} />}
        {fullCart && (
          <div className='total-container'>
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
                // window.scrollTo({ top: 0, behavior: 'smooth' })
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
