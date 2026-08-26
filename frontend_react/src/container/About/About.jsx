import './About.scss';

import { motion } from 'framer-motion';
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
      <h2 className="head-text">
        Combining <span>Artistry</span> <br /> With <span>Engineering</span>
      </h2>

      {isLoading ? (
        <div className="app__flex" style={{ minHeight: 200 }}>
          <p className="p-text">Loading...</p>
        </div>
      ) : (
        <div className="app__profiles">
          {about.map((about, index) => (
            <motion.div
              whileInView={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5, type: 'tween' }}
              className="app__profile-item"
              key={about.title + index}
            >
              <img src={urlFor(about.imgUrl)} alt={about.title} />
              <h2 className="bold-text" style={{ marginTop: 20 }}>
                {about.title}
              </h2>
              <p className="p-text" style={{ marginTop: 10 }}>
                {about.description}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};

export default AppWrap(
  MotionWrap(About, 'app__about'),
  'about',
  'app__whitebg',
);
