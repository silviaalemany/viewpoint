import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function SuggestionView({show, updateShow, curSuggestion}) {
    const handleClose = () => updateShow(false);
    const handleShow = () => updateShow(true);
    return (
        <div>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{curSuggestion ? curSuggestion.caption : ' '}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
        
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={handleClose}>
                Cancel
                </Button>
                <Button variant="outline-primary" onClick={handleClose}>
                Submit
                </Button>
            </Modal.Footer>
        </Modal>
        </div>
    )
}