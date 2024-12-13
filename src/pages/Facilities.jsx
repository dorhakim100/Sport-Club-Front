import { useSelector } from 'react-redux'
import { useEffect } from 'react'

import { AccordionCmp } from '../cmps/AccordionCmp.jsx'
import { FacilitiesTxt } from '../cmps/FacilitiesTxt.jsx'
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
        he: `בריכה חצי אולימפית, מופעלת בסטנדרטים קפדניים ולצדה פועל בית ספר לשחייה
        לכל הגילאים.
        המים שבבריכה נלקחים מבארות טבעיים הנמצאים בשטח הכפר, מה שמבטיח את
        האיכות המרבית. כמו כן, הבריכה פועלת בפיקוח הדוק של משרד הבריאות.
        במקום יש הצללה מקיפה נגד קרינת השמש. טמפרטורת המים נשארת קבועה לאורך
        כל ימות השנה, כולל בחורף, הודות למערכת חימום מתקדמת.
        בית הספר לשחייה מנוהל ע"י ערו גרמומי, שחיין נבחרת ישראל אשר ייצג את המדינה
        במשחקים האולימפיים. 5 קבוצות השחייה נותנות מענה לטווח גילאים רחב, החל
        מילדים בני 6 וכלה בבני +15 המהווים חלק מנבחרת המועדון. לקראת חודשי הקיץ
        נפתחות קבוצות מיני ייחודיות המכילות עד 4 שחקנים בני 5-7 במטרה ללמד אותם
        את יסודות השחייה בצורה פרטנית. בנוסף, קיימת אפשרות ללמוד שחייה ושיפור סגנון
        באופן אישי וממוקד, עם אחד ממדריכי הצוות.
        מספר קבוצות למבוגרים פועלות בשעות הבוקר והערב תוך התמקדות בשיפור סיבולת
        לב-ריאה, עבודה פרטנית על סגנון ונפח השחייה.`,
        eng: `Our semi-Olympic swimming pool is operated with high standards, filled from the village natural water wells, ensuring maximum quality. The pool is fully shaded and the water temperature remains constant throughout the entire year.
        Swimming School - Eran Groumi, an Olympic swimmer and member of Israel Swimming Association, manages the Swimming School. Swimming classes are available for all ages.
        `,
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732805561/DSC06200_2_hrm9be.jpg',
      title: { he: 'חדר הכושר', eng: 'Gym' },
      description: {
        he: `חדר כושר חדיש ומאובזר עם ליווי מקצועי לכל מנוי, לרבות אפשרות לקבלת
        אימונים אישיים.
        הודות למכשור חדש ומתקדם, כל אימון בחדר הכושר הופך לחוויה מרתקת, מהנה ויעילה.
        כחלק משירותי המועדון ניתן לקבל סיוע, ייעוץ ותכנית אימון אישית בחינם. לאלה המעוניינים
        לאתגר את עצמם עוד יותר, קיימת אפשרות להצטרף לקבוצת ה-TRX, או להשתמש
        בשירותי האימון האישי בתשלום נוסף.`,
        eng: `In our gym you'll find high end advanced equipment .Our team of professional trainers offer professional guidance for every member and make the whole work out experience exciting, fun, effective and personal.`,
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732805466/DSC06068_qor0tr.jpg',
      title: { he: 'מגרשי הטניס', eng: 'Tennis Courts' },
      description: {
        he: `מגרשי טניס ליחידים ולקבוצות, אימון מקצועי לכל הגילאים.
        לרשות המנויים עומדים 3 מגרשי טניס מתקדמים המאפשרים
        משחק ואימון מהנים.
        במקום פועל בית ספר לטניס בניהולם של אנה ברלין, מס' 1
        בענף נשים +25 ויורי קובלנקו. בית הספר לטניס מקיים פעילות מגוונת במהלך כל השנה, לכל
        הגלאים ובכל הרמות: טניס לגיל הרך עבור בני 5-6, טניס לילדים
        ונוער בני 7-18, טניס למבוגרים בני +18.
        כמו כן, ניתן לתאם אימונים פרטיים. מחנות אימונים שפועלים
        בחופשות, מאפשרות לספורטאים הצעירים למקסם הישגים,
        לשפר את סגנון המשחק וליהנות מחוויית ספורט ותחרות בלתי
        נשכחת.
        בנוסף, מגרשי הטניס יכולים לשמש לחגיגות ימי הולדת
        ואירועים אחרים, על מנת ללכד את האורחים ולהוסיף ממד של
        כוח, עצמה ותחרותיות לחגיגה.`,
        eng: `In the club, we have three high-end tennis courts for free play available for club members during the whole day and week.
        Tennis school – Yuri Kovalenco and Anna Berlin, leading tennis instructors in Israel, manage the Tennis School offering lessons for all ages.
        `,
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732541780/WhatsApp_Image_2024-10-29_at_16.16.03_1_ptejag.jpg',
      title: {
        he: 'סטודיו חוגים',
        eng: 'Studio Classes',
      },
      description: {
        he: `מגוון רחב של חוגי סטודיו, חוג TRX, קבוצות טריאתלון וספורט תחרותי.
        במועדון פועלים מגוון חוגים כגון: התעמלות במים, יוגה, התעמלות בריאותית, עיצוב וחיטוב
        הגוף, יוגהלאטיס, פלדנקרייז, זומבה, עיצוב הוליסטי, התעמלות גברים ו-TRX. כל השיעורים
        מתקיימים בקבוצות קטנות עד 15 איש בהדרכה של מדריכים מקצועיים, בסגנון אישי ומותאם
        לכל מתאמתן.
        אולם החוגים מציע נוחות ובטיחות מרבית בסטנדרטים גבוהים. זאת הודות לרצפה בולמת
        זעזועים, אשר מגינה על הברכיים והגב, בהתאם להמלצות הרופאים. תוכלו להתאמן בלא
        הפרעה, תוך שמירה על כללי הבטיחות הנדרשים.`,
        eng: `We provide a wide variety of classes in small groups (up to 15 people) including TRX, Zumba, Aquatic Fitness, Yoga, Pilates, Body Shaping, Health Fitness, Feldenkrais and Holistic Shaping. All classes are instructed by professional trainers with a personal touch.`,
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733573642/DJI_0481_e3lubw_xyhqzl.jpg',
      title: {
        he: 'מתחם מיני גולף',
        eng: 'Mini Golf Area',
      },
      description: {
        he: `אנו מזמינים אתכם ליהנות ממתחם מיני גולף מהנה וייחודי הכולל 8 מסלולים מעוצבים המתאימים לכל הגילאים. המתחם ממוקם בלב מועדון הספורט שלנו ומשלב חוויית ספורט, פנאי וכיף לכל המשפחה.

        כל מסלול תוכנן בקפידה עם מכשולים יצירתיים ואתגריים כדי לספק חוויה מרתקת ומהנה.`,
        eng: `We invite you to enjoy a fun and unique mini golf course featuring 8 creative tracks, designed for all ages. Nestled in the heart of our sports club, the course offers a blend of sports, leisure, and entertainment for the entire family.

        Each track is carefully crafted with imaginative and challenging obstacles, ensuring an exciting and engaging experience.`,
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732541780/WhatsApp_Image_2024-10-29_at_16.16.03_1_ptejag.jpg',
      title: {
        he: 'מגרש סנוקרגל',
        eng: 'Snookball Court',
      },
      description: {
        he: `גלו את החוויה החדשה והמלהיבה במועדון הספורט שלנו – מגרש סנוקר-כדורגל! שילוב מושלם בין דיוק, אסטרטגיה וכיף לכל הגילאים.

        המגרש תוכנן במיוחד כדי לדמות שולחן סנוקר ענק, בו משחקים כדורגל במקום כדורי סנוקר. המטרה: לכוון, לבעוט ולהכניס את הכדורים הענקיים לכיסים, בדיוק כמו במשחק סנוקר קלאסי.
        
        זוהי חוויה חדשנית, מאתגרת ומהנה שתשדרג כל ביקור במועדון.
        
        `,
        eng: `Discover the exciting new experience at our sports club – a Snooker Football Court! A perfect combination of precision, strategy, and fun for all ages.

        The court is specially designed to resemble a giant snooker table, where football replaces traditional snooker balls. The goal: aim, kick, and pocket the oversized balls just like in classic snooker.
        
        This innovative and challenging activity is a perfect way to elevate your visit to the club.`,
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732277455/DSC06146_wcjbdk.jpg',
      title: {
        he: 'מסעדה כפרית',
        eng: 'Charming Restaurant',
      },
      description: {
        he: `מסעדה בעלת תפריט מגוון ושירות אדיב.
        במקום הכי גבוה בכפר שמריהו, עם נוף לים תוכלו להשביע את הרעב לפני או אחרי
        הביקור במועדון. אוכל בריא ומזין, שירות מקצועי ותפריט מגוון יתרמו לשביעות
        הרצון הכללית שלכם. כמו כן, במסעדה ניתן לערוך אירועים פרטיים באווירה
        מפנקת.`,
        eng: `In the heart of the club you'll find our restaurant, open all year long and serves healthy and tasty food for the whole family.`,
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733325433/WhatsApp_Image_2024-10-29_at_16.16.41_1_2_rvht4i.jpg',
      title: {
        he: `חוויות לילדים`,
        eng: 'Kids Activities',
      },
      description: {
        he: `מגרש משחקים, מגרשי קט רגל וקט סל ופעילות פנאי.
        מועדון הספורט מיועד למבוגרים ולילדים כאחד. אנחנו יודעים לשים דגש
        על טיפוח הכישרונות הצעירים ועל הכנתם לתחום הספורט.
        גן משחקים שפועל במקום יעלה חיוכים רחבים על פני ילדכם, מגרש מיני
        סל ומיני רגל מקורה ישמש להם מקום מצוין לשחק בו, לרכוש חברים
        חדשים ולחזק את הגוף. הצגות לכל המשפחה שנערכים במקום, מושכים
        את תושמת הלב של הקטנים והגדולים. בקיץ פועלים מתקנים מתנפחים
        המאפשרים להתגלש, לטפס ובעיקר לעשות שמח כפי שרק הילדים
        יודעים.`,
        eng: `For the kids we have a fun playground with swings and slides adjacent to a mini Tennis / Football / Basketball court.
        During the summer, the kids can enjoy many fun attractions such as: kiddies pool, inflatables, juggling classes, magician classes and more.
        `,
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733578663/32_peuixp_1_zgafh8.jpg',
      title: {
        he: 'בריכת פעוטות',
        eng: 'Toddler Pool',
      },
      description: {
        he: `מגרש משחקים ובריכה מקורה לפעוטות.
        הדרך לספורט מתחילה בגיל הרך. מגרש משחקים ייחודי לפעוטות נותן
        מענה מקיף בתחום הזה, הודות לציוד בטיחותי וחדיש. בבריכה המקורה
        יוכלו הזאטוטים לשחק במים הזכים, ללמוד את יסודות השחייה ולעשות
        צעד קטן לקראת אורח חיים בריא ועשיר בחוויות ספורט.`,
        eng: `The path to sports begins at an early age. A unique playground for toddlers provides comprehensive support in this area, thanks to modern and safe equipment. In the covered pool, the little ones can play in the crystal-clear water, learn the basics of swimming, and take a small step toward a healthy lifestyle rich in sports experiences.`,
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732276975/DSC06143_vbnema.jpg',
      title: {
        he: 'מגרש חניה',
        eng: 'Free Parking',
      },
      description: {
        he: `מקומות חניה רבים ונוחים, חינם לשימוש המנויים.
        לא תצטרכו לחפש מטר רבוע פנוי בין עשרות מכוניות שנדחסות זו לצד זו, מחזה די
        נפוץ במרכז הארץ. בשטח המועדון יש מקומות חנייה בשפע אשר יוסיפו לאווירה
        הכללית של סטנדרטים גבוהים ואיכות שירות מרבית המאפיינת את המקום.`,
        eng: `Plenty of parking spaces are serving the club visitors, donating to the high standards and quality of services the club has to offer.`,
      },
    },
  ]

  return (
    <section className='facilities-container'>
      <h2> {prefs.isEnglish ? 'Facilities' : 'מתקני המועדון'}</h2>
      <div className='imgs-container'></div>
      {/* <AccordionCmp facilities={facilities} /> */}
      <FacilitiesTxt facilities={facilities} />
      <ContactUs />
    </section>
  )
}
