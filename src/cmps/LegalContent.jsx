import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Lottie from 'react-lottie'
import noticeAnimation from '/public/imgs/notification.json'

export function PrivacyModalContent() {
  return <LegalModal policyKey='privacy_policy' />
}
export function TermsModalContent() {
  return <LegalModal policyKey='terms_of_use' />
}
export function CookiesModalContent() {
  return <LegalModal policyKey='cookies_policy' />
}

function LegalModal({ policyKey }) {
  const prefs = useSelector((s) => s.systemModule.prefs)
  const isEnglish = prefs.isEnglish
  const dir = useMemo(() => (isEnglish ? 'ltr' : 'rtl'), [isEnglish])

  const defaultOptions = useMemo(
    () => ({
      loop: true,
      autoplay: true,
      animationData: noticeAnimation,
      rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
    }),
    []
  )

  const title = getTitle(policyKey, isEnglish)

  const className = useMemo(() => {
    const type = getTitle(policyKey, true)
    return type.toLowerCase().replace(' ', '-')
  }, [policyKey])

  return (
    <div style={{ display: 'grid', gap: 12, direction: dir }} className={`legel-content-container ${className}`}>
      <div style={{ justifySelf: 'center' }}>
        <Lottie options={defaultOptions} height={120} width={120} />
      </div>
      <b style={{ fontSize: '1.1em', justifySelf: 'center' }}>{title}</b>
      {/* <div className="legel-content"> */}

        {renderContent(policyKey, isEnglish)}
      {/* </div> */}
    </div>
  )
}

LegalModal.propTypes = {
  policyKey: PropTypes.oneOf([
    'privacy_policy',
    'terms_of_use',
    'cookies_policy',
  ]).isRequired,
}

function getTitle(key, isEnglish) {
  switch (key) {
    case 'privacy_policy':
      return isEnglish ? 'Privacy Policy' : 'מדיניות פרטיות'
    case 'terms_of_use':
      return isEnglish ? 'Terms of Use' : 'תנאי שימוש'
    case 'cookies_policy':
      return isEnglish ? 'Cookies Policy' : 'מדיניות קוקיז'
    default:
      return ''
  }
}

function renderContent(key, isEnglish) {
  if (key === 'privacy_policy') return isEnglish ? <PrivacyEn /> : <PrivacyHe />
  if (key === 'terms_of_use') return isEnglish ? <TermsEn /> : <TermsHe />
  return isEnglish ? <CookiesEn /> : <CookiesHe />
}

function PrivacyHe() {
  return (
    <div className='policy-container'>
      <p>
        מסמך זה מפרט כיצד מועדון הספורט כפר שמריהו (&quot;המועדון&quot;) אוסף,
        משתמש, שומר ומגן על מידע אישי של משתמשים בהתאם לדין הישראלי, לרבות חוק
        הגנת הפרטיות, התשמ&quot;א-1981 והתקנות מכוחו.
      </p>
      <h3>איזה מידע נאסף</h3>
      <ul>
        <li>פרטי זיהוי: שם מלא, מספר טלפון, דוא&quot;ל, כתובת.</li>
        <li>מידע שימוש: עמודים שנצפו, פעולות שבוצעו באתר, נתוני מכשיר.</li>
        <li>
          מידע תשלום: כפי שמסופק על ידי ספקי הסליקה המורשים. איננו שומרים פרטי
          כרטיס.
        </li>
      </ul>
      <h3>מטרות העיבוד</h3>
      <ul>
        <li>מתן שירותים ותפעול האתר.</li>
        <li>ניהול הזמנות, מנויים ותשלומים.</li>
        <li>שיפור חוויית המשתמש, התאמות אישיות, ואבטחת מידע.</li>
        <li>שליחת דיוור ועדכונים בכפוף להסכמה וכדין.</li>
      </ul>
      <h3>שיתוף מידע</h3>
      <p>
        מידע אישי עשוי להיות משותף עם ספקי שירות לצורך תפעול האתר, עיבוד
        תשלומים, מסירת הודעות, ואבטחה — בכפוף להתחייבויות סודיות והגנת פרטיות.
      </p>
      <h3>זכויות המשתמש</h3>
      <ul>
        <li>זכות לעיין במידע, לתקנו, ולעדכנו לפי חוק הגנת הפרטיות.</li>
        <li>זכות לבקש מחיקה או התנגדות לעיבוד, בכפוף לחובותינו על פי דין.</li>
      </ul>
      <h3>אבטחת מידע ושמירה</h3>
      <p>
        אנו מיישמים אמצעי אבטחה סבירים לשמירת המידע ונשמור אותו למשך התקופה
        הנדרשת למטרותיהן נאסף ולפי הדין.
      </p>
      <h3>יצירת קשר</h3>
      <p>לבקשות בנושא פרטיות: service.kfar@gmail.com</p>
    </div>
  )
}
function PrivacyEn() {
  return (
    <div className='policy-container'>
      <p>
        This document explains how Sport Club Kfar Shmaryahu (&quot;the
        Club&quot;) collects, uses, stores, and protects personal data under
        Israeli law, including the Protection of Privacy Law, 1981, and
        regulations.
      </p>
      <h3>Data we collect</h3>
      <ul>
        <li>Identifiers: full name, phone, email, address.</li>
        <li>Usage data: pages viewed, actions, device data.</li>
        <li>
          Payments: processed by authorized providers. We do not store card
          details.
        </li>
      </ul>
      <h3>Purposes</h3>
      <ul>
        <li>Provide services and operate the site.</li>
        <li>Manage orders, memberships, and payments.</li>
        <li>Improve user experience and security.</li>
        <li>Send updates/marketing with consent and as permitted by law.</li>
      </ul>
      <h3>Sharing</h3>
      <p>
        We may share data with service providers for operations, payment
        processing, communications, and security, under confidentiality and
        privacy obligations.
      </p>
      <h3>User rights</h3>
      <ul>
        <li>Right to access and correct data under the Privacy Law.</li>
        <li>
          Right to request deletion or object to processing subject to legal
          duties.
        </li>
      </ul>
      <h3>Security and retention</h3>
      <p>
        We apply reasonable security measures and retain data only as required
        for the purposes collected and by law.
      </p>
      <h3>Contact</h3>
      <p>Privacy requests: service.kfar@gmail.com</p>
    </div>
  )
}

function TermsHe() {
  return (
    <div className='policy-container'>
      <p>
        תנאי שימוש אלה מסדירים את השימוש באתר מועדון הספורט כפר שמריהו. השימוש
        באתר מהווה הסכמה לתנאים אלה ולמדיניות הפרטיות.
      </p>
      <h3>שימוש מותר</h3>
      <ul>
        <li>השימוש באתר לצרכים אישיים וחוקיים בלבד.</li>
        <li>אין לבצע פעולות הפוגעות בתפקוד האתר או בזכויות צדדים שלישיים.</li>
      </ul>
      <h3>רישום ורכישות</h3>
      <ul>
        <li>בעת ביצוע רכישה ו/או הרשמה, עליכם לספק פרטים נכונים ומדויקים.</li>
        <li>
          המחירים, המבצעים והזמינות כפופים לשינויים לפי שיקול דעת המועדון.
        </li>
      </ul>
      <h3>קניין רוחני</h3>
      <p>
        כל התכנים באתר, כולל סימני מסחר, טקסטים, תמונות וסרטונים, מוגנים בזכויות
        יוצרים ואסור לעשות בהם שימוש ללא אישור מראש ובכתב מהמועדון.
      </p>
      <h3>הגבלת אחריות</h3>
      <p>
        המועדון עושה מאמץ לספק מידע ושירותים תקינים. עם זאת, השימוש באתר הינו על
        אחריותכם בלבד, והמועדון לא יהיה אחראי לכל נזק עקיף ו/או תוצאתי הנובע
        מהשימוש באתר.
      </p>
      <h3>שיפוי</h3>
      <p>
        אתם מתחייבים לשפות את המועדון בגין כל נזק, תביעה או הוצאה עקב הפרת תנאים
        אלה.
      </p>
      <h3>דין ושיפוט</h3>
      <p>
        על תנאים אלה יחולו דיני מדינת ישראל, וסמכות השיפוט הבלעדית נתונה לבתי
        המשפט במחוז תל אביב.
      </p>
    </div>
  )
}
function TermsEn() {
  return (
    <div className='policy-container'>
      <p>
        These Terms of Use govern your use of the Sport Club Kfar Shmaryahu
        website. By using the site you agree to these Terms and the Privacy
        Policy.
      </p>
      <h3>Permitted use</h3>
      <ul>
        <li>Use the site only for lawful, personal purposes.</li>
        <li>Do not interfere with the site or infringe others&apos; rights.</li>
      </ul>
      <h3>Registration and purchases</h3>
      <ul>
        <li>
          Provide accurate information when registering or making purchases.
        </li>
        <li>
          Prices, promotions, and availability may change at the Club&apos;s
          discretion.
        </li>
      </ul>
      <h3>Intellectual property</h3>
      <p>
        All content, including trademarks, text, images, and videos, is
        protected by copyright. Do not use without prior written permission from
        the Club.
      </p>
      <h3>Limitation of liability</h3>
      <p>
        The Club strives to provide accurate information and proper services;
        however, your use is at your own risk and the Club will not be liable
        for indirect or consequential damages arising from use of the site.
      </p>
      <h3>Indemnity</h3>
      <p>
        You agree to indemnify the Club for any damage, claim, or expense due to
        your breach of these Terms.
      </p>
      <h3>Governing law and jurisdiction</h3>
      <p>
        These Terms are governed by the laws of the State of Israel. Exclusive
        jurisdiction lies with the competent courts in the Tel Aviv District.
      </p>
    </div>
  )
}

function CookiesHe() {
  return (
    <div className='policy-container'>
      <p>
        האתר עושה שימוש בעוגיות (Cookies) לצורך תפעול תקין, מדידה סטטיסטית,
        התאמת חוויית משתמש ואבטחה. ניתן לשנות את הגדרות הדפדפן כדי לחסום או
        למחוק עוגיות, אולם ייתכן שחלק מהשירותים לא יפעלו כראוי.
      </p>
      <h3>סוגי עוגיות</h3>
      <ul>
        <li>חיוניות: נדרשות לתפעול בסיסי של האתר.</li>
        <li>ביצועים וסטטיסטיקה: למדידת שימוש ושיפור חוויית המשתמש.</li>
        <li>העדפות: לשמירת שפה, מצב כהה וכד׳.</li>
      </ul>
      <h3>ניהול עוגיות</h3>
      <p>
        ניתן לנהל העדפות עוגיות באמצעות הגדרות הדפדפן. בחלק מהמכשירים ניתן גם
        באמצעות הגדרות מערכת ההפעלה.
      </p>
    </div>
  )
}
function CookiesEn() {
  return (
    <div className='policy-container'>
      <p>
        This site uses cookies for proper operation, statistics, user experience
        personalization, and security. You can adjust your browser settings to
        block or delete cookies; some services may not function properly if
        cookies are disabled.
      </p>
      <h3>Types of cookies</h3>
      <ul>
        <li>Essential: required for basic site functionality.</li>
        <li>
          Performance/Analytics: to measure usage and improve the experience.
        </li>
        <li>Preferences: to remember language, dark mode, etc.</li>
      </ul>
      <h3>Managing cookies</h3>
      <p>
        You can manage cookie preferences through your browser settings and, on
        some devices, the operating system settings.
      </p>
    </div>
  )
}
