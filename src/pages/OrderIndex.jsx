import { Nav } from '../cmps/Nav'

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { updateService } from '../services/update/update.service'
import { loadUpdates } from '../store/actions/update.actions'
import { paymentService } from '../services/payment/payment.service'
import { setIsLoading } from '../store/actions/system.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import {
  loadOpenPayments,
  loadPayments,
} from '../store/actions/payment.actions'
import { updatePayment } from '../store/actions/payment.actions'

import { HeadContainer } from '../cmps/HeadContainer'
import { OrderList } from '../cmps/OrderList'
import { OrderFilter } from '../cmps/OrderFilter.jsx'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function OrderIndex() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const params = useParams()
  const user = useSelector((storeState) => storeState.userModule.user)

  const [filterBy, setFilterBy] = useState(paymentService.getDefaultFilter())
  const [maxPage, setMax] = useState()
  const orders = useSelector(
    (stateSelector) => stateSelector.paymentModule.payments
  )

  useEffect(() => {
    setUser()
  }, [params.id])

  useEffect(() => {
    if (!user || !user.isAdmin) return
    setPayments({ ...filterBy, isAdmin: true })
  }, [filterBy])

  async function setUser() {
    try {
      setIsLoading(true)

      const filter = { ...filterBy, ordersIds: [], isAdmin: true }
      const m = await paymentService.getMaxPage(filter)

      setFilterBy(filter)
      setMax(m)
      await setPayments(filter)
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish
          ? `Couldn't show user details`
          : 'לא היה ניתן להציג משתמש'
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function setPayments(filter) {
    try {
      setIsLoading(true)
      await loadPayments(filter)
      const m = await paymentService.getMaxPage(filter)
      setMax(m)
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish ? `Couldn't show orders` : 'לא היה ניתן להציג הזמנות'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const origin = {
    path: '/admin',
    he: 'מנהל',
    eng: 'Admin',
  }

  const links = [
    {
      path: 'update',
      he: 'עדכונים',
      eng: 'Updates',
    },
    {
      path: 'order',
      he: 'הזמנות',
      eng: 'Orders',
    },
  ]

  const text = {
    eng: 'Orders',
    he: 'הזמנות',
  }

  async function updateOrder(orderToUpdate) {
    try {
      await updatePayment(orderToUpdate)
      await loadPayments({ ...filterBy, isAdmin: true })
      await loadOpenPayments()
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  return (
    <div className='order-index-container'>
      <HeadContainer text={text} />

      <OrderFilter
        filter={filterBy}
        setFilter={setFilterBy}
        maxPage={maxPage}
      />
      <OrderList
        user={user}
        orders={orders}
        maxPage={maxPage}
        filter={filterBy}
        setFilterBy={setFilterBy}
        updateOrder={updateOrder}
      />
    </div>
  )
}
