import React from 'react';
// import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Route } from 'react-router-dom';

import { AccessRoom } from './../pages/accessRoom';
// import { Room } from './../pages/room';
import { Video } from '../components/video';


// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';

import '../app.scss';

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
        <Route path="/:roomId" render={(props) => <Video  {...props} />} />
      </React.Fragment>
    </BrowserRouter>
  );
};

export default App;
