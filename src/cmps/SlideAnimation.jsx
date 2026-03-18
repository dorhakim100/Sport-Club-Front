import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'


export function SlideAnimation({
  children,
  motionKey,
  direction = 1,
  duration = 0.25,
  distance = 360,
  className,
  overflow = 'hidden',
  onClick,
}) {
  const isRtl = useSelector(
    (state) => !state.systemModule.prefs.isEnglish
  )
  const effectiveDirection = useMemo(
    () => (isRtl ? -direction : direction),
    [isRtl, direction]
  )

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? distance : -distance, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -distance : distance, opacity: 0 }),
  }

  return (
    <AnimatePresence initial={false} custom={effectiveDirection} mode="wait">
      <motion.div
        key={motionKey}
        custom={effectiveDirection}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: 'tween', duration }}
        className={className}
        style={{
          overflow,
          willChange: 'transform',
          position: 'relative',
          zIndex: 0,
        }}
        onClick={() => onClick?.()}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
