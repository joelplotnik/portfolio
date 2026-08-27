import { useEffect, useState } from 'react';

import { sections } from '../constants';

// Tracks which section is crossing the middle of the viewport, so the fixed
// navbar can mark the current link. The dot rail doesn't need this: AppWrap
// renders one rail per section and passes its own id as `active`.
const useActiveSection = () => {
  const [active, setActive] = useState(sections[0]);

  useEffect(() => {
    const elements = sections
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries.find((entry) => entry.isIntersecting);
        if (inView) setActive(inView.target.id);
      },
      // Collapses the observation area to a band across the viewport middle,
      // so exactly one section is intersecting at a time.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return active;
};

export default useActiveSection;
