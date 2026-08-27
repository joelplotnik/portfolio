import './Footer.scss';

import { useState } from 'react';

import { socialLinks } from '../../constants';
import { AppWrap, MotionWrap } from '../../wrapper';

export const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { name, email, message } = formData;

  const handleChangeInput = (e) => {
    const { name: field, value } = e.target;
    setError('');
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    // Posts to a Netlify Function rather than writing to Sanity directly —
    // the write token cannot live in the browser bundle. Running `npm start`
    // alone will 404 here; use `npx netlify dev` to exercise the form locally.
    fetch('/.netlify/functions/submit-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    })
      .then((response) =>
        response.json().then((body) => {
          if (!response.ok) {
            throw new Error(body.error || 'Something went wrong.');
          }
        }),
      )
      .then(() => {
        setLoading(false);
        setIsFormSubmitted(true);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message || 'Something went wrong. Please try again.');
      });
  };

  return (
    <>
      <div className="app__section-head">
        <p className="app__section-eyebrow">Contact</p>
        <h2 className="head-text">Chat with me</h2>
      </div>

      <div className="app__footer">
        {!isFormSubmitted ? (
          <form className="app__footer-form" onSubmit={handleSubmit} noValidate>
            <div className="app__footer-field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={handleChangeInput}
              />
            </div>

            <div className="app__footer-field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={handleChangeInput}
              />
            </div>

            <div className="app__footer-field">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={6}
                value={message}
                onChange={handleChangeInput}
              />
            </div>

            <p className="app__footer-error" role="alert">
              {error}
            </p>

            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
            >
              {loading ? 'Sending…' : 'Send message'}
            </button>
          </form>
        ) : (
          <div className="app__footer-success" role="status">
            <h3 className="bold-text">Thank you for getting in touch!</h3>
            <p className="p-text">I&apos;ll get back to you shortly.</p>
          </div>
        )}

        {/* The social rail is hidden below 900px, so these links live here
            too — it is the one section every visitor scrolls to. */}
        <aside className="app__footer-elsewhere">
          <p className="mono-text">Elsewhere</p>
          <ul>
            {socialLinks.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer">
                  <Icon aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
};

export default AppWrap(
  MotionWrap(Footer, 'app__footer-section'),
  'contact',
  'app__band-b',
);
