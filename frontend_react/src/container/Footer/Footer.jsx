import './Footer.scss';

import { useState } from 'react';

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
    const { name, value } = e.target;
    setError('');
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
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
      <h2 className="head-text">Chat with me</h2>
      {!isFormSubmitted ? (
        <div className="app__footer-form app__flex">
          <div className="app__flex">
            <input
              className="p-text"
              type="text"
              placeholder="Your Name"
              name="name"
              value={name}
              onChange={handleChangeInput}
            ></input>
          </div>
          <div className="app__flex">
            <input
              className="p-text"
              type="email"
              placeholder="Your Email"
              name="email"
              value={email}
              onChange={handleChangeInput}
            ></input>
          </div>
          <div>
            <textarea
              className="p-text"
              placeholder="Your Message"
              value={message}
              name="message"
              onChange={handleChangeInput}
            />
          </div>
          {error && (
            <p
              className="p-text"
              style={{ color: '#e74c3c', marginTop: '0.5rem' }}
            >
              {error}
            </p>
          )}
          <button type="button" className="p-text" onClick={handleSubmit}>
            {loading ? 'Sending' : 'Send Message'}
          </button>
        </div>
      ) : (
        <div>
          <h3 className="head-text">Thank you for getting in touch!</h3>
        </div>
      )}
    </>
  );
};

export default AppWrap(
  MotionWrap(Footer, 'app__footer'),
  'contact',
  'app__whitebg',
);
