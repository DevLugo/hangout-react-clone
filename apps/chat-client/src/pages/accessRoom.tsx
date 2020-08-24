//React Core
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
// import Colum from 'react-bootstrap/Column'
import { Link, useHistory } from "react-router-dom";
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

export const AccessRoom = () => {
    const history = useHistory();
    // const style = {
    //     color: 'white',
    //     textDecoration: 'none'
    // };

    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else history.push("/Room");

        setValidated(true);

    };

    return (
        <div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group as={Row} controlId="formUsername">
                    <Col sm="10">
                        <Form.Control required type="text" placeholder="ID Room" autoComplete="off" />
                        <Form.Control.Feedback type="invalid">
                            Favor de ingresar un ID.
                    </Form.Control.Feedback>
                    </Col>

                    <Col sm="2">
                        <Button variant="primary" type="submit">
                            Join
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </div>
    );
}