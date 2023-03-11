import MaterialIcon, {colorPalette} from 'material-icons-react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';

export default function AddButton({getPinCoordinates}) {
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function coordinateToString() {

        return String(getPinCoordinates().pinLat) + ", " + String(getPinCoordinates().pinLng);
    }

    return (
    <div>
    <Button className="AddButton" variant="primary" onClick={handleShow}>
        <MaterialIcon icon="add" color="black"></MaterialIcon>
    </Button>
  
        <Modal show={show} onHide={handleClose} animation={false} centered>
          <Modal.Header closeButton>
            <Modal.Title>New Suggestion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3>Location: <h6>{coordinateToString()}</h6> </h3>
          <Form>
            <Form.Group className="mb-3">
            <Form.Label>Caption</Form.Label>
                <Form.Control placeholder="What's wrong?" />
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} />
                
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
    );
  }