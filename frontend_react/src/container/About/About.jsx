import './About.scss';

import { useEffect, useState } from 'react';

import { client, urlFor } from '../../client';
import { AppWrap, MotionWrap } from '../../wrapper';

const About = () => {
  const [about, setAbout] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const query = '*[_type == "about"]';
    client
      .fetch(query)
      .then((data) => {
        setAbout(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch about data:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <div className="app__section-head">
        <p className="app__section-eyebrow">About</p>
        <h2 className="head-text">
          Combining <span>Artistry</span> with <span>Engineering</span>
        </h2>
      </div>

      {isLoading ? (
        <p className="app__state">Loading…</p>
      ) : (
        <div className="app__profiles">
          {about.map((profile, index) => (
            <article className="app__profile-item" key={profile.title + index}>
              <div className="app__profile-media">
                <img src={urlFor(profile.imgUrl)} alt={profile.title} />
              </div>
              <p className="mono-text">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="bold-text">{profile.title}</h3>
              <p className="p-text">{profile.description}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
};

export default AppWrap(MotionWrap(About, 'app__about'), 'about', 'app__band-b');
