import PercentIcon from '@mui/icons-material/Percent'
import PriceCheckIcon from '@mui/icons-material/PriceCheck'

export function Switch({ isFixed, handleChange }) {
  return (
    <div className='switch-container' style={{ direction: 'rtl' }}>
      <input
        type='checkbox'
        name='type'
        id='pill-checkbox'
        checked={isFixed}
        onChange={handleChange}
      />
      <label htmlFor='pill-checkbox' className='pill-checkbox-label'>
        <i>
          <PercentIcon />
        </i>
        <i>
          <PriceCheckIcon />
        </i>
        <div></div>
      </label>
    </div>
  )
}
