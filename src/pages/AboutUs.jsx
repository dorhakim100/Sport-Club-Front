import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { Nav } from '../cmps/Nav'
import { HeadContainer } from '../cmps/HeadContainer'
import { GoogleMapCmp } from '../cmps/GoogleMapCmp.jsx'

import { textAnimation } from '../services/util.service'
import { DynamicCover } from '../cmps/DynamicCover'
import { ContactUs } from '../cmps/ContactUs'
import { AccordionCmp } from '../cmps/AccordionCmp'

export function AboutUs() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const location = useLocation()

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
      path: 'times',
      he: 'שעות הפתיחה',
      eng: 'Opening times',
    },
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
    {
      path: 'cancel',
      he: 'ביטולים',
      eng: 'Cencels',
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
      title: {
        he: 'בריכות שחייה ופעוטות',
        eng: 'Semi Olympic Swimming pool and toddler pools',
      },
      description: {
        he: 'מתחם הבריכות כולל בריכה חצי אולימפית ובריכות קטנות לפעוטות, מושלם לכל הגילאים.',
        eng: 'The pool area includes a semi-Olympic pool and toddler pools, perfect for all ages.',
      },
    },
    {
      title: {
        he: 'חדר כושר חדיש ואיכותי',
        eng: 'A modern, high-quality gym',
      },
      description: {
        he: 'חדר הכושר מצויד בציוד המתקדם ביותר ומציע חווית אימון מקצועית.',
        eng: 'The gym is equipped with state-of-the-art equipment and offers a professional workout experience.',
      },
    },
    {
      title: {
        he: 'סטודיו לחוגים בקבוצות קטנות',
        eng: 'A studio for small-group classes',
      },
      description: {
        he: 'סטודיו מודרני למגוון חוגים בקבוצות קטנות, באווירה אישית ותומכת.',
        eng: 'A modern studio offering a variety of small-group classes in a personal and supportive environment.',
      },
    },
    {
      title: {
        he: 'מגרשי טניס',
        eng: 'Tennis courts',
      },
      description: {
        he: 'מגרשי טניס מקצועיים באיכות גבוהה למשחקים ותחרויות.',
        eng: 'High-quality professional tennis courts for games and competitions.',
      },
    },
    {
      title: {
        he: 'סטודיו לפילאטיס מכשירים',
        eng: 'Pilates studio',
      },
      description: {
        he: 'סטודיו ייחודי לפילאטיס מכשירים, לחיזוק וגמישות הגוף.',
        eng: 'A specialized Pilates studio for strengthening and body flexibility.',
      },
    },
    {
      title: {
        he: 'בית ספר לטניס',
        eng: 'Tennis school',
      },
      description: {
        he: 'תכנית מקצועית ללימודי טניס לכל הרמות, מגיל צעיר ועד מתקדמים.',
        eng: 'A professional tennis school for all levels, from young beginners to advanced players.',
      },
    },
    {
      title: {
        he: 'בית ספר לשחייה וקבוצות מאסטרס וטריאתלון',
        eng: 'Swimming school, including Masters and triathlon groups',
      },
      description: {
        he: 'לימודי שחייה מקצועיים, כולל קבוצות למאסטרס וטריאתלטים.',
        eng: 'Professional swimming lessons, including Masters and triathlon groups.',
      },
    },
    {
      title: {
        he: 'מסעדה איכותית',
        eng: 'Restaurant',
      },
      description: {
        he: 'מסעדה מגוונת ואיכותית, המציעה ארוחות בריאות וטעימות.',
        eng: 'A diverse and high-quality restaurant offering healthy and delicious meals.',
      },
    },
    {
      title: {
        he: 'טיפולי אוסטאופתיה ותזונה הוליסטית',
        eng: 'Osteopathy treatments and holistic nutrition services',
      },
      description: {
        he: 'מרכז טיפולים ייחודי לטיפולי אוסטאופתיה וייעוץ תזונתי הוליסטי.',
        eng: 'A unique treatment center offering osteopathy and holistic nutrition consulting.',
      },
    },
  ]

  const covers = {
    about:
      'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733661469/DSC06231_tmop0u.jpg',
  }

  useEffect(() => {
    textAnimation(prefs)
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
              <HeadContainer
                text={{ eng: 'What we offer', he: 'מה במועדון' }}
              />

              {/* <ul className='section'>
                {offers.map((offer) => {
                  return (
                    <li className='hidden' key={makeId()}>
                      {prefs.isEnglish ? offer.eng : offer.he}
                    </li>
                  )
                })}
              </ul> */}
              <div className='section'>
                <AccordionCmp options={offers} />
              </div>
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

export function Cancel() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const headText = { eng: 'Cancel Transaction', he: 'מדיניות ביטולים' }
  return (
    <section>
      <HeadContainer text={headText} />
      <CancelText />
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
      <AccessibilityText />
    </section>
  )
}

function CancelText() {
  return (
    <div className='cancel-container'>
      <h4>ביטול עסקת מכר מרחוק:</h4>
      <span>
        ביטול עסקה בהתאם לתקנות הגנת הצרכן (ביטול עסקה), התשע"א-2010 וחוק הגנת
        הצרכן, התשמ"א-1981
      </span>
      <p>
        עסקת מכר מרחוק היא עסקה לרכישת מוצר או שירות הנעשית בעקבות פניה של עוסק
        לצרכן באמצעות דואר, טלפון, רדיו, טלוויזיה, תקשורת אלקטרונית, פרסום כלשהו
        וכדומה, המזמינה את הצרכן להתקשר בעסקה שלא על ידי הגעה לבית העסק. בשלב
        השיווק - העוסק חייב לגלות לצרכן בין השאר: את שמו כתובתו, ת.ז./ח.פ, מחיר
        העסקה ותנאי התשלום, תכונות עיקריות של המוצר או השירות, מועד ודרך אספקה,
        פרטים בדבר האחריות, התקופה שבה ההצעה תהיה בתוקף ופרטים אודות זכות
        הביטול. בעת ביצוע העסקה - העוסק חייב לספק לצרכן לא יאוחר מיום קבלת המוצר
        או השירות חוזה או טופס גילוי נאות בו מציינים הפרטים המהותיים לעסקה. בין
        השאר: פרטי העוסק, התכונות העיקריות של המוצר או השירות מחיר המוצר או
        השירות, פרטים בדבר זכות הביטול, שם היצרן, ארץ ייצור, מידע בדבר תנאי
        האחריות וכל תנאי נוסף שחל על העסקה.
      </p>
      <ul>
        <b>הצרכן רשאי לבטל עסקת מכר מרחוק:</b>
        <li>
          במוצר - בתוך 14* יום מיום קבלת המוצר או מיום קבלת החוזה/טופס גילוי
          נאות לפי המאוחר.
        </li>
        <li>
          בשירות מתמשך (בין אם קצוב לתקופה מסוימת ובין אם לא) - תוך 14* יום
          מעשיית העסקה או מיום קבלת החוזה/טופס גילוי נאות לפי המאוחר, בין אם
          הוחל במתן השירות ובין אם לאו.
        </li>
        <li>
          בשירות חד פעמי - תוך 14* יום מעשיית העסקה או מיום קבלת החוזה/טופס
          גילוי נאות לפי המאוחר בתנאי שהביטול יעשה לפחות 2 ימים שאינם ימי
          מנוחה** לפני מועד מתן השירות.
        </li>
        <b>ניתן לבטל באחת מהדרכים הבאות:</b>
        <li>
          בעל פה – בטלפון או בהודעה בעל פה במקום העסק, למעט אם נקבע לפי החוק כי
          ביטול העסקה ייעשה בדרך של הודעה בכתב.
        </li>
        <li>בדואר רשום.</li>
        <li>בדואר אלקטרוני (מייל).</li>
        <li>בפקסימיליה, אם יש לעוסק.</li>
        <li>באינטרנט – בעסקה שניתן להתקשר לגביה עם צרכן באמצעי זה.</li>
        <li>
          מומלץ – לשמור תיעוד של הבקשה לביטול העסקה על מנת שתהיה לכם הוכחה לעצם
          ביטול העסקה
        </li>
      </ul>
      <p>
        צרכן שהוא אדם עם מוגבלות, אזרח ותיק או עולה חדש (העוסק רשאי לבקש תעודה
        המוכיחה זאת) – רשאי לבטל את העסקה תוך 4 חודשים מיום עשיית ההסכם או מיום
        מסירת המוצר או מיום קבלת מסמך גילוי הפרטים הנדרשים על פי החוק, לפי
        המאוחר מביניהם, כל עוד התבעה שיחה רציפה (טלפונית או צ'אט) של האדם עם
        העוסק.
      </p>
      <p>
        * יש לציין כי ישנה מחלוקת בבתי המשפט האם כאשר צרכן רוכש שירותי תיירות
        באמצעות הטלפון בעקבות מודעה או אתר אינטרנט של העוסק, קיימת לצרכן זכות
        ביטול מורחבת מכוח סעיף 14ג1. המחלוקת נסובה בעיקר סביב השאלה האם מדובר
        בעסקת מכר מרחוק, כאשר יש פסיקות שקובעות שאכן מדובר בעסקת מכר מרחוק ועל
        כן הזכות קיימת ויש פסיקות לפיהן כדי שתקום הזכות צריכה להיות פניה יזומה
        של העוסק ולא די בקיומו של אתר באינטרנט או מודעה. עמדת הרשות מצדדת בגישה
        הראשונה לפיה הגדרת עסקת מכר מרחוק בחוק אינה דורשת פניה יזומה דווקא
        וקיומו של אתר אינטרנט או מודעה של העוסק הפונה לצרכנים לביצוע עסקה מהווה
        שיווק מרחוק אשר בעקבותיו יכולה להירקם עסקת מכר מרחוק.
      </p>
      <p>
        אם הצרכן ביטל עסקת מכר מרחוק בה נרכש נכס או שירות עקב פגם או אי התאמה
        בין הנכס או השירות או אי אספקה במועד או הפרה חוזית אחרת, חייב העוסק
        להשיב לצרכן את כספו תוך 14* יום מיום קבלת הודעת הביטול ולקחת את המוצר
        מביתו של הצרכן ואסור לו לגבות דמי ביטול.
      </p>
      <p>
        במקרה שהביטול נעשה על ידי הצרכן מכל סיבה אחרת חייב הצרכן להחזיר את המוצר
        לעוסק על חשבונו והעוסק רשאי לדרוש דמי ביטול בסך 5% ממחיר הנכס או העסקה
        או 100 ש"ח לפי הנמוך מביניהם בלבד. אי החזרת המוצר אינה תנאי לביטול
        העסקה.
      </p>
      <p>
        ביטול רכישה של שירותי הארחה, נסיעה, חופש או בילוי ניתן לעשות תוך 14* יום
        מעשיית העסקה או קבלת החוזה או טופס גילוי נאות ובתנאי שעד מועד מתן השירות
        יש יותר מ 7* ימים שאינם ימי מנוחה**.
      </p>
      <p>
        במקרה של ביטול עסקה בה נרכש שירות מתמשך שכבר התחיל בפועל, על הצרכן לשלם
        את התמורה היחסית בעד השירות שכבר ניתן.
      </p>

      <p>
        אם בוצעה התקנה של מוצר (טובין) בבית של הצרכן, לצורך מתן השירות, רשאי
        העוסק לגבות הוצאות התקנה עד 100 ₪ (בנוסף לדמי הביטול אם הביטול נעשה שלא
        עקב פגם או אי התאמה וכולי).
      </p>

      <b>לא ניתן לבטל עסקת מכר מרחוק במקרים הבאים:</b>
      <ul>
        <li>
          רכישה של שירותי הארחה, נסיעה, חופש או בילוי 7* ימים או פחות שאינם ימי
          מנוחה** לפני מועד מתן השירות.
        </li>
        <li>
          נרכשו מוצרים פסידים (ובכלל זה נכסים מתכלים, בעלי חיי מדף קצרים). נרכשו
          מוצרים שיוצרו במיוחד עבור הצרכן.
        </li>
        <li>
          נרכשו מוצרים הניתנים לשעתוק או הקלטה או שכפול שאריזתם המקורית נפתחה
          (למשל תקליטורים).
        </li>
        <li>נרכש מידע כהגדרתו בחוק המחשבים.</li>
      </ul>
      <b>הבהרות:</b>
      <p>
        * בהתאם לחוק הפרשנות הימים נספרים מהיום למחרת וכוללים ימי מנוחה, פגרה או
        שבתון אלא אם הם הימים האחרונים בתקופה (לדוגמה: אם המועד האחרון הוא יום
        שבת, המועד האחרון ידחה ליום ראשון שאחריו).
      </p>
      <p>
        ** "יום מנוחה" בהגדרתו: יום שבת ויום מנוחה קבועים בחוק שעות עבודה ומנוחה
        ופקודת סדרי השלטון והמשפט. יום מנוחה הינו יום שבת או חג בלבד. על כן עוסק
        הפתוח 5 ימים בשבוע עדיין מחויב להוראות החוק הקובעות מהם ימי המנוחה ללא
        התחשבות בכמה ימים בפועל פתוח בית העסק.
      </p>
    </div>
  )
}

function AccessibilityText() {
  return (
    <div className='accessibility-text-container'>
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
        אימייל: sportclub.kfar@gmail.com
        <br />
        עודכן לאחרונה בתאריך 08/11/2021
      </p>
    </div>
  )
}
