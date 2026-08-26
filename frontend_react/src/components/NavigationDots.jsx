
import { sections } from '../constants';

const NavigationDots = ({ active }) => {
  return (
    <div className="app__navigation">
      {sections.map((item) => (
        <a
          href={`#${item}`}
          key={item}
          className="app__navigation-dot"
          aria-label={`Navigate to ${item}`}
          style={
            active === item ? { backgroundColor: 'var(--secondary-color)' } : {}
          }
        >
          <span className="sr-only">{item}</span>
        </a>
      ))}
    </div>
  );
};

export default NavigationDots;
