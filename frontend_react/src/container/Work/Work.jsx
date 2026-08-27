import './Work.scss';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { HiArrowUpRight } from 'react-icons/hi2';
import { FiGithub } from 'react-icons/fi';

import { client, urlFor } from '../../client';
import { AppWrap, MotionWrap } from '../../wrapper';

export const Work = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [work, setWork] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const query = '*[_type == "work"]';
    client
      .fetch(query)
      .then((data) => {
        setWork(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch work data:', err);
        setIsLoading(false);
      });
  }, []);

  // Derived from the tags actually present in the CMS rather than hardcoded,
  // so a filter can never be shown that matches nothing — and a new tag in
  // Sanity shows up without a code change.
  const filters = useMemo(() => {
    const tags = new Set();
    work.forEach((item) => item.tags?.forEach((tag) => tags.add(tag)));
    // 'All' is the reset sentinel prepended below. At least one document in
    // the CMS also carries it as a literal tag, so drop it here or it renders
    // twice and collides as a duplicate React key.
    tags.delete('All');
    return ['All', ...Array.from(tags).sort()];
  }, [work]);

  // Filtering is derived rather than stored. The previous version copied the
  // list into state behind a 500ms setTimeout, so a filter click did nothing
  // at all for half a second.
  // 'All' exists as a literal tag on at least one document (it is the reset
  // sentinel too). The old card showed only tags[0] so it stayed hidden;
  // now that every tag renders, it has to be dropped here as well.
  const visibleTags = (tags) => tags?.filter((tag) => tag !== 'All') ?? [];

  const filteredWork = useMemo(
    () =>
      activeFilter === 'All'
        ? work
        : work.filter((item) => item.tags?.includes(activeFilter)),
    [work, activeFilter],
  );

  return (
    <>
      <div className="app__section-head">
        <p className="app__section-eyebrow">Work</p>
        <h2 className="head-text">
          My <span>Portfolio</span>
        </h2>
      </div>

      <div className="app__work-filter" role="group" aria-label="Filter work">
        {filters.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setActiveFilter(item)}
            className={`app__work-filter-item ${
              activeFilter === item ? 'item-active' : ''
            }`}
            aria-pressed={activeFilter === item}
          >
            {item}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="app__state">Loading…</p>
      ) : (
        <motion.div
          key={activeFilter}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
          className="app__work-portfolio"
        >
          {filteredWork.map((item) => (
            <article className="app__work-item" key={item._id}>
              <div className="app__work-img">
                <img src={urlFor(item.imgUrl)} alt={item.title} />
              </div>

              <div className="app__work-content">
                <h3 className="bold-text">{item.title}</h3>
                <p className="p-text">{item.description}</p>

                {visibleTags(item.tags).length > 0 && (
                  <ul className="app__work-tags">
                    {visibleTags(item.tags).map((tag) => (
                      <li className="chip" key={tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Text links, not a hover-only icon overlay: the old one was
                    unreachable by keyboard and unlabelled on touch. */}
                <div className="app__work-links">
                  {item.projectLink && (
                    <a
                      href={item.projectLink}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Visit ${item.title}, opens in a new tab`}
                    >
                      Live site
                      <HiArrowUpRight aria-hidden="true" />
                    </a>
                  )}
                  {item.codeLink && (
                    <a
                      href={item.codeLink}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Source code for ${item.title}, opens in a new tab`}
                    >
                      Source
                      <FiGithub aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      )}
    </>
  );
};

export default AppWrap(MotionWrap(Work, 'app__work'), 'work', 'app__band-a');
