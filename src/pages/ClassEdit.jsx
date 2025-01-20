import { useSelector } from 'react-redux'

import { useParams, useNavigate } from 'react-router-dom'

import { useEffect, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { styled } from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton'

import { setIsLoading } from '../store/actions/system.actions.js'
import { classService } from '../services/class/class.service.js'
import { loadTrainers } from '../store/actions/trainer.actions.js'
import { updateClass } from '../store/actions/class.actions.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { uploadService } from '../services/upload.service.js'
import { trainerService } from '../services/trainer/trainer.service.js'

import { HeadContainer } from '../cmps/HeadContainer.jsx'
import { DaySelector } from '../cmps/DaySelector.jsx'

import { IntensityRange } from '../cmps/IntensityRange.jsx'

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

export function ClassEdit() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const isLoading = useSelector(
    (storeState) => storeState.systemModule.isLoading
  )

  const params = useParams()
  const navigate = useNavigate()

  const classId = params.classId

  const [clas, setClas] = useState({ trainers: [] })
  const [editClass, setEditClass] = useState(classService.getEmptyClass())
  const [img, setImg] = useState(null)

  const [classTrainers, setClassTrainers] = useState([])

  const trainers = useSelector(
    (stateSelector) => stateSelector.trainerModule.trainers
  )

  const text = {
    he: 'שיעור',
    eng: 'Class',
  }

  useEffect(() => {
    loadClass()
  }, [params.classId])

  async function loadClass() {
    if (params.classId === undefined) return
    try {
      setIsLoading(true)
      const clas = await classService.getById(classId)

      await loadTrainers({ ...trainerService.getDefaultFilter, isAll: true })
      const t = classService.getClassTrainer(clas)
      setClassTrainers(t)
      setEditClass({ ...clas })
      setClas({ ...clas })
      setImg(clas.img)
    } catch (err) {
      console.log(err)
      showErrorMsg('Cannot load class')
      navigate('/class')
    } finally {
      setIsLoading(false)
    }
  }

  function handleChange({ target }, trainer) {
    const field = target.name
    let value = target.value
    let checkedButton = target.id

    const trainers = editClass.trainers
    let newTrainers = []

    const key = prefs.isEnglish ? 'eng' : 'he'

    switch (target.type) {
      case 'number':
      case 'range':
        value = +value || ''

        break

      case 'checkbox':
        if (field === 'trainers') {
          if (trainers.some((t) => t.id === trainer._id)) {
            const idx = editClass.trainers.findIndex(
              (t) => t.id === trainer._id
            )
            editClass.trainers.splice(idx, 1)
            newTrainers = [...editClass.trainers]
          } else {
            newTrainers = editClass.trainers
            newTrainers.push({ id: trainer._id, name: trainer.name })
          }

          setEditClass({ ...editClass })
        }

        return
        break
      case 'text':
        setEditClass({
          ...editClass,
          [field]: {
            ...editClass[field],
            [key]: value,
          },
        })

        return
      case 'textarea':
        setEditClass({
          ...editClass,
          [field]: {
            ...editClass[field],
            [key]: value,
          },
        })

        return
      default:
        break
    }

    setEditClass({ ...editClass, [field]: value })
  }

  async function onSaveClass(ev) {
    ev.preventDefault()
    // const { name, types } = editClass

    setIsLoading(true)
    try {
      const savedClass = await updateClass(editClass)
      showSuccessMsg(
        prefs.isEnglish ? 'Class edited successfully' : 'שיעור נערך בהצלחה'
      )
    } catch (err) {
      console.log(err)
      showErrorMsg(
        prefs.isEnglish ? `Class couldn't be edited` : 'לא היה ניתן לערוך שיעור'
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
      setEditClass({ ...editClass, img: ImgSrc })
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
      <section className='class-edit-container'>
        <div className='img-container'>
          {img && <img src={img} alt='' className='class-img-edit' />}
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
        <form action='' className='class-edit-form' onSubmit={onSaveClass}>
          <div
            className={
              prefs.isDarkMode
                ? 'input-container name dark-mode'
                : 'input-container name'
            }
          >
            {/* <label htmlFor='' style={{ backgroundColor: 'transparent' }}>
              {prefs.isEnglish ? 'name:' : 'כותרת:'}
            </label> */}
            <input
              onChange={handleChange}
              name='title'
              type='text'
              value={prefs.isEnglish ? editClass.title.eng : editClass.title.he}
              style={{ gridColumn: '1/-1' }}
              placeholder={prefs.isEnglish ? 'Name' : 'כותרת'}
            />
          </div>{' '}
          <div
            className={
              prefs.isDarkMode
                ? 'input-container preview dark-mode'
                : 'input-container preview'
            }
          >
            <input
              onChange={handleChange}
              name='preview'
              placeholder={prefs.isEnglish ? 'Preview' : 'תקציר'}
              type='text'
              value={
                prefs.isEnglish ? editClass.preview.eng : editClass.preview.he
              }
              style={{ gridColumn: '1/-1' }}
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
              name='description'
              type='text'
              placeholder={prefs.isEnglish ? 'Description' : 'תיאור'}
              value={
                prefs.isEnglish
                  ? editClass.description.eng
                  : editClass.description.he
              }
            />
          </div>{' '}
          <IntensityRange
            intensity={editClass.intensity}
            handleChange={handleChange}
          />
          <div className='input-container'>
            <div className='class-edit-trainers-container'>
              {/* {trainers.map((trainer) => {
                return (
                  <div
                    className={
                      prefs.isDarkMode
                        ? 'checkbox-container dark-mode'
                        : 'checkbox-container'
                    }
                    key={makeId()}
                  >
                    <label htmlFor={`${trainer._id}ClassEdit`}>
                      {prefs.isEnglish
                        ? capitalizeFirstLetter(trainer.name.eng)
                        : trainer.name.he}
                    </label>

                    <input
                      onChange={(event) => handleChange(event, trainer)}
                      type='checkbox'
                      checked={classTrainers.some((t) => t.id === trainer._id)}
                      name='trainers'
                      id={`${trainer._id}ClassEdit`}
                    />
                  </div>
                )
              })} */}
            </div>
          </div>
          <DaySelector
            editClass={editClass}
            setEditClass={setEditClass}
            trainers={trainers}
          />
          <LoadingButton variant='contained' type='submit' loading={isLoading}>
            {prefs.isEnglish ? 'Submit' : 'בצע'}
          </LoadingButton>
        </form>
      </section>{' '}
    </>
  )
}
