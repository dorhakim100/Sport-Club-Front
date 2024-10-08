import { useState, useEffect, userRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import React from 'react'

export function HomePage() {
  return (
    <section className='home-container'>
      <h1>Home sweet Home</h1>
    </section>
  )
}
