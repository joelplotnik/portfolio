import './Skills.scss';

import { useEffect, useState } from 'react';

import { client, urlFor } from '../../client';
import { AppWrap, MotionWrap } from '../../wrapper';

const Skills = () => {
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const query = '*[_type == "experiences"] | order(order asc)';
    const skillsQuery = '*[_type == "skills"]';

    Promise.all([client.fetch(query), client.fetch(skillsQuery)])
      .then(([expData, skillsData]) => {
        setExperiences(expData);
        setSkills(skillsData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch skills data:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <div className="app__section-head">
        <p className="app__section-eyebrow">Skills</p>
        <h2 className="head-text">Skills &amp; Experience</h2>
      </div>

      {isLoading ? (
        <p className="app__state">Loading…</p>
      ) : (
        <div className="app__skills-container">
          <div className="app__skills-list">
            {skills.map((skill) => (
              <div
                className="app__skills-item"
                key={skill.name}
                // The CMS bgColor is a light pastel authored for the old white
                // theme. Kept as-is in Sanity and mixed down into the dark
                // surface here rather than migrating the field.
                style={{ '--skill-tint': skill.bgColor }}
              >
                <div className="app__skills-icon">
                  <img src={urlFor(skill.icon)} alt={skill.name} />
                </div>
                <p>{skill.name}</p>
              </div>
            ))}
          </div>

          <ol className="app__skills-exp">
            {experiences.map((experience) => (
              <li className="app__skills-exp-item" key={experience.year}>
                <p className="app__skills-exp-year">{experience.year}</p>

                <div className="app__skills-exp-works">
                  {experience.works.map((work) => (
                    <div className="app__skills-exp-work" key={work.name}>
                      <h3 className="bold-text">{work.name}</h3>
                      <p className="app__skills-exp-company">{work.company}</p>
                      {/* Was a hover-only react-tooltip, which put this text
                          out of reach on touch devices and screen readers. */}
                      {work.desc && <p className="p-text">{work.desc}</p>}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
};

export default AppWrap(
  MotionWrap(Skills, 'app__skills'),
  'skills',
  'app__band-b',
);
