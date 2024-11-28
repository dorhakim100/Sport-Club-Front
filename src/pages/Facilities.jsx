import { useSelector } from 'react-redux'
import { useEffect } from 'react'

import { AccordionCmp } from '../cmps/AccordionCmp.jsx'
import { ContactUs } from '../cmps/ContactUs.jsx'

export function Facilities() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  // useEffect(() => {
  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         entry.target.classList.add(prefs.isEnglish ? 'show' : 'show-rtl')
  //         // entry.target.classList.remove('hidden')
  //       } else {
  //         entry.target.classList.remove(prefs.isEnglish ? 'show' : 'show-rtl')
  //       }
  //     })
  //   })

  //   const elements = document.querySelectorAll('.section')
  //   elements.forEach((el) => observer.observe(el))

  //   return () => elements.forEach((el) => observer.unobserve(el))
  // }, [prefs.isEnglish])

  const facilities = [
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731946648/DSC06120_galorc.jpg',
      title: { he: 'בריכת השחייה', eng: 'Swimming Pool' },
      description: {
        he: 'בלה בלה בלה בלה',
        eng: 'lorem ipsum godurms, bla bla bla bla',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732805561/DSC06200_2_hrm9be.jpg',
      title: { he: 'חדר הכושר', eng: 'Gym' },
      description: {
        he: 'בלה בלה בלה בלה',
        eng: 'lorem ipsum godurms, bla bla bla bla',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732805466/DSC06068_qor0tr.jpg',
      title: { he: 'מגרשי הטניס', eng: 'Tennis Courts' },
      description: {
        he: 'בלה בלה בלה בלה',
        eng: 'lorem ipsum godurms, bla bla bla bla',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732541780/WhatsApp_Image_2024-10-29_at_16.16.03_1_ptejag.jpg',
      title: { he: 'בריכת השחייה', eng: 'Swimming Pool' },
      description: {
        he: 'בלה בלה בלה בלה',
        eng: 'lorem ipsum godurms, bla bla bla bla',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732541780/WhatsApp_Image_2024-10-29_at_16.16.03_1_ptejag.jpg',
      title: { he: 'בריכת השחייה', eng: 'Swimming Pool' },
      description: {
        he: 'בלה בלה בלה בלה',
        eng: 'lorem ipsum godurms, bla bla bla bla',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732541780/WhatsApp_Image_2024-10-29_at_16.16.03_1_ptejag.jpg',
      title: { he: 'בריכת השחייה', eng: 'Swimming Pool' },
      description: {
        he: 'בלה בלה בלה בלה',
        eng: 'lorem ipsum godurms, bla bla bla bla',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732541780/WhatsApp_Image_2024-10-29_at_16.16.03_1_ptejag.jpg',
      title: { he: 'בריכת השחייה', eng: 'Swimming Pool' },
      description: {
        he: 'בלה בלה בלה בלה',
        eng: 'lorem ipsum godurms, bla bla bla bla',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732541780/WhatsApp_Image_2024-10-29_at_16.16.03_1_ptejag.jpg',
      title: { he: 'בריכת השחייה', eng: 'Swimming Pool' },
      description: {
        he: 'בלה בלה בלה בלה',
        eng: 'lorem ipsum godurms, bla bla bla bla',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732541780/WhatsApp_Image_2024-10-29_at_16.16.03_1_ptejag.jpg',
      title: { he: 'בריכת השחייה', eng: 'Swimming Pool' },
      description: {
        he: 'בלה בלה בלה בלה',
        eng: 'lorem ipsum godurms, bla bla bla bla',
      },
    },
  ]

  return (
    <section className='facilities-container'>
      <h2> {prefs.isEnglish ? 'Facilities' : 'מתקני המועדון'}</h2>
      <div className='imgs-container'></div>
      <AccordionCmp facilities={facilities} />
      <ContactUs />
    </section>
  )
}
