import { sections } from '../constants';

const NavigationDots = ({ active }) => {
  return (
    <nav className="app__navigation" aria-label="Section navigation">
      {sections.map((item) => (
        <a
          href={`#${item}`}
          key={item}
          className="app__navigation-dot"
          aria-label={`Navigate to ${item}`}
          aria-current={active === item ? 'true' : undefined}
        >
          <span className="sr-only">{item}</span>
        </a>
      ))}
    </nav>
  );
};

export default NavigationDots;
