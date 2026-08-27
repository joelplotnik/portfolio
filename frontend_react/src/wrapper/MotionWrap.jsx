import { motion, useReducedMotion } from 'framer-motion';

// One scroll-in treatment for every section: an 8px rise and a fade, once.
// It replaces the previous y: [100, 50, 0] keyframe, which re-fired every
// time a section scrolled back into view.
const MotionWrap = (Component, classNames) =>
  function HOC() {
    const reduceMotion = useReducedMotion();

    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
        className={classNames}
      >
        <Component />
      </motion.div>
    );
  };

export default MotionWrap;
