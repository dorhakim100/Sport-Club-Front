import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { Nav } from '../cmps/Nav'
import { HeadContainer } from '../cmps/HeadContainer'
import { DynamicCover } from '../cmps/DynamicCover'
import { InstagramPost } from '../cmps/InstagramPost'
import { ActivityInfo } from '../cmps/ActivityInfo.jsx'
import { Cards } from '../cmps/Cards'
import { ContactUs } from '../cmps/ContactUs'
import { SwiperCarousel } from '../cmps/SwiperCarousel'

import Divider from '@mui/material/Divider'
import { Button } from '@mui/material'

import whatsapp from '/public/imgs/whatsapp.svg'
import { showErrorMsg } from '../services/event-bus.service'
import { loadTrainers } from '../store/actions/trainer.actions'
import { trainerService } from '../services/trainer/trainer.service'
import { makeId } from '../services/util.service'

const animation = () => {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(prefs.isEnglish ? 'show' : 'show-rtl')
          // entry.target.classList.remove('hidden')
        } else {
          entry.target.classList.remove(prefs.isEnglish ? 'show' : 'show-rtl')
        }
      })
    })

    const elements = document.querySelectorAll('.section')
    elements.forEach((el) => observer.observe(el))

    return () => elements.forEach((el) => observer.unobserve(el))
  }, [prefs.isEnglish])
}

const openLink = (link) => {
  console.log(link)
  window.open(link)
}
export function Activities() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const location = useLocation()

  const origin = {
    path: '/activities',
    he: 'פעילויות במועדון',
    eng: 'Activities',
  }

  const links = [
    {
      path: 'swimming',
      he: 'בית הספר לשחייה',
      eng: 'Swimming School',
      icon: '/imgs/swimming.svg', // Updated path
      darkIcon: '/imgs/swimming-dark.svg',
    },
    {
      path: 'tennis',
      he: 'האקדמיה לטניס',
      eng: 'Tennis Academy',
      icon: '/imgs/tennis.svg',
      darkIcon: '/imgs/tennis-dark.svg',
    },
    {
      path: 'pilates',
      he: 'פילאטיס מכשירים',
      eng: 'Reformer Pilates',
      icon: '/imgs/pilates.svg',
      darkIcon: '/imgs/pilates-dark.svg',
    },
    {
      path: 'care',
      he: 'מרכז הטיפולים',
      eng: 'Care',
      icon: '/imgs/care.svg',
      darkIcon: '/imgs/care-dark.svg',
    },
    {
      path: 'camp',
      he: 'קייטנת הקיץ',
      eng: 'Summer Camp',
      icon: '/imgs/camp.svg',
      darkIcon: '/imgs/camp-dark.svg',
    },
    {
      path: 'restaurant',
      he: 'שף הכפר',
      eng: 'Restaurant',
      icon: '/imgs/restaurant.svg',
      darkIcon: '/imgs/restaurant-dark.svg',
    },
  ]

  const head = {
    he: 'הפעילויות שלנו',
    eng: 'Our Activities',
  }

  return (
    <section className='activities-page-container'>
      <h2>{prefs.isEnglish ? 'Activities' : 'פעילויות במועדון'}</h2>
      <Nav origin={origin} links={links} isMain={true} />

      <section>
        {/* {location.pathname === '/activities' && <HeadContainer text={head} />} */}
        <Outlet />
      </section>
      <ContactUs />
    </section>
  )
}

export function Swimming() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const logo = {
    regular:
      'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732950392/%D7%9C%D7%95%D7%92%D7%95_%D7%A0%D7%98%D7%952_slppgi.png',
    darkMode:
      'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732950396/%D7%9C%D7%95%D7%92%D7%95_%D7%A0%D7%98%D7%952_white_spots_k2w5vv.png',
  }
  const headText = { he: 'בית הספר לשחייה', eng: 'Swimming School' }
  const instagram =
    'https://www.instagram.com/h2o.plus.swim/?igsh=aDhqb2d4M3hlejBh'

  const options = {
    img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002409/partush_051214_-_5_so0d8s.jpg',

    title: { he: 'H2o', eng: 'H2o' },
    preview: {
      he: `בית הספר לשחייה +h2o במועדון הספורט כפר שמריהו מתמחה בלימוד שחייה ושיפור סגנון בכל ארבעת סגנונות השחייה, לילדים ומבוגרים ובקבוצות שחייה מרמת - מתחילים ועד מאסטרס ומעלה.
      צוות המדריכים מונה מדריכים תחרותיים (בהווה או בעבר) אשר עוברים השתלמויות מקצועיות להעמקת הידע וליווי מקצועי לכל אורך השנה. בזכות זאת, אנו דואגים לכך שהמדריכים הטובים ביותר ימשיכו לשמור על כשירות ויהיו בעלי הידע העדכני ביותר בתחום.`,
      eng: `
      h2o+ swimming school that located in Kfar Shmariahu sport Specializing in learning to swim and improving style in all four swimming styles, for children and adults, in swimming groups from beginner level to masters and above. 
      The team of instructors includes competitive instructors (currently or in the past) who undergo professional training to deepen their knowledge and professional accompaniment throughout the year. Thanks to this, we make sure that the best instructors will continue to maintain competence and have the most up-to-date knowledge in the field.`,
    },
    ending: {
      he: `אנו מזמינים אתכם להצטרף אלינו!`,
      eng: `We invite you to join us!`,
    },
  }

  const ownerText = {
    he: `ערן גרומי, שחיין אולימפי, מנהל את בית הספר לשחייה ואת הצוות המקצועי כאשר התפיסה המנחה היא שילוב בין מקצועיות ללא פשרות וראיית המתאמן. שילוב זה מאפשר את מיצוי הפוטנציאל הגלום בכל אחד מתלמידי ומתאמני בית הספר לשחייה.`,
    eng: `Eran Groumi, Olympic swimmer, is the owner of the school and manage the professional stuff. The guiding concept is a combination of uncompromising professionalism and the vision of the trainee. This combination makes it possible to maximize the potential inherent in each of the swimming school's students and coaches.
    `,
  }

  const [trainers, setTrainers] = useState([])

  animation()

  useEffect(() => {
    const loadSwimmingTrainers = async () => {
      try {
        const filter = trainerService.getDefaultFilter()

        const t = await loadTrainers({ ...filter, types: ['swimming'] })
        setTrainers(t)
      } catch (err) {
        showErrorMsg(
          prefs.isEnglish
            ? `Couldn't load trainers`
            : 'לא היה ניתן לטעון מאמנים'
        )
      }
    }
    loadSwimmingTrainers()
  }, [])

  return (
    <div className='swimming-container'>
      <HeadContainer text={headText} />
      <DynamicCover prefs={prefs} coverSrc={options.img} />
      <div className='information-container'>
        <ActivityInfo options={options} logo={logo} />
      </div>
      <div className='owner-container section hidden'>
        <div className='img-container'>
          <img
            src='https://res.cloudinary.com/dnxi70mfs/image/upload/v1732809518/PHOTO-2024-11-28-17-04-04_2_s96eec.jpg'
            alt=''
          />
        </div>
        <p>{prefs.isEnglish ? ownerText.eng : ownerText.he}</p>
      </div>
      <div className='trainers-social-container'>
        <div
          className='whatsapp-container'
          onClick={() => openLink('https://wa.me/972525554183')}
        >
          <img src={whatsapp} alt='' />
          <Button
            variant='contained'
            className={prefs.isDarkMode ? 'dark-mode' : ''}
          >
            {prefs.isEnglish ? 'WhatsApp' : 'וואצאפ'} -{' '}
            <span style={{ fontFamily: 'assistantRegular' }}>
              {prefs.isEnglish ? 'Swimming School' : 'בית הספר לשחייה'}
            </span>
          </Button>
        </div>
        <div className='cards-container section hidden'>
          <Cards trainers={trainers} />
          <b>{prefs.isEnglish ? 'Swimming Trainers' : 'מדריכי השחייה'}</b>
        </div>
        <div className='instagram-container section hidden'>
          <InstagramPost postUrl={instagram} />
          <b>
            {prefs.isEnglish
              ? 'Follow us on Instagram'
              : 'עקבו אחרינו באינסטגרם'}
          </b>
        </div>
      </div>
    </div>
  )
}

export function Tennis() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const logo = {
    regular:
      'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733241159/WhatsApp_Image_2024-12-01_at_12.10.21_3_mrxbr1.jpg',
    darkMode:
      'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733241159/WhatsApp_Image_2024-12-01_at_12.10.21_3_mrxbr1.jpg',
  }
  const options = {
    img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733031708/WhatsApp_Image_2024-10-29_at_16.16.02_2_q0eenv.jpg',

    title: { he: 'האקדמיה לטניס', eng: 'Tennis Academy' },
    preview: {
      he: `באקדמיה לטניס, אנו מחויבים לספק את חוויית הטניס הטובה ביותר לכל רמות השחקנים.
      בין אם אתה שחקן מתחיל או מנוסה – אצלנו יש מקום לכולם!
      
      אנו מציעים מגוון תוכניות ופעילויות שיעזרו לך לשפר את כישורי המשחק, להכיר חברים חדשים, וליהנות מחוויית טניס ייחודית.
      בית הספר מתגאה בהתחייבותו למצוינות, במתקנים המובילים ובצוות מאמנים מנוסה ומקצועי.
  
  מאז הקמתנו בשנת 2011, לומדים אצלנו למעלה מ-150 תלמידים שנהנים משיעורי שביעות רצון גבוהים במיוחד.`,
      eng: `At The Tennis Academy, we are dedicated to providing the best tennis experience for players of all levels.
      Whether you're a beginner or an experienced player – there's a place for everyone here!
      
      We offer a wide range of programs and activities to help you improve your skills, make new friends, and enjoy the game like never before.
      Our school prides itself on a commitment to excellence, state-of-the-art facilities, and a team of highly experienced coaches.
      
      Founded in 2011, we now serve over 150 students with exceptionally high satisfaction rates.`,
    },
    ending: {
      he: `אנו מזמינים אתכם להצטרף אלינו!`,
      eng: `We invite you to join us!`,
    },
  }

  const headText = { he: 'האקדמיה לטניס', eng: 'Tennis Academy' }

  const instagram = 'https://www.instagram.com/anna_berlin_tennis_school/'

  const onwners = [
    {
      name: { he: 'אנה ברלין', eng: 'Anna Berlin' },
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732953318/WhatsApp_Image_2024-11-29_at_15.34.14_2_xbdepl.jpg',
      txt: {
        he: `מייסדת ומנהלת האקדמיה לטניס.
    מאז ילדותי אני חיה ונושמת טניס. עם עשרות שנות ניסיון על המגרש ובאימון מקצועי ותחרותי, הפכתי את התשוקה שלי לענף לשליחות. במהלך הקריירה שלי אימנתי מאות שחקנים ברמות שונות, תוך התמקדות במצוינות ובחתירה מתמדת לתוצאות הטובות ביותר.
    כמייסדת האקדמיה לטניס, אני גאה להוביל מוסד שמטפח שחקנים לא רק מבחינה מקצועית אלא גם מבחינה אישית. המטרה שלי היא להעניק לכל מתאמן את הכלים וההכוונה הנכונים כדי לממש את הפוטנציאל שלו ולהגשים את חלומותיו בטניס.`,
        eng: `Founder and Head of the Tennis Academy
    I’ve been living and breathing tennis since childhood. With decades of experience both on the court and in professional and competitive coaching, I’ve turned my passion for the sport into a lifelong mission. Throughout my career, I’ve coached hundreds of players at various levels, always striving for excellence and the best possible results.
    As the founder of the Tennis Academy, I take pride in leading an institution that develops players not only professionally but also personally. My goal is to provide each trainee with the right tools and guidance to unlock their potential and achieve their tennis dreams.`,
      },
    },
    {
      name: { he: 'יורי קובלנבקו', eng: 'Yuri Kovalenko' },
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733241757/9354C7DB-7D1A-405D-AC98-ADDA7047F2E8_1_201_a_uihpil.jpg',
      txt: {
        he: `מנהל האקדמיה לטניס.
   כבר יותר משני עשורים שאני חלק מעולם הטניס – תחילה כשחקן, וכיום כמאמן. במהלך הקריירה שלי עבדתי עם שחקנים בכל הרמות, כולל כאלה שהתחרו ברמות הגבוהות ביותר, אני מביא איתי ידע מעמיק וניסיון עשיר.
   אני מאמין בהדרכה שמבוססת על שילוב של טכניקה, אסטרטגיה והתאמה אישית לכל מתאמן. המטרה שלי היא לעזור לכל אחד מהמתאמנים שלי לשפר את המשחק, להתפתח מקצועית, וליהנות מהדרך.`,
        eng: `Manager of the Tennis Academy
    For over two decades, tennis has been a central part of my life – first as a player and now as a coach. During my career, I’ve worked with players at all levels, including those competing at the highest ranks, bringing a wealth of knowledge and experience to the table.
    I believe in coaching that combines technique, strategy, and a personalized approach for each player. My aim is to help every trainee improve their game, grow professionally, and enjoy the journey along the way.`,
      },
    },
  ]

  const [trainers, setTrainers] = useState([])

  animation()

  useEffect(() => {
    const loadTennisTrainers = async () => {
      try {
        const filter = trainerService.getDefaultFilter()

        const t = await loadTrainers({ ...filter, types: ['tennis'] })
        setTrainers(t)
      } catch (err) {
        showErrorMsg(
          prefs.isEnglish
            ? `Couldn't load trainers`
            : 'לא היה ניתן לטעון מאמנים'
        )
      }
    }
    loadTennisTrainers()
  }, [])
  return (
    <div className='tennis-container'>
      <HeadContainer text={headText} />
      <DynamicCover prefs={prefs} coverSrc={options.img} />
      <div className='information-container'>
        <ActivityInfo options={options} logo={logo} />
      </div>
      <div className='owners-container'>
        {onwners.map((owner) => {
          return (
            <div className='owner-container section' key={makeId()}>
              <div className='img-container'>
                <img
                  src={
                    owner.img ||
                    'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732809518/PHOTO-2024-11-28-17-04-04_2_s96eec.jpg'
                  }
                  alt=''
                />
                <b>{prefs.isEnglish ? owner.name.eng : owner.name.he}</b>
              </div>
              <p>{prefs.isEnglish ? owner.txt.eng : owner.txt.he}</p>
            </div>
          )
        })}
      </div>

      <div className='trainers-social-container'>
        <div
          className='whatsapp-container'
          onClick={() => openLink('https://wa.me/972528747690')}
        >
          <img src={whatsapp} alt='' />
          <Button
            variant='contained'
            className={prefs.isDarkMode ? 'dark-mode' : ''}
          >
            {prefs.isEnglish ? 'WhatsApp' : 'וואצאפ'} -{' '}
            <span style={{ fontFamily: 'assistantRegular' }}>
              {prefs.isEnglish ? 'Tennis Academy' : 'האקדמיה לטניס'}
            </span>
          </Button>
        </div>
        <div className='cards-container section hidden'>
          <Cards trainers={trainers} />
          <b>{prefs.isEnglish ? 'Tennis Trainers' : 'מדריכי הטניס'}</b>
        </div>
        <div className='instagram-container section hidden'>
          <InstagramPost postUrl={instagram} />
          <b>
            {prefs.isEnglish
              ? 'Follow us on Instagram'
              : 'עקבו אחרינו באינסטגרם'}
          </b>
        </div>
      </div>
    </div>
  )
}

export function Pilates() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const headText = { he: 'פילאטיס מכשירים', eng: 'Reformer Pilates' }

  const options = {
    img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732027475/WhatsApp_Image_2024-11-19_at_15.24.47_ihj8yf.jpg',

    title: { he: 'סטודיו מיטל תמיר', eng: 'Meital Tamir Studio' },
    preview: {
      he: `ברוכים הבאים לבית הספר לשחייה שלנו, בו כל תלמיד יכול ללמוד לשחות בביטחון! בין אם אתם מתחילים או מתאמנים לרמת שחייה מתקדמת, המדריכים המנוסים שלנו מציעים ליווי אישי בסביבה בטוחה ומעודדת. הצטרפו למגוון התכניות שלנו, כולל שיעורי מתחילים, שיפור סגנון ושחייה מתקדמת. השיעורים שלנו מתוכננים כדי לעזור לשחיינים מכל הגילאים להתקדם בקצב שלהם ולהנות מהמסע. הצטרפו אלינו ותחוו את השמחה שבשחייה!
      
      `,
      eng: `Welcome to our swimming school, where every student can learn to swim with confidence! Whether you're a beginner or training for advanced skills, our experienced instructors provide personalized guidance in a safe and encouraging environment. Dive into our range of programs, including beginner classes, stroke improvement, and advanced techniques. Our lessons are structured to help swimmers of all ages progress at their own pace, ensuring everyone enjoys the journey. Join us and experience the joy of swimming!`,
    },
    ending: {
      he: `אני מזמינה אתכם להצטרף אלינו!`,
      eng: `I invite you to join us!`,
    },
  }
  const instagram =
    'https://www.instagram.com/meitaltamir_studio?igsh=OGppbjJmZmlsNnB5&utm_source=qr'

  animation()

  return (
    <div className='pilates-container'>
      <HeadContainer text={headText} />
      <DynamicCover prefs={prefs} coverSrc={options.img} />
      <div className='information-container'>
        <ActivityInfo options={options} />
      </div>
      <div className='trainers-social-container'>
        <div className='section'>
          <div className='img-container hidden'>
            <img
              src='https://res.cloudinary.com/dnxi70mfs/image/upload/v1732027729/WhatsApp_Image_2024-11-19_at_15.24.46_2_vj7jvc.jpg'
              alt='Meital'
            />
          </div>
        </div>
        <div className='section'>
          <div className='text-container hidden'>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
              illo exercitationem placeat, deleniti incidunt cum nam excepturi
              similique ducimus iusto eveniet ratione est fuga minus sapiente
              repellendus laudantium quis ex?
            </p>
          </div>
        </div>
        <div className='instagram-container section hidden'>
          <b>
            {prefs.isEnglish ? 'Follow me on Instagram' : 'עקבו אחרי באינסטגרם'}
          </b>
          <InstagramPost postUrl={instagram} />
        </div>
      </div>
    </div>
  )
}

export function Care() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const logo = {
    regular:
      'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733240855/WhatsApp_Image_2024-12-02_at_22.36.12-removebg-preview_jeejkc.png',
    darkMode:
      'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733240855/WhatsApp_Image_2024-12-02_at_22.36.12-removebg-preview_2_giphuw.png',
  }

  const headText = { he: 'מרכז הטיפולים', eng: 'Care' }

  const options = {
    img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733031708/WhatsApp_Image_2024-10-29_at_16.16.02_2_q0eenv.jpg',

    title: { he: 'האקדמיה לטניס', eng: 'Tennis Academy' },
    preview: {
      he: `אוסטאופתיה היא שיטת טיפול ידני המתמקדת בזיהוי וטיפול בגורמים לכאב וחוסר איזון בגוף. השיטה מבוססת על עקרונות הריפוי העצמי והקשר בין מבנה הגוף לתפקודו. האוסטאופת מאבחן באמצעות מגע והסתכלות, ללא שימוש במכשירים או תרופות, ומשיב את האיזון והתנועתיות לגוף. הטיפול מתאים לכל הגילאים ומותאם אישית למטופל.`,
      eng: `Osteopathy is a manual therapy method focused on identifying and treating the causes of pain and imbalance in the body. It is based on the principles of self-healing and the connection between the body's structure and its function. The osteopath diagnoses through touch and observation, without using devices or medication, restoring balance and mobility to the body. The treatment is suitable for all ages and is tailored to the individual.`,
    },
    ending: {
      he: `אני מזמין אותכם לנסות בעצמכם!`,
      eng: `I invite you to try yourself!`,
    },
  }

  const ownerText = {
    he: `אני לאור בן שמעון, אוסטאופת מוסמך ומורה לאוסטאופתיה בווינגייט.
    כספורטאי לשעבר (נבחרת ישראל לנוער בכדוריד) שסבל מפציעות, בחרתי לפתח את הקריירה שלי בתור מרפא, וכך הגעתי לטיפול במגע. בתחילת דרכי עבדתי בקבוצות כדורגל וספא, ולאחר מכן בקליניקה עצמאית.
    עם השנים החלטתי להתמקצע ולהרחיב את הידע והניסיון שלי כדי שאוכל להועיל יותר למטופליי וכך הגעתי לאוסטאופתיה. אני חסיד גדול של שיטה זו ומאמין שהיא יכולה לשפר את איכות חיינו בצורה משמעותית, להחזיר תפקוד ותנועה חיוניים לנו, ולהפחית כאב.
    בראיית העולם שלי, בחלק מהמקרים, לפני שמחליטים על טיפולים פולשניים, כדאי להיעזר באוסטאופתיה (כמובן שבמקרים רפואיים מסוימים נדרש אישור רפואי לטיפול).
    כל מטופל/ת שמגיעים אליי אני חוקר את ההיסטוריה הגופנית שלו ע"י תשאול ובדיקות על מנת לאבחן את שורש הבעיה, ואז משתמש בלחיצות ומתיחות עדינות, הנעות ומניפולציות, שמטרתן לשחרר אזורים נוקשים וחסרי תנועה, להחזיר אותם לתפקוד תקין ולעורר תהליך של התאוששות.
    רוב המטופלים מציגים שיפור כבר בטיפול הראשון. יש גם מטופלים קבועים שמגיעים ל'תחזוקה' ומניעה.`,
    eng: `I am Laor Ben Shimon, a certified osteopath and osteopathy instructor at Wingate.

    As a former athlete (a member of Israel’s youth national handball team) who suffered from injuries, I chose to develop my career as a healer, which led me to focus on manual therapy. Early in my journey, I worked with soccer teams and at spas, and later transitioned to running my own private clinic.
    
    Over the years, I decided to specialize further and expand my knowledge and experience to better help my patients, which brought me to osteopathy. I am a strong advocate of this method and believe it can significantly improve our quality of life, restore essential movement and function, and reduce pain.
    
    In my worldview, in certain cases, before opting for invasive treatments, osteopathy can be a beneficial first step (of course, for specific medical conditions, prior medical approval is required).
    
    For every patient who comes to me, I thoroughly investigate their physical history through questioning and examinations to diagnose the root cause of the issue. Then, I use gentle pressure, stretches, mobilizations, and manipulations aimed at releasing stiff and immobile areas, restoring proper function, and triggering a recovery process.
    
    Most patients report improvement after the very first session. Some even visit regularly for "maintenance" and prevention.`,
  }
  animation()

  return (
    <div className='care-container'>
      <HeadContainer text={headText} />
      <DynamicCover prefs={prefs} coverSrc={options.img} />
      <div className='information-container'>
        <ActivityInfo options={options} logo={logo} />
      </div>
      <div className='owner-container section hidden'>
        <div className='img-container'>
          <img
            src='https://res.cloudinary.com/dnxi70mfs/image/upload/v1733240855/WhatsApp_Image_2024-12-02_at_22.36.12_1_ujtzsz.jpg'
            alt=''
          />
        </div>
        <p>{prefs.isEnglish ? ownerText.eng : ownerText.he}</p>
      </div>
    </div>
  )
}

export function SummerCamp() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const headText = { he: 'קייטנת הקיץ', eng: 'Summer Camp' }
  const logo = {
    regular:
      'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733241159/WhatsApp_Image_2024-12-01_at_12.10.21_3_mrxbr1.jpg',
    darkMode:
      'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733241159/WhatsApp_Image_2024-12-01_at_12.10.21_3_mrxbr1.jpg',
  }
  const options = {
    img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732541780/WhatsApp_Image_2024-10-29_at_16.16.03_1_ptejag.jpg',

    title: { he: 'קייטנת הספורט', eng: 'The Sports Camp' },
    preview: {
      he: `הקייטנה מציעה מגוון פעילויות ספורט כמו כדורגל, כדורסל, טניס וריצה, בהובלת צוות מדריכים מקצועי ומסור. הילדים ייהנו מסביבה בטוחה ומהנה, יפתחו כישורים חברתיים ועבודת צוות, וישתתפו בתחרויות עם פרסים על הישגיהם.

      התוכנית מותאמת לגילאים שונים ומשלבת הנאה, צמיחה אישית ובריאות. הקייטנה פועלת במהלך חופשות בית הספר ומאפשרת הרשמה גמישה לפי שבועות.`,
      eng: `Our camp offers a variety of sports activities such as soccer, basketball, tennis, and running, led by a professional and dedicated team of coaches. Children will enjoy a safe and fun environment, develop social skills and teamwork, and participate in competitions with prizes for their achievements.

      The program is tailored to different age groups, combining fun, personal growth, and health. The camp operates during school holidays with flexible weekly registration options.`,
    },
    ending: {
      he: `הצטרפו אלינו לחופשה פעילה וחווייתית שכולה כיף וזיכרונות מתוקים!`,
      eng: `Join us for an active, enjoyable holiday filled with great memories!`,
    },
  }

  const ownerText = {
    he: `אני לאור בן שמעון, אוסטאופת מוסמך ומורה לאוסטאופתיה בווינגייט.
    כספורטאי לשעבר (נבחרת ישראל לנוער בכדוריד) שסבל מפציעות, בחרתי לפתח את הקריירה שלי בתור מרפא, וכך הגעתי לטיפול במגע. בתחילת דרכי עבדתי בקבוצות כדורגל וספא, ולאחר מכן בקליניקה עצמאית.
    עם השנים החלטתי להתמקצע ולהרחיב את הידע והניסיון שלי כדי שאוכל להועיל יותר למטופליי וכך הגעתי לאוסטאופתיה. אני חסיד גדול של שיטה זו ומאמין שהיא יכולה לשפר את איכות חיינו בצורה משמעותית, להחזיר תפקוד ותנועה חיוניים לנו, ולהפחית כאב.
    בראיית העולם שלי, בחלק מהמקרים, לפני שמחליטים על טיפולים פולשניים, כדאי להיעזר באוסטאופתיה (כמובן שבמקרים רפואיים מסוימים נדרש אישור רפואי לטיפול).
    כל מטופל/ת שמגיעים אליי אני חוקר את ההיסטוריה הגופנית שלו ע"י תשאול ובדיקות על מנת לאבחן את שורש הבעיה, ואז משתמש בלחיצות ומתיחות עדינות, הנעות ומניפולציות, שמטרתן לשחרר אזורים נוקשים וחסרי תנועה, להחזיר אותם לתפקוד תקין ולעורר תהליך של התאוששות.
    רוב המטופלים מציגים שיפור כבר בטיפול הראשון. יש גם מטופלים קבועים שמגיעים ל'תחזוקה' ומניעה.`,
    eng: `I am Laor Ben Shimon, a certified osteopath and osteopathy instructor at Wingate.
  
    As a former athlete (a member of Israel’s youth national handball team) who suffered from injuries, I chose to develop my career as a healer, which led me to focus on manual therapy. Early in my journey, I worked with soccer teams and at spas, and later transitioned to running my own private clinic.
    
    Over the years, I decided to specialize further and expand my knowledge and experience to better help my patients, which brought me to osteopathy. I am a strong advocate of this method and believe it can significantly improve our quality of life, restore essential movement and function, and reduce pain.
    
    In my worldview, in certain cases, before opting for invasive treatments, osteopathy can be a beneficial first step (of course, for specific medical conditions, prior medical approval is required).
    
    For every patient who comes to me, I thoroughly investigate their physical history through questioning and examinations to diagnose the root cause of the issue. Then, I use gentle pressure, stretches, mobilizations, and manipulations aimed at releasing stiff and immobile areas, restoring proper function, and triggering a recovery process.
    
    Most patients report improvement after the very first session. Some even visit regularly for "maintenance" and prevention.`,
  }
  const imgs = [
    {
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733325433/WhatsApp_Image_2024-10-29_at_16.16.41_1_2_rvht4i.jpg',
    },
    {
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733325437/WhatsApp_Image_2024-10-29_at_16.16.55_eu1lj6.jpg',
    },
    {
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733325434/WhatsApp_Image_2024-10-29_at_16.16.11_1_jvclzy.jpg',
    },
    {
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733325607/WhatsApp_Image_2024-10-29_at_16.16.42_1_b2aeei.jpg',
    },
    {
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733325434/WhatsApp_Image_2024-10-29_at_16.16.42_2_nusldv.jpg',
    },
    {
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733325436/WhatsApp_Image_2024-10-29_at_16.16.41_xa539c.jpg',
    },
  ]
  const closerImg =
    'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733325607/WhatsApp_Image_2024-10-29_at_16.16.42_1_b2aeei.jpg'
  animation()
  return (
    <div className='camp-container'>
      <HeadContainer text={headText} />
      <DynamicCover prefs={prefs} coverSrc={options.img} />
      <div className='information-container'>
        <ActivityInfo options={options} logo={logo} />
      </div>

      <div className='section hidden'>
        <SwiperCarousel imgs={imgs} />
      </div>
    </div>
  )
}

export function Restaurant() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const headText = { he: 'שף הכפר', eng: 'Restaurant' }
  return (
    <div className='restaurant-container'>
      <HeadContainer text={headText} />
    </div>
  )
}
