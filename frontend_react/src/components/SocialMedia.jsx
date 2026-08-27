import { socialLinks } from '../constants';

const SocialMedia = () => {
  return (
    <div className="app__social">
      {socialLinks.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
        >
          <Icon aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </a>
      ))}
    </div>
  );
};

export default SocialMedia;
