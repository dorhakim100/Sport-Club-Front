export function DynamicCover({ coverSrc, prefs }) {
  return (
    <div className={`cover-container ${prefs.isDarkMode && 'dark-mode'} full`}>
      <img src={coverSrc} alt='' />
    </div>
  )
}
