import { Nav } from '../cmps/Nav'

export function OrderIndex() {
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

  return (
    <div className='order-index-container'>
      {/* <Nav origin={origin} links={links} /> */}
    </div>
  )
}
