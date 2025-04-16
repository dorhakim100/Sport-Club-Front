import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { loadUser, updateUser } from '../store/actions/user.actions'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { paymentService } from '../services/payment/payment.service'

import { setIsLoading } from '../store/actions/system.actions'
import { ContactUs } from '../cmps/ContactUs'
import { loadPayments } from '../store/actions/payment.actions'
import { OrderList } from '../cmps/OrderList.jsx'
import { HeadContainer } from '../cmps/HeadContainer'

import { Button } from '@mui/material'
import { capitalizeFirstLetter } from '../services/util.service'

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

  const [editUser, setEditUser] = useState({ phone: '', newPassword: '' })

  const [googleImg, setGoogleImg] = useState('')

  useEffect(() => {
    setUser()
  }, [params.id])

  useEffect(() => {
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
      console.log(prefs)
      if (prefs.user && prefs.user.imgUrl) {
        setGoogleImg(prefs.user.imgUrl)
      }
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
  const editText = {
    he: 'עריכה',
    eng: 'Edit',
  }
  const userText = {
    he: 'משתמש',
    eng: 'User',
  }

  const renderUserDetails = () => {
    const elements = []
    for (const key in user) {
      if (
        user.hasOwnProperty(key) &&
        key !== '_id' &&
        key !== 'isAdmin' &&
        key !== 'ordersIds' &&
        key !== 'items' &&
        key !== 'img' &&
        key !== 'imgUrl'
      ) {
        if (!prefs.isEnglish) {
          let hebrewKey
          switch (key) {
            case 'fullname':
              hebrewKey = 'שם מלא'
              break
            case 'username':
              hebrewKey = 'שם משתמש'
              break
            case 'email':
              hebrewKey = 'אימייל'
              break
            case 'phone':
              hebrewKey = 'מספר טלפון'
              break

            default:
              break
          }
          elements.push(
            <div className='detail-container' key={`${key}he`}>
              <b>{`${hebrewKey}:`}</b>
              <span> {user[key]}</span>
            </div>
          )
        } else {
          elements.push(
            <div className='detail-container' key={`${key}eng`}>
              <b>{`${capitalizeFirstLetter(key)}:`}</b>
              <span> {user[key]}</span>
            </div>
          )
        }
      }
    }
    return elements
  }

  const onUpdateUser = async (event) => {
    event.preventDefault()

    if (editUser.newPassword.length && editUser.newPassword.length < 6)
      return showErrorMsg(
        prefs.isEnglish
          ? 'New password must be more than 6 letters'
          : 'סיסמא חדשה חייבת להיות יותר מ6 תווים'
      )

    const userToUpdate = {
      ...user,
      phone: editUser.phone ? editUser.phone : user.phone,
      password: editUser.newPassword ? editUser.newPassword : null,
    }

    try {
      await updateUser(userToUpdate)
      showSuccessMsg(
        prefs.isEnglish ? 'Update successful' : 'עדכון בוצע בהצלחה'
      )
    } catch (err) {
      console.log(err)
      showErrorMsg(
        prefs.isEnglish ? `Couldn't save changes` : 'לא היה ניתן לשמור'
      )
    }
  }

  const handleChange = (event) => {
    const { target } = event

    const { name, value } = target

    setEditUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <section className='user-details'>
      {user && !user.isAdmin && (
        <div>
          <HeadContainer text={userText} />
          <div className='user-container'>
            <div className='details-container'>
              {user && renderUserDetails()}
            </div>
            <div className='img-container'>
              <img
                src={
                  googleImg ||
                  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                }
                alt='userImg'
              />
            </div>
          </div>
          <HeadContainer text={editText} />
          <div className='edit-container'>
            <form action='' onSubmit={onUpdateUser}>
              <div
                className={`input-container ${
                  prefs.isDarkMode ? 'dark-mode' : ''
                }`}
              >
                <input
                  type='search'
                  id='phone'
                  name='phone'
                  value={editUser.phone}
                  onChange={handleChange}
                  placeholder={prefs.isEnglish ? 'Phone number' : 'מספר טלפון'}
                />
              </div>
              <div
                className={`input-container ${
                  prefs.isDarkMode ? 'dark-mode' : ''
                }`}
              >
                <input
                  id='newPassword'
                  type='search'
                  name='newPassword'
                  value={editUser.newPassword}
                  onChange={handleChange}
                  placeholder={prefs.isEnglish ? 'New password' : 'סיסמא חדשה'}
                />
              </div>
              <Button variant='contained' type='submit'>
                {prefs.isEnglish ? 'Submit' : 'אישור'}
              </Button>
            </form>
          </div>
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
