import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { legalService } from '../services/legal.service'
import { setIsModal, setModalMessage } from '../store/actions/system.actions'
import { useNavigate } from 'react-router-dom'
import {
  CookiesModalContent,
  PrivacyModalContent,
  TermsModalContent,
} from './LegalContent'
import { getCurrMonth } from '../services/util.service'
import { smoothScroll } from '../services/util.service'

const POLICY_KEY = 'cookies_privacy_terms_policy'
const POLICY_VERSION = `2025-${getCurrMonth()}`

export function CookieAgreement() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const navigate = useNavigate()

  const [accepted, setAccepted] = useState(
    legalService.isAccepted(POLICY_KEY, POLICY_VERSION)
  )
  const [checked, setChecked] = useState(false)

  const dir = useMemo(
    () => (prefs.isEnglish ? 'ltr' : 'rtl'),
    [prefs.isEnglish]
  )

  if (accepted) return null

  const openCookiesModal = () => {
    setModalMessage({
      eng: 'Cookies Policy',
      he: 'מדיניות קוקיז',
      extra: <CookiesModalContent />,
    })
    setIsModal(true)
  }

  const openPrivacyModal = () => {
    // setModalMessage({
    //   eng: 'Privacy Policy',
    //   he: 'מדיניות פרטיות',
    //   extra: <PrivacyModalContent />,
    // })
    // setIsModal(true)
    navigate('/about/privacy')
    smoothScroll()
  }

  const openTermsModal = () => {
    setModalMessage({
      eng: 'Terms of Use',
      he: 'תנאי השימוש שלנו',
      extra: <TermsModalContent />,
    })
    setIsModal(true)
  }

  const onAccept = () => {
    if (!checked) return
    legalService.setAcceptance(POLICY_KEY, POLICY_VERSION)
    setAccepted(true)
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: prefs.isDarkMode ? '#2B373B' : '#f4f7f9',
        color: prefs.isDarkMode ? '#fff' : '#2C3E50',
        padding: '8px 16px',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.15)',
        direction: dir,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          flex: 1,
          minWidth: 250,
        }}
      >
        <span>
          {prefs.isEnglish
            ? 'We use cookies to enhance your experience, for analytics and security.'
            : 'אנו משתמשים בקוקיז לשיפור החוויה, למדדים סטטיסטיים ולאבטחה.'}
        </span>
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={openCookiesModal}
            style={{
              color: '#4A90E2',
              textDecoration: 'underline',
              width: 'fit-content',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            {prefs.isEnglish
              ? 'Read our Cookies Policy'
              : 'לקריאת מדיניות הקוקיז'}
          </button>
          <button
            onClick={openPrivacyModal}
            style={{
              color: '#4A90E2',
              textDecoration: 'underline',
              width: 'fit-content',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            {prefs.isEnglish
              ? 'Read our Privacy Policy'
              : 'לקריאת מדיניות הפרטיות'}
          </button>
          <button
            onClick={openTermsModal}
            style={{
              color: '#4A90E2',
              textDecoration: 'underline',
              width: 'fit-content',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            {prefs.isEnglish
              ? 'Read our Terms of Use'
              : 'לקריאת תנאי השימוש שלנו'}
          </button>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span>
            {prefs.isEnglish
              ? 'I have read and agree to the Cookies Policy, Privacy Policy and Terms of Use'
              : 'קראתי ואני מסכים/ה למדיניות הקוקיז, פרטיות ותנאי השימוש'}
          </span>
        </label>
      </div>
      <button
        onClick={onAccept}
        disabled={!checked}
        style={{
          background: checked ? '#4A90E2' : '#9bbce0',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: 4,
          cursor: checked ? 'pointer' : 'not-allowed',
          fontSize: 14,
        }}
      >
        {prefs.isEnglish ? 'Accept' : 'אישור'}
      </button>
    </div>
  )
}
