import './Testimonials.scss';

import { useEffect, useState } from 'react';

import { client, urlFor } from '../../client';
import { AppWrap, MotionWrap } from '../../wrapper';

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const query = '*[_type == "testimonials"]';
    const brandsQuery = '*[_type == "brands"]';

    Promise.all([client.fetch(query), client.fetch(brandsQuery)])
      .then(([testimonialsData, brandsData]) => {
        setTestimonials(testimonialsData);
        setBrands(brandsData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch testimonials data:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <div className="app__section-head">
        <p className="app__section-eyebrow">Testimonials</p>
        <h2 className="head-text">Kind words</h2>
      </div>

      {isLoading ? (
        <p className="app__state">Loading…</p>
      ) : (
        <>
          {/* A grid rather than a carousel: with two testimonials, prev/next
              controls hid half the content behind a click for no reason. It
              reflows on its own if more are added in the CMS. */}
          <div className="app__testimonials-list">
            {testimonials.map((test) => (
              <figure className="app__testimonials-item" key={test._id}>
                <blockquote className="p-text">{test.feedback}</blockquote>

                <figcaption>
                  {/* `imgurl` is the pre-migration spelling. Once
                      scripts/rename-testimonial-imgurl.js has been applied to
                      every environment, this fallback can be dropped. */}
                  <img
                    src={urlFor(test.imgUrl ?? test.imgurl)}
                    alt={`${test.name}, ${test.company}`}
                  />
                  <div>
                    <p className="app__testimonials-name">{test.name}</p>
                    <p className="app__testimonials-company">{test.company}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          {brands.length > 0 && (
            <div className="app__testimonials-brands">
              <p className="mono-text">Worked with</p>
              <ul>
                {brands.map((brand) => (
                  <li key={brand._id}>
                    <img src={urlFor(brand.imgUrl)} alt={brand.name} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AppWrap(
  MotionWrap(Testimonials, 'app__testimonials'),
  'testimonials',
  'app__band-a',
);
