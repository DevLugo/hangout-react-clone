//React Core
import React from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { Link } from "react-router-dom";


//Custom components
//import { Video } from '../components/video';
export const AccessRoom = () => {
    const style = {
        color: 'white',
        textDecoration: 'none'
    };

    // const [validated, setValidated] = useState(false);

    // const handleSubmit = (event) => {
    //     const form = event.currentTarget;
    //     if (form.checkValidity() === false) {
    //         event.preventDefault();
    //         event.stopPropagation();
    //     }

    //     setValidated(true);
    // };
    const handleSubmit = e => {
        console.log(e)
        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <div>
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername">
                    <Form.Label>Ingresa un alias</Form.Label>
                    <Form.Control required type="text" placeholder="Alias" />
                </Form.Group>


                <Button variant="primary" type="submit">
                    Room ID
                    {/* <Link style={style} to="/room">Acceder</Link> */}
                </Button>
            </Form>
        </div>
    );
}