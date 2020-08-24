import React from 'react';
// import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Route } from 'react-router-dom';

import { AccessRoom } from './../pages/accessRoom';
import { Room } from './../pages/room';


import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export const App = () => {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./app.styled-components file.
   */
  return (
    <BrowserRouter>
      <Container fluid>
        <React.Fragment>
          <Route path="/" exact component={AccessRoom} />
          <Route path="/:roomId" exact component={Room} />
        </React.Fragment>
      </Container>
    </BrowserRouter>
  );
};

export default App;
