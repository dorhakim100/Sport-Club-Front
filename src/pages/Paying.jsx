import { useSelector } from 'react-redux'

export function Paying() {
  const total = useSelector((stateSelector) => stateSelector.userModule.total)
  const cart = useSelector((stateSelector) => stateSelector.userModule.cart)

  return <div className='page-container paying'></div>
}
