import { useDispatch, useSelector } from 'react-redux'

import { Link, useParams, useNavigate } from 'react-router-dom'

import { useEffect, useState, useRef } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { styled } from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton'

import { setIsLoading } from '../store/actions/system.actions.js'
import { makeId } from '../services/util.service.js'
import { trainerService } from '../services/trainer/trainer.service.js'
import { updateTrainer } from '../store/actions/trainer.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { uploadService } from '../services/upload.service.js'
import { capitalizeFirstLetter } from '../services/util.service.js'

import { HeadContainer } from '../cmps/HeadContainer.jsx'

import { Button } from '@mui/material'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

export function TrainerEdit() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const isLoading = useSelector(
    (storeState) => storeState.systemModule.isLoading
  )

  const types = ['gym', 'studio', 'swimming', 'tennis']

  const params = useParams()
  const navigate = useNavigate()

  const [trainer, setTrainer] = useState({ types: [] })
  const [editTrainer, setEditTrainer] = useState(
    trainerService.getEmptyTrainer()
  )

  const [img, setImg] = useState(null)

  const text = {
    he: 'מאמן',
    eng: 'Trainer',
  }

  useEffect(() => {
    loadTrainer()
  }, [params.trainerId])

  async function loadTrainer() {
    if (params.trainerId === undefined) return
    try {
      setIsLoading(true)
      const trainer = await trainerService.getById(params.trainerId)

      setEditTrainer({ ...trainer })
      setTrainer({ ...trainer })
      setImg(trainer.img)
    } catch (err) {
      console.log(err)
      showErrorMsg('Cannot load trainer')
      navigate('/trainer')
    } finally {
      setIsLoading(false)
    }
  }

  function handleChange({ target }) {
    const field = target.name
    let value = target.value
    let checkedButton = target.id

    const types = editTrainer.types
    let newTypes = []

    const key = prefs.isEnglish ? 'eng' : 'he'

    switch (target.type) {
      case 'number':
      case 'range':
        value = +value || ''
        break

      case 'checkbox':
        if (field === 'types') {
          if (types.includes(checkedButton)) {
            const idx = editTrainer.types.findIndex(
              (type) => type === checkedButton
            )
            editTrainer.types.splice(idx, 1)
            newTypes = [...editTrainer.types]
          } else {
            newTypes = editTrainer.types.push(checkedButton)
          }
          setEditTrainer({ ...editTrainer })
        }

        return
        break
      case 'text':
        setEditTrainer({
          ...editTrainer,
          [field]: {
            ...editTrainer[field],
            [key]: value,
          },
        })

        return
      case 'textarea':
        setEditTrainer({
          ...editTrainer,
          [field]: {
            ...editTrainer[field],
            [key]: value,
          },
        })

        return
      default:
        break
    }

    setEditTrainer({ ...editTrainer, [field]: value })
  }

  async function onSaveTrainer(ev) {
    ev.preventDefault()
    const { name, types } = editTrainer

    setIsLoading(true)
    try {
      const savedTrainer = await updateTrainer(editTrainer)
      showSuccessMsg(
        prefs.isEnglish ? 'Trainer edited successfully' : 'מאמן נערך בהצלחה'
      )
    } catch (err) {
      console.log(err)
      showErrorMsg(
        prefs.isEnglish
          ? `Trainer couldn't be edited`
          : 'לא היה ניתן לערוך מאמן'
      )
    } finally {
      setIsLoading(false)
    }
  }

  function renderImg({ target }) {
    const ImgSrc = target.value
    setImg(ImgSrc)
  }

  async function uploadFile(ev) {
    setIsLoading(true)
    try {
      const res = await uploadService.uploadImg(ev)

      const ImgSrc = res.url
      setImg(ImgSrc)
      setEditTrainer({ ...editTrainer, img: ImgSrc })
    } catch (err) {
      console.log(err)
      showErrorMsg(
        prefs.isEnglish ? `Couldn't upload image` : 'לא היה ניתן לעלות תמונה'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <HeadContainer text={text} />
      <section className='trainer-edit-container'>
        <div className='img-upload-container'>
          <div className='img-container'>
            {img && <img src={img} alt='' className='trainer-img-edit' />}
          </div>
          <LoadingButton
            component='label'
            role={undefined}
            variant='contained'
            tabIndex={-1}
            startIcon={<CloudUploadIcon sx={{ ml: 1 }} />}
            loading={isLoading}
          >
            Upload file
            <VisuallyHiddenInput type='file' onChange={uploadFile} />
          </LoadingButton>
        </div>
        <form action='' className='trainer-edit-form' onSubmit={onSaveTrainer}>
          <div
            className={
              prefs.isDarkMode
                ? 'input-container name dark-mode'
                : 'input-container name'
            }
          >
            <label htmlFor='' style={{ backgroundColor: 'transparent' }}>
              {prefs.isEnglish ? 'name:' : 'כותרת:'}
            </label>
            <input
              onChange={handleChange}
              name='name'
              type='text'
              value={
                prefs.isEnglish ? editTrainer.name.eng : editTrainer.name.he
              }
              style={{ width: 200 }}
            />
          </div>{' '}
          <div
            className={
              prefs.isDarkMode
                ? 'input-container preview dark-mode'
                : 'input-container preview'
            }
          >
            <textarea
              onChange={handleChange}
              name='preview'
              type='text'
              value={
                prefs.isEnglish
                  ? editTrainer.preview.eng
                  : editTrainer.preview.he
              }
            />
          </div>
          <div className='input-container'>
            <div className='types-container'>
              {types.map((type) => {
                return (
                  <div
                    className={
                      prefs.isDarkMode
                        ? 'checkbox-container dark-mode'
                        : 'checkbox-container'
                    }
                    key={makeId()}
                  >
                    <label htmlFor={type}>
                      {prefs.isEnglish
                        ? capitalizeFirstLetter(type)
                        : (type === 'gym' && 'חדר כושר') ||
                          (type === 'yoga' && 'יוגה') ||
                          (type === 'swimming' && 'שחייה') ||
                          (type === 'tennis' && 'טניס') ||
                          (type === 'studio' && 'סטודיו')}
                    </label>

                    <input
                      onChange={handleChange}
                      type='checkbox'
                      checked={editTrainer.types.includes(type)}
                      name='types'
                      id={type}
                    />
                  </div>
                )
              })}
            </div>
          </div>
          <LoadingButton variant='contained' type='submit' loading={isLoading}>
            {prefs.isEnglish ? 'Submit' : 'בצע'}
          </LoadingButton>
        </form>
      </section>{' '}
    </>
  )
}
