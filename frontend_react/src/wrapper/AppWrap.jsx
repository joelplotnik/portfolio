import { NavigationDots, SocialMedia } from '../components';

const AppWrap = (Component, idName, classNames = 'app__band-a') =>
  function HOC() {
    return (
      <section id={idName} className={`app__container ${classNames}`}>
        <SocialMedia />

        <div className="app__wrapper">
          <Component />

          {/* One copyright for the page, in the last section. It used to
              render inside all six and be hidden with CSS in the hero. */}
          {idName === 'contact' && (
            <div className="copyright">
              <p>© 2026 Joel Plotnik</p>
              <p>All rights reserved</p>
            </div>
          )}
        </div>

        <NavigationDots active={idName} />
      </section>
    );
  };

export default AppWrap;
