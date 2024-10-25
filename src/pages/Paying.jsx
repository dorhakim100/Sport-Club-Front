import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'

export function Paying() {
  const total = useSelector((stateSelector) => stateSelector.userModule.total)
  const cart = useSelector((stateSelector) => stateSelector.userModule.cart)
  console.log(total)
  return <div className='page-container paying'></div>
}
