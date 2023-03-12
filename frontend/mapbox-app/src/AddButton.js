import MaterialIcon, {colorPalette} from 'material-icons-react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import UploadButton from './uploadButton';

export default function AddButton({getPinCoordinates, setFormData, getAddress}) {
    const [show, setShow] = useState(false)

    var caption;
    var description;
    var imageFile;

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function onSubmit() {
        setFormData(imageFile, description, caption);
        handleClose();
    }

    function updateDescription(event) {
        description = event.target.value;
    }

    function updateCaption(event) {
        caption = event.target.value;
    }

    function coordinateToString() {

        return String(getPinCoordinates().pinLat) + ", " + String(getPinCoordinates().pinLng);
    }

    function updateImageSource(newSource) {
        imageFile = newSource;
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
            <h3>Location: <h6>{getAddress()}</h6> </h3>
          <Form>
            <Form.Group className="mb-3">
            <Form.Label>Caption</Form.Label>
                <Form.Control name="caption" onChange={updateCaption} />
                <Form.Label>Description</Form.Label>
                <Form.Control name="description" as="textarea" rows={3} placeholder="Describe the Problem" onChange={updateDescription}/>
                
            </Form.Group>
            <UploadButton setImageSource={updateImageSource}/>
        </Form>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="outline-primary" onClick={onSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
    );
  }