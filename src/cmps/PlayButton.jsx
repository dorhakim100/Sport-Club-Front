import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'

export function PlayButton({ isPlaying, onClick }) {
  if (isPlaying) {
    return (
      <PauseCircleOutlineIcon
        onClick={onClick}
        className="pointer play-button"
      />
    )
  }
  return (
    <PlayCircleOutlineIcon onClick={onClick} className="pointer play-button" />
  )
}
