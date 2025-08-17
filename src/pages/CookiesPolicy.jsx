import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { legalService } from '../services/legal.service'

const POLICY_KEY = 'cookies_policy'
const POLICY_VERSION = '2025-01'

export function CookiesPolicy() {
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
      <h1>{prefs.isEnglish ? 'Cookies Policy' : 'מדיניות קוקיז'}</h1>
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
            ? 'I have read and agree to the Cookies Policy'
            : 'קראתי ואני מסכים/ה למדיניות הקוקיז'}
        </span>
      </label>
    </section>
  )
}

function Hebrew() {
  return (
    <div>
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
      <p style={{ fontSize: '0.9em', marginTop: '1rem' }}>
        Version: {POLICY_VERSION}
      </p>
    </div>
  )
}
