import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { legalService } from '../services/legal.service'

const POLICY_KEY = 'terms_of_use'
const POLICY_VERSION = '2025-01'

export function TermsOfUse() {
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
      <h1>{prefs.isEnglish ? 'Terms of Use' : 'תנאי שימוש'}</h1>
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
            ? 'I have read and agree to the Terms of Use'
            : 'קראתי ואני מסכים/ה לתנאי השימוש'}
        </span>
      </label>
    </section>
  )
}

function Hebrew() {
  return (
    <div>
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
      <p style={{ fontSize: '0.9em', marginTop: '1rem' }}>
        Version: {POLICY_VERSION}
      </p>
    </div>
  )
}
