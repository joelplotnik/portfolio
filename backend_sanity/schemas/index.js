// Replaces the v2 schemas/schema.js, which had to import createSchema and the
// plugin-provided types through `part:@sanity/base/...` specifiers. Modern
// Sanity takes a plain array and resolves built-in types itself.

import about from './about';
import brands from './brands';
import contact from './contact';
import experiences from './experiences';
import skills from './skills';
import testimonials from './testimonials';
import work from './work';
import workExperience from './workExperience';

export const schemaTypes = [
  about,
  brands,
  contact,
  experiences,
  skills,
  testimonials,
  work,
  workExperience,
];
