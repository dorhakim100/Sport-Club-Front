import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { loadUser } from '../store/actions/user.actions'
import { store } from '../store/store'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { paymentService } from '../services/payment/payment.service'

// import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from '../services/socket.service'

import { HeadContainer } from '../cmps/HeadContainer'
import { OrderList } from '../cmps/OrderList.jsx'
import { setIsLoading } from '../store/actions/system.actions'
import { ContactUs } from '../cmps/ContactUs'
import { loadPayments } from '../store/actions/payment.actions'
import { Controller } from '../cmps/Controller'

export function UserDetails() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const params = useParams()
  const user = useSelector((storeState) => storeState.userModule.user)
  const [userName, setUserName] = useState({ he: '', eng: '' })

  const [filterBy, setFilterBy] = useState(paymentService.getDefaultFilter())
  const [maxPage, setMax] = useState()
  const orders = useSelector(
    (stateSelector) => stateSelector.paymentModule.payments
  )

  useEffect(() => {
    setUser()
  }, [params.id])

  useEffect(() => {
    console.log(filterBy)
    loadPayments(filterBy)
  }, [filterBy])

  async function setUser() {
    try {
      setIsLoading(true)
      const u = await loadUser(params.userId)
      setUserName({ he: u.fullname, eng: u.fullname })

      const filter = { ...filterBy, ordersIds: u.ordersIds }
      const m = await paymentService.getMaxPage(filter)

      setFilterBy(filter)
      setMax(m)
      await loadPayments(filter)
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

  return (
    <section className='user-details'>
      {user && !user.isAdmin && (
        <div>
          {/* <HeadContainer text={userName} /> */}
          <OrderList
            user={user}
            orders={orders}
            maxPage={maxPage}
            filter={filterBy}
            setFilterBy={setFilterBy}
          />
        </div>
      )}
      <ContactUs />
    </section>
  )
}
