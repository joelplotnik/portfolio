import './Navbar.scss';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HiOutlineMenu, HiX } from 'react-icons/hi';

import { navLinks, sections } from '../../constants';
import useActiveSection from '../../hooks/useActiveSection';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <>
      <header className="app__navbar">
        <a className="app__navbar-logo" href="#home">
          Joel Plotnik
          <span className="sr-only">— back to top</span>
        </a>

        <nav className="app__navbar-links" aria-label="Primary">
          <ul>
            {navLinks.map((item) => (
              <li key={`link-${item}`}>
                <a
                  href={`#${item}`}
                  aria-current={active === item ? 'page' : undefined}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="app__navbar-toggle"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          <HiOutlineMenu aria-hidden="true" />
        </button>
      </header>

      {/* The sheet lives outside <header> on purpose: the header's
          backdrop-filter makes it the containing block for fixed children,
          which clipped the panel to the height of the bar. */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="app__navbar-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="app__navbar-sheet"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <button
                type="button"
                className="app__navbar-toggle"
                aria-label="Close navigation menu"
                onClick={() => setIsOpen(false)}
              >
                <HiX aria-hidden="true" />
              </button>

              {/* Every section, unlike the desktop bar: the dot rail that used
                to be the only route to Testimonials is hidden at this width. */}
              <nav aria-label="Primary mobile">
                <ul>
                  {sections.map((item) => (
                    <li key={item}>
                      <a
                        href={`#${item}`}
                        aria-current={active === item ? 'page' : undefined}
                        onClick={() => setIsOpen(false)}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
