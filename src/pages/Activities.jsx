import { NavLink, Outlet } from 'react-router-dom'

export function Activities() {
  return (
    <section className='activities-page-container'>
      <h3>activities</h3>
      <nav>
        <NavLink to='swimming'>swimming</NavLink>
        <NavLink to='tennis'>tennis</NavLink>
        <NavLink to='care'>care</NavLink>
        <NavLink to='restaurant'>restaurant</NavLink>
      </nav>

      <section>
        <Outlet />
      </section>
    </section>
  )
}

export function Swimming() {
  return (
    <div className='swimming-container'>
      <span>swimming</span>
    </div>
  )
}

export function Tennis() {
  return (
    <div className='tennis-container'>
      <span>tennis</span>
    </div>
  )
}

export function Care() {
  return (
    <div className='care-container'>
      <span>care</span>
    </div>
  )
}

export function Restaurant() {
  return (
    <div className='restaurant-container'>
      <span>restaurant</span>
    </div>
  )
}
