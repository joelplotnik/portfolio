import './Header.scss';

import { motion, useReducedMotion } from 'framer-motion';

import { images } from '../../constants';
import { AppWrap } from '../../wrapper';

const stack = [
  { src: images.react, name: 'React' },
  { src: images.rails, name: 'Ruby on Rails' },
  { src: images.mysql, name: 'MySQL' },
];

export const Header = () => {
  const reduceMotion = useReducedMotion();
  const rise = (delay) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 0.61, 0.36, 1] },
  });

  return (
    <div className="app__header">
      <div className="app__header-info">
        <motion.p className="app__section-eyebrow" {...rise(0)}>
          Hello, I am
        </motion.p>

        <motion.h1 className="app__header-name" {...rise(0.06)}>
          Joel Plotnik
        </motion.h1>

        <motion.p className="app__header-role" {...rise(0.12)}>
          Software Engineer
        </motion.p>

        <motion.div className="app__header-actions" {...rise(0.18)}>
          <a className="btn btn--primary" href="#work">
            View work
          </a>
          <a className="btn btn--ghost" href="#contact">
            Get in touch
          </a>
        </motion.div>

        <motion.div className="app__header-stack" {...rise(0.24)}>
          <p className="mono-text">Working with</p>
          <ul>
            {stack.map(({ src, name }) => (
              <li key={name}>
                <img src={src} alt={name} />
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div
        className="app__header-img"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <img src={images.profile} alt="Joel Plotnik" />
      </motion.div>
    </div>
  );
};

export default AppWrap(Header, 'home');
