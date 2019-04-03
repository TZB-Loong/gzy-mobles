import React from 'react';
import PropTypes from 'prop-types';

import Header from './header.jsx';
import Footer from './footer.jsx';

import styles from './main.less';

function Main({
  children,
  location
}) {
  return (

    <div className={styles.normal}>
      {console.log(location)}
      {/*<Header  />*/}
      <Footer childrens={children} location={location} />
    </div>
  );
}

Main.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired
};

export default Main;
