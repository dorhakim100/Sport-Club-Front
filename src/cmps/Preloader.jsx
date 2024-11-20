export function Preloader({ img }) {
  return (
    <div className='preloader'>
      <div className='wave'></div>
      <div className='wave'></div>
      <div className='wave'></div>
      <img className='img' src={img} />
    </div>
  )
}
