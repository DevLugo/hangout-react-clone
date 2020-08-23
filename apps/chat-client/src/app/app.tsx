import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { AccessRoom } from './../pages/accessRoom';
import { Room } from './../pages/room';
import { Video } from '../components/video';


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
        <Route path="/:roomId" render={(props) => <Video  {...props} /> }/>
      </React.Fragment>
    </BrowserRouter>
  );
};

export default App;
