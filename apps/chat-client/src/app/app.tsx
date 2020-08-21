import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { AccessRoom } from './../pages/accessRoom';
import { Room } from './../pages/room';


export const App = () => {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./app.styled-components file.
   */
  return (
    <BrowserRouter>
      <React.Fragment>
        <Route path="/" exact component={AccessRoom} />
        <Route path="/:roomId" exact component={Room} />
      </React.Fragment>
    </BrowserRouter>
  );
};

export default App;
