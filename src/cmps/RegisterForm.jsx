import { Button } from '@mui/material'
import { useSelector } from 'react-redux'

export function RegisterForm({ onSubmit, formData, setFormData }) {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  return (
    <form onSubmit={onSubmit} className='register-form'>
      <div className='input-container'>
        <input type='text' name='name' placeholder={prefs.isEnglish ? 'Name' : 'שם'} value={formData.name} onChange={handleChange} />
      </div>
      <div className='input-container'>
        <input
          type='tel'
          name='phone'
          placeholder={prefs.isEnglish ? 'Phone number' : 'מספר טלפון'}
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div className='input-container'>
        <input
          type='email'
          name='email'
          placeholder={prefs.isEnglish ? 'Email' : 'דואר אלקטרוני'}
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <Button variant='contained' color='primary' type='submit'>
        {prefs.isEnglish ? 'Register' : 'רישום'}
      </Button>
    </form>
  )
}

