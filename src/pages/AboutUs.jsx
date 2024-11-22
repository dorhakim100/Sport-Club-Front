import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import { Nav } from '../cmps/Nav'
import { HeadContainer } from '../cmps/HeadContainer'
import { GoogleMapCmp } from '../cmps/GoogleMapCmp.jsx'

import Divider from '@mui/material/Divider'
import { makeId } from '../services/util.service'
import { DynamicCover } from '../cmps/DynamicCover'
import { ContactUs } from '../cmps/ContactUs'

export function AboutUs() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const location = useLocation()

  function onTellMeMore() {}

  const origin = {
    path: '/about',
    he: 'אודות',
    eng: 'About',
  }

  const links = [
    // {
    //   path: 'team',
    //   he: 'צוות המועדון',
    //   eng: 'Team',
    // },
    {
      path: 'organization',
      he: 'עמותה',
      eng: 'Organization',
    },
    {
      path: 'accessibility',
      he: 'נגישות',
      eng: 'Accessibility',
    },
  ]

  const headText = {
    he: 'אודות',
    eng: 'About',
  }

  const preview1 = {
    he: `מועדון ספורט ונופש כפר שמריהו ממוקם בלב הכפר. מוקף בירק ובעצים הממזגים את המקום עם טבע ושלווה פסטורלית. המועדון משרת מספר מצומצם של מנויים, דבר ההופך אותו לייחודי ולנקודת מפגש אידיאלית למשפחות למטרות בילוי, נופש וספורט.`,

    eng: `Kfar Shmaryahu Sports Club is located in the heart of the village, surrounded by greenery and trees that blend the space with nature and pastoral tranquility. The club serves a limited number of members, making it unique and an ideal meeting place for families seeking recreation, leisure, and sports activities.
    `,
  }

  const preview2 = {
    he: `
    צוות המועדון מקפיד על קשר חם ואישי עם המנויים, שומר על צביון כפרי, שקט ואינטימי ומהווה עבור קהל המנויים והמבקרים האיכותי שמגיעים אי של שקט הממוקם בפנינה ירוקה, נעימה ושלווה, בלב כפר שמריהו.

    המועדון מקיים מגוון פעילויות לכל הגילאים כולל פעילויות לבוגרים, ילדים, גיל הזהב ופעילויות משותפות לכל המשפחה.`,
    eng: `
    The club staff ensures warm and personal connections with its members, maintaining a quiet, intimate, and rural character. For the high-quality members and visitors, the club serves as an oasis of peace nestled in a green, pleasant, and serene haven in the heart of Kfar Shmaryahu.
    The club offers a variety of activities for all ages, including programs for adults, children, seniors, and shared family activities.
    
    `,
  }

  const offers = [
    {
      he: 'בריכות שחייה ופעוטות',
      eng: `Semi Olympic Swimming pool and toddler pools`,
    },
    {
      he: `חדר כושר חדיש ואיכותי`,
      eng: `A modern, high-quality gym`,
    },
    {
      he: `סטודיו לחוגים בקבוצות קטנות`,
      eng: `A studio for small-group classes`,
    },
    {
      he: `מגרשי טניס`,
      eng: `Tennis courts`,
    },
    {
      he: `סטודיו לפילאטיס מכשירים`,
      eng: `Pilates studio`,
    },
    {
      he: `בית ספר לטניס`,
      eng: `Tennis school`,
    },
    {
      he: `בית ספר לשחייה וקבוצות מאסטרס וטריאתלון`,
      eng: `Swimming school, including Masters and triathlon groups`,
    },
    {
      he: `מסעדה איכותית`,
      eng: `Restaurant`,
    },
    {
      he: `טיפולי אוסטאופתיה ותזונה הוליסטית`,
      eng: `Osteopathy treatments and holistic nutrition services`,
    },
  ]

  const covers = {
    about:
      'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731946218/DSC06479_b6n2yd.jpg',
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const timeout = index + 1
          setTimeout(() => {
            entry.target.classList.add(prefs.isEnglish ? 'show' : 'show-rtl')
          }, 100)
          // entry.target.classList.remove('hidden')
        } else {
          entry.target.classList.remove(prefs.isEnglish ? 'show' : 'show-rtl')
        }
      })
    })

    const elements = document.querySelectorAll('.section')
    elements.forEach((el) => observer.observe(el))

    return () => elements.forEach((el) => observer.unobserve(el))
  }, [prefs.isEnglish, location.pathname])

  return (
    <section className='about-container'>
      <h2>{prefs.isEnglish ? 'About Us' : 'אודות המועדון'}</h2>
      <Nav origin={origin} links={links} />

      {location.pathname === '/about' && (
        <>
          <HeadContainer text={headText} />
          <div className='about-page-container'>
            <div className='about-text-container'>
              <div className='section'>
                <p className='hidden'>
                  {prefs.isEnglish ? preview1.eng : preview1.he}
                </p>
              </div>
              <div className='section'>
                <p className='hidden'>
                  {prefs.isEnglish ? preview2.eng : preview2.he}
                </p>
              </div>
            </div>
            <div className='offer-container'>
              <b>{prefs.isEnglish ? 'What we offer' : 'מה במועדון'}</b>
              <ul className='section'>
                {offers.map((offer) => {
                  return (
                    <li className='hidden' key={makeId()}>
                      {prefs.isEnglish ? offer.eng : offer.he}
                    </li>
                  )
                })}
              </ul>
            </div>
            {/* <div className='section hidden'> */}
            <DynamicCover coverSrc={covers.about} prefs={prefs} />
            <GoogleMapCmp />
            <div className='section end-container'>
              <p>
                {prefs.isEnglish
                  ? `We invite you to invest in your Wellbeing all year-round for both body and soul, with sports and leisure activities for the entire family.`
                  : 'אנו מזמינים אתכם בכל ימות השנה להשקיע בעצמכם למען הגוף והנפש בפעילות ספורטיבית ונופש לכל המשפחה.'}
              </p>
            </div>
          </div>
          <ContactUs />
          {/* </div> */}
        </>
      )}

      {/* <div className='about-container'> */}

      {/* </div> */}
      <section>
        <Outlet />
      </section>
    </section>
  )
}

export function AboutTeam() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const headText = { eng: 'Team', he: 'צוות המועדון' }
  return (
    <section>
      <HeadContainer text={headText} />

      <ul>
        <li>Popo Decaprio </li>
        <li>Jini Baba</li>
      </ul>
    </section>
  )
}

export function Organization() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const headText = { eng: 'Organization', he: 'עמותה' }
  return (
    <section>
      <HeadContainer text={headText} />
      <ul>
        <li>Save the day</li>
        <li>Spread some love</li>
        <li>Take over the world</li>
      </ul>
    </section>
  )
}

export function AccessibilityPage() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const headText = { eng: 'Accessibility', he: 'הצהרת נגישות' }

  return (
    <section className='accessibility-container' style={{ direction: 'rtl' }}>
      <HeadContainer text={headText} />

      <p>
        אגודת הספורט כפר שמריהו ("האגודה") נוקטת את מירב המאמצים ומשקיעה משאבים
        רבים על מנת לספק לכל לקוחותיה שירות שוויוני, מכובד, נגיש ומקצועי. בהתאם
        לחוק שוויון זכויות לאנשים עם מוגבלויות, התשנ"ח-1998 ולתקנות שהותקנו
        מכוחו, מושקעים מאמצים ומשאבים רבים בביצוע התאמות הנגישות הנדרשות שיביאו
        לכך שאדם בעל מוגבלות יוכל לקבל את השירותים הניתנים לכלל הלקוחות, באופן
        עצמאי ושוויוני.
      </p>
      <h4>נגישות אתר האינטרנט</h4>
      <ul>
        <li>
          על פי סעיף 35 לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות
          לשירות), התשע"ג-2013, אתר אינטרנט המעניק שירות ציבורי או מידע אודות
          שירות ציבורי, נדרש להיות נגיש ולעמוד בהנחיות התקן הישראלי לנגישות 5568
          של מכון התקנים. אתר אינטרנט נגיש הוא אתר המאפשר לאנשים עם מוגבלות
          לגלוש באותה רמה של יעילות והנאה ככל הגולשים.
        </li>
        <li>
          האגודה מאמינה ופועלת למען שוויון הזדמנויות במרחב האינטרנטי לבעלי
          לקויות מגוונות ואנשים הנעזרים בטכנולוגיה מסייעת לשימוש במחשב. בהתאם,
          אתר זה עומד בדרישות התקנות הנ"ל.
        </li>
        <li>
          התאמות הנגישות בוצעו על פי הוראות התקן הישראלי (ת"י 5568) לנגישות
          תכנים באינטרנט ברמת AA ומסמך WCAG 2.0 הבינלאומי.
        </li>
        <li>
          באתר מוצב תפריט נגישות. לחיצה על התפריט באמצעות העכבר או ניווט בעזרת
          כפתור TAB שבמקלדת מאפשרת פתיחת כפתורי ההנגשה. כדי לסגור את התפריט
          תוכלו ללחוץ על כפתור הסגירה או ללחוץ במקלדת על כפתור ה-'ESC' או
          באמצעות לחיצה עם העכבר.
        </li>
        <li>האתר מותאם לתצוגה בדפדפנים הנפוצים ולשימוש בטלפון הסלולרי.</li>
        <li>
          להלן חלק מהפעולות שבוצעו במסגרת הנגשת האתר והאפשרויות הקיימות בו:
          <ul>
            <li>הגדלת התצוגה האתר</li>
            <li>צביעת האתר לגווני אפור</li>
            <li>יצירת מצב נגטיב (צבעים הפוכים)</li>
            <li>הגדלת סמן העכבר</li>
            <li>הדגשת הקישורים</li>
            <li>ניווט באמצעות המקלדת ללא שימוש בעכבר.</li>
          </ul>
        </li>
      </ul>
      <h4>הסדרי הנגישות במועדון הספורט</h4>
      <ul>
        <li>5 חניות נכים בחניון של המועדון</li>
        <li>כניסה ראשית מונגשת</li>
        <li>מעלית</li>
        <li>בריכה שחיה – הנגשה מלאה כולל גישה לבעלי מוגבלות</li>
        <li>מלתחות מונגשות</li>
        <li>מדרגות ודרכי גישה מונגשים לבעלי לקות ראייה</li>
        <li>חדר חוגים מונגש</li>
        <li>מסעדה מונגשת</li>
        <li>אתר אינטרנט מונגש</li>
      </ul>
      <h4>דרכי פנייה לבקשות והצעות לשיפור בנושא נגישות</h4>
      <p>
        יש לציין כי אנו ממשיכים במאמצים לשפר את נגישות החברה כחלק ממחויבותנו
        לאפשר לכלל האוכלוסייה לקבל את השרות הנגיש ביותר. אם נתקלת בבעיה או בתקלה
        כלשהי בנושא הנגישות, נשמח אם תיידע אותנו על כך ואנו נעשה כל מאמץ למצוא
        עבורך פתרון מתאים ולטפל בתקלה בהקדם ככל שניתן.
      </p>
      <h4>פרטי רכז הנגישות</h4>
      <p>
        תמיר ישבי
        <br />
        טל: 050-8833262
        <br />
        אימייל: sportclub.kfar@gmail.com
        <br />
        עודכן לאחרונה בתאריך 08/11/2021
      </p>
    </section>
  )
}
