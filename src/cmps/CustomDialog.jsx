import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useSelector } from 'react-redux'

export function CustomDialog({
  open,
  onClose,
  title = '',
  children,
  actions = null,
  maxWidth = 'sm',
  fullWidth = true,
  defaultCloseText,
}) {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const closeText = defaultCloseText || (prefs.isEnglish ? 'Close' : 'סגירה')
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth} sx={{
      direction: prefs.isEnglish ? 'ltr' : 'rtl',
    }}>
      {title && <DialogTitle>{title}</DialogTitle>}

      <DialogContent dividers>{children}</DialogContent>

      <DialogActions>
        {actions}
        <Button variant='outlined' onClick={onClose}>
          {closeText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

