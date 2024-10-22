import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { itemService } from '../services/item/item.service'
import { userService } from '../services/user/user.service'

import { HeadContainer } from '../cmps/HeadContainer'
import { CartList } from '../cmps/CartList.jsx'
import { updateCart } from '../store/actions/user.actions'
import { setIsLoading } from '../store/actions/system.actions'

import { Button } from '@mui/material'
import Divider from '@mui/material/Divider'

export function Cart() {
  const cart = useSelector((stateSelector) => stateSelector.userModule.cart)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const [fullCart, setFullCart] = useState(null)

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
    return cartTotal
  }, [cart]) // using useMemo to prevent calculating each and every render

  async function setCart() {
    if (cart.length === 0) return
    try {
      setIsLoading(true)
      const fetchedCart = await userService.getCartItems(cart)
      setFullCart(fetchedCart)
      await updateCart({ ...user, items: fetchedCart })
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className='page-container cart-page-container'>
      <h2>{prefs.isEnglish ? 'Shopping Cart' : 'סל הקניות'}</h2>
      <HeadContainer text={headText} />
      <div className='cart-container'>
        {fullCart && <CartList cart={cart} setCart={setCart} />}
        {fullCart && (
          <div className='total-container'>
            <b>₪{total}</b>
            <Divider orientation='horizontal' flexItem />

            <Button variant='contained'>
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
