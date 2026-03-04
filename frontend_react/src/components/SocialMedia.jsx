import React from 'react';
import { BsInstagram } from 'react-icons/bs';
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

const SocialMedia = () => {
  return (
    <div className="app__social">
      <div>
        <a
          href="https://www.linkedin.com/in/joel-plotnik-881344164/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn />
        </a>
      </div>
      <div>
        <a
          href="https://github.com/joelplotnik"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
      </div>
      <div>
        <a
          href="https://www.instagram.com/joelplotnik/?hl=en"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
        >
          <BsInstagram />
        </a>
      </div>
      <div>
        <a
          href="https://x.com/joelplotnik"
          target="_blank"
          rel="noreferrer"
          aria-label="X"
        >
          <FaXTwitter />
        </a>
      </div>
    </div>
  );
};

export default SocialMedia;
