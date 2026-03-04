import React from 'react';

const NavigationDots = ({ active }) => {
  return (
    <div className="app__navigation">
      {['home', 'about', 'work', 'skills', 'testimonials', 'contact'].map(
        (item, index) => (
          <a
            href={`#${item}`}
            key={item + index}
            className="app__navigation-dot"
            aria-label={`Navigate to ${item}`}
            style={active === item ? { backgroundColor: '#4bbb7d' } : {}}
          >
            <span className="sr-only">{item}</span>
          </a>
        ),
      )}
    </div>
  );
};

export default NavigationDots;
