import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import Divider from '@mui/material/Divider'

export function AboutUs() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  function onTellMeMore() {
    console.log('Telling you more')
  }
  return (
    <section className='about-container'>
      <h2>{prefs.isEnglish ? 'About Us' : 'אודות המועדון'}</h2>
      <nav className='page-navigation-container'>
        {/* <NavLink to='facilities'>
          {prefs.isEnglish ? 'Facilities' : 'מתקני המועדון'}
        </NavLink> */}

        <NavLink to='team'>{prefs.isEnglish ? 'Team' : 'צוות המועדון'}</NavLink>
        <Divider orientation='vertical' flexItem />
        <NavLink to='organization'>
          {prefs.isEnglish ? 'Organization' : 'עמותה'}
        </NavLink>
        <Divider orientation='vertical' flexItem />
        <NavLink to='accessibility'>
          {prefs.isEnglish ? 'Accessibility' : 'נגישות'}
        </NavLink>
      </nav>

      <section>
        <Outlet />
      </section>
    </section>
  )
}

export function AboutTeam() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  return (
    <section>
      <h3>{prefs.isEnglish ? 'Team' : 'צוות המועדון'}</h3>{' '}
      <ul>
        <li>Popo Decaprio </li>
        <li>Jini Baba</li>
      </ul>
    </section>
  )
}

export function Organization() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  return (
    <section>
      <h3> {prefs.isEnglish ? 'Organization' : 'עמותה'}</h3>
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
  return (
    <section className='accessibility-container' style={{ direction: 'rtl' }}>
      <h3> {prefs.isEnglish ? 'Accessibility' : 'הצהרת נגישות'}</h3>
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
