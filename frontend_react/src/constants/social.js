import { BsInstagram } from 'react-icons/bs';
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

// Shared by the desktop social rail (components/SocialMedia.jsx) and the
// contact section, which is where these links live on small screens now
// that the rail is hidden below 900px.
const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/joel-plotnik/',
    Icon: FaLinkedinIn,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/joelplotnik',
    Icon: FaGithub,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/joelplotnik/?hl=en',
    Icon: BsInstagram,
  },
  {
    label: 'X',
    href: 'https://x.com/joelplotnik',
    Icon: FaXTwitter,
  },
];

export default socialLinks;
