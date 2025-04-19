import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { makeId, smoothScroll } from '../services/util.service'

import pending from '/public/imgs/pending.svg'
import pendingDarkMode from '/public/imgs/pending-dark-mode.svg'
import ready from '/public/imgs/ready.svg'
import readyDarkMode from '/public/imgs/ready-dark-mode.svg'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import {
  setIsLoading,
  setIsModal,
  setModalMessage,
} from '../store/actions/system.actions'
import Divider from '@mui/material/Divider'
import { useEffect, useState } from 'react'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { ConfirmModal } from './ConfirmModal'
export function OrderPreview({ order, updateOrder }) {
  const navigate = useNavigate()
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const textObject = {
    title: { he: 'לעדכן?', eng: 'Update?' },
    cancelButton: { he: 'ביטול', eng: 'Cancel' },
    submitButton: { he: 'לעדכן', eng: 'Update' },
  }
  // const [isModal, setIsModal] = useState(false)

  const onUpdateOrder = async (key) => {
    if (!user.isAdmin) return

    try {
      setIsLoading(true)
      if (key === 'isDelivered' && !order.isDelivered && !order.isReady) {
        await updateOrder({ ...order, isDelivered: true, isReady: true })
      } else if (key === 'isReady' && order.isReady && order.isDelivered) {
        await updateOrder({ ...order, isDelivered: false, isReady: false })
      } else await updateOrder({ ...order, [key]: !order[key] })

      showSuccessMsg(
        prefs.isEnglish ? `Order updated successfully` : 'הזמנה עודכנה בהצלחה'
      )
    } catch (err) {
      // // console.log(err)
      showErrorMsg(
        prefs.isEnglish ? `Couldn't update order` : 'לא היה ניתן לעדכן הזמנה'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   order.items.map((item) => {
  //     if (item.options && item.options.length > 0) {
  //       const optionsQuantity = item.options.reduce((accu, option) => {
  //         console.log(accu)
  //         console.log(option)
  //         accu[option] ? accu[option]++ : (accu[option] = 1)

  //         return accu
  //       }, {})
  //       console.log(optionsQuantity)
  //       const result = Object.keys(optionsQuantity).map((key) => ({
  //         id: key, // or use `id` if you prefer, e.g., id: key
  //         quantity: optionsQuantity[key],
  //       }))
  //       // console.log(result)
  //       item.options = result
  //     }
  //   })
  //   // console.log(order)
  //   // console.log(order)
  //   setIsReady(true)
  // }, [])

  const setModalTrueReady = () => {
    setIsModal(true)
    const messageToSet = {
      he: 'הזמנה מוכנה לאיסוף?',
      eng: `Order ready?`,

      buttons: [
        {
          title: { he: 'ביטול', eng: 'Cancel' },
          func: () => setIsModal(false),
        },
        {
          title: { he: 'אישור', eng: 'Confirm' },
          func: () => onUpdateOrder('isReady'),
        },
      ],
    }
    setModalMessage(messageToSet)
  }

  const setModalTrueDelivered = () => {
    setIsModal(true)
    const messageToSet = {
      he: 'הזמנה נאספה?',
      eng: `Order taken?`,

      buttons: [
        {
          title: { he: 'ביטול', eng: 'Cancel' },
          func: () => setIsModal(false),
        },
        {
          title: { he: 'אישור', eng: 'Confirm' },
          func: () => onUpdateOrder('isDelivered'),
        },
      ],
    }
    setModalMessage(messageToSet)
  }

  return (
    <>
      {/* {isModal && (
        <ConfirmModal
          isModal={isModal}
          // setIsModal={setIsModal}
          // item={item}
          // onRemove={onRemoveFromCart}
          page={'order'}
          textObject={textObject}
        />
      )} */}
      <div
        className={`order-container ${prefs.isDarkMode && 'dark-mode'} ${
          order.isReady ? 'ready' : ''
        }`}
      >
        <div className={`date-is-ready-container`}>
          {user && !user.isAdmin && (
            <div
              className={`is-ready-container ${
                user && user.isAdmin ? 'admin' : ''
              }`}
            >
              {order.isReady && order.isDelivered ? (
                <DoneAllIcon sx={{ width: '50px', height: '50px' }} />
              ) : order.isReady ? (
                <ReadySvg />
              ) : (
                <PendingSvg />
              )}
              <span>
                {order.isReady && order.isDelivered
                  ? prefs.isEnglish
                    ? `Done`
                    : 'הושלם'
                  : order.isReady
                  ? prefs.isEnglish
                    ? `Ready`
                    : `מוכן לאיסוף`
                  : prefs.isEnglish
                  ? `Pending`
                  : `בטיפול`}
              </span>
            </div>
          )}
          {user && user.isAdmin && (
            <div className='progress-container'>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={order.isReady}
                      sx={{
                        color: prefs.isDarkMode ? '#fff' : '',
                        '&.Mui-checked': {
                          color: prefs.isDarkMode
                            ? 'rgb(130.7142857143, 219.2857142857, 120.7142857143)'
                            : '#4caf50',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(76, 175, 80, 0.08)', // subtle hover ripple
                        },
                      }}
                    />
                  }
                  label={prefs.isEnglish ? 'Ready' : 'מוכן לאיסוף'}
                  onClick={(e) => {
                    e.preventDefault()

                    setModalTrueReady()
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={order.isDelivered}
                      sx={{
                        color: prefs.isDarkMode ? '#fff' : '',
                        '&.Mui-checked': {
                          color: prefs.isDarkMode
                            ? 'rgb(130.7142857143, 219.2857142857, 120.7142857143)'
                            : '#4caf50',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(76, 175, 80, 0.08)',
                        },
                      }}
                    />
                  }
                  label={prefs.isEnglish ? 'Taken' : 'נאסף'}
                  onClick={(e) => {
                    e.preventDefault()

                    setModalTrueDelivered()
                  }}
                />
              </FormGroup>
            </div>
          )}

          {user && user.isAdmin && (
            <div className='details-container'>
              <b>{order.user.fullname}</b>
              <span>-</span>
              <b>{order.user.phone}</b>
            </div>
          )}
          <span>{new Date(order.createdAt).toLocaleDateString('he')}</span>
        </div>

        <div className='order-num-container'>
          <span>{prefs.isEnglish ? `Order num` : `הזמנה מס׳`}</span>
          <span>{order.orderNum}</span>
        </div>
        <div className='items-container'>
          {order.items.map((item, index, items) => {
            return (
              <div
                className={`item-container ${prefs.isDarkMode && 'dark-mode'}`}
                key={`order${item.id}`}
              >
                <b
                  onClick={() => {
                    navigate(`/item/${item.id}`)
                    smoothScroll()
                  }}
                >
                  {prefs.isEnglish ? item.title.eng : item.title.he}
                </b>
                <div className='quantity-container'>
                  <div className='sum-container'>
                    <span>{prefs.isEnglish && <span>x</span>}</span>
                    <span>{item.quantity}</span>
                    <span> {!prefs.isEnglish && <span>x</span>}</span>
                  </div>
                  {item.options && item.options[0] && (
                    <>
                      <span>-</span>
                      <div className='options-container'>
                        {item.options.map((option) => {
                          if (option)
                            return (
                              <div
                                className='option-container'
                                key={`${option}Order${makeId()}`}
                              >
                                <span>
                                  {prefs.isEnglish
                                    ? option.title.eng
                                    : option.title.he}
                                </span>
                                {option.quantity !== 1 && (
                                  <div className='option-quantity-container'>
                                    <span>
                                      {prefs.isEnglish && <span>x</span>}
                                    </span>
                                    <span>{option.quantity}</span>
                                    <span>
                                      {!prefs.isEnglish && <span>x</span>}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )
                        })}
                      </div>
                    </>
                  )}
                </div>
                {index + 1 < items.length && (
                  <Divider
                    style={prefs.isDarkMode ? { backgroundColor: 'white' } : {}}
                    orientation='vertical'
                    flexItem
                  />
                )}
              </div>
            )
          })}
        </div>
        <div className='order-total-container'>
          <span>{prefs.isEnglish ? `Total` : `סה״כ`}</span>
          <span>{`${!prefs.isEnglish ? '₪' : ''}${order.amount}${
            prefs.isEnglish ? '₪' : ''
          }`}</span>
        </div>
      </div>{' '}
    </>
  )
}

function PendingSvg() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  return <img src={prefs.isDarkMode ? pendingDarkMode : pending} alt='' />
}

function ReadySvg() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  return <img src={prefs.isDarkMode ? readyDarkMode : ready} alt='' />
}
