import React from 'react';

import './Spinner.css';

const spinner = () => (
  <React.Fragment>
    <div className="skfoldingcube">
      <div className="skcube1 skcube" />
      <div className="skcube2 skcube" />
      <div className="skcube4 skcube" />
      <div className="skcube3 skcube" />
    </div>
  </React.Fragment>
);

export default spinner;
