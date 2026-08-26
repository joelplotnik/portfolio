import './Testimonials.scss';

import { motion } from 'framer-motion';
// External Imports
import { useEffect, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

import { client, urlFor } from '../../client';
// Internal Imports
import { AppWrap, MotionWrap } from '../../wrapper';

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [brands, setBrands] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClick = (index) => {
    setCurrentIndex(index);
  };

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

  const test = testimonials[currentIndex];

  return (
    <>
      {isLoading ? (
        <div className="app__flex" style={{ minHeight: 200 }}>
          <p className="p-text">Loading...</p>
        </div>
      ) : testimonials.length ? (
        <>
          <div className="app__testimonials-item app__flex">
            <img src={urlFor(test.imgurl)} alt="testimonials" />
            <div className="app__testimonials-content">
              <p className="p-text">{test.feedback}</p>
              <div>
                <h4 className="bold-text">{test.name}</h4>
                <h5 className="p-text">{test.company}</h5>
              </div>
            </div>
          </div>
          <div className="app__testimonials-btns app__flex">
            <button
              className="app__flex"
              aria-label="Previous testimonial"
              onClick={() =>
                handleClick(
                  currentIndex === 0
                    ? testimonials.length - 1
                    : currentIndex - 1,
                )
              }
            >
              <HiChevronLeft />
            </button>
            <button
              className="app__flex"
              aria-label="Next testimonial"
              onClick={() =>
                handleClick(
                  currentIndex === testimonials.length - 1
                    ? 0
                    : currentIndex + 1,
                )
              }
            >
              <HiChevronRight />
            </button>
          </div>
        </>
      ) : null}
      <div className="app__testimonials-brands app__flex">
        {brands.map((brand) => (
          <motion.div
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, type: 'tween' }}
            key={brand._id}
          >
            <img src={urlFor(brand.imgUrl)} alt={brand.name} />
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default AppWrap(
  MotionWrap(Testimonials, 'app__testimonials'),
  'testimonials',
  'app__primarybg',
);
