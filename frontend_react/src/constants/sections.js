// Section ids, in render order. Each one is registered as an anchor target by
// AppWrap (see src/wrapper/AppWrap.js) — note that Footer registers as
// 'contact', not 'footer'. Adding a section means adding it here and wrapping
// the component with the matching id.
const sections = ['home', 'about', 'work', 'skills', 'testimonials', 'contact'];

// The navbar omits testimonials; it stays reachable via the navigation dots.
export const navLinks = sections.filter((section) => section !== 'testimonials');

export default sections;
