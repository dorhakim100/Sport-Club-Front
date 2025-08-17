import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { legalService } from '../services/legal.service'

const POLICY_KEY = 'privacy_policy'
const POLICY_VERSION = '2025-01'

export function PrivacyPolicy() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const [checked, setChecked] = useState(
    legalService.isAccepted(POLICY_KEY, POLICY_VERSION)
  )

  const dir = useMemo(
    () => (prefs.isEnglish ? 'ltr' : 'rtl'),
    [prefs.isEnglish]
  )

  const onToggle = (ev) => {
    const next = ev.target.checked
    setChecked(next)
    if (next) legalService.setAcceptance(POLICY_KEY, POLICY_VERSION)
  }

  return (
    <section className='page' style={{ direction: dir }}>
      <h1>{prefs.isEnglish ? 'Privacy Policy' : 'מדיניות פרטיות'}</h1>
      {prefs.isEnglish ? <English /> : <Hebrew />}
      <label
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          marginTop: '1rem',
        }}
      >
        <input type='checkbox' checked={checked} onChange={onToggle} />
        <span>
          {prefs.isEnglish
            ? 'I have read and agree to the Privacy Policy'
            : 'קראתי ואני מסכים/ה למדיניות הפרטיות'}
        </span>
      </label>
    </section>
  )
}

function Hebrew() {
  return (
    <div>
      <p>
        מסמך זה מפרט כיצד מועדון הספורט כפר שמריהו (&quot;המועדון&quot;) אוסף,
        משתמש, שומר ומגן על מידע אישי של משתמשים בהתאם לדין הישראלי, לרבות חוק
        הגנת הפרטיות, התשמ"א-1981 והתקנות מכוחו.
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
      <p>לבקשות בנושא פרטיות: service.kfar@gmail.com או בטלפון 09-958-0404.</p>
      <p style={{ fontSize: '0.9em', marginTop: '1rem' }}>
        גרסה: {POLICY_VERSION}
      </p>
    </div>
  )
}

function English() {
  return (
    <div>
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
      <p>Privacy requests: service.kfar@gmail.com or +972-9-958-0404.</p>
      <p style={{ fontSize: '0.9em', marginTop: '1rem' }}>
        Version: {POLICY_VERSION}
      </p>
    </div>
  )
}
