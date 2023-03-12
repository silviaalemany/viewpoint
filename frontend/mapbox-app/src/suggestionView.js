import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const backend_url = 'http://localhost:8002'

export default function SuggestionView({show, updateShow, curSuggestion, updateSuggestions}) {
    const handleClose = () => updateShow(false);
    const handleShow = () => updateShow(true);

    async function upvotePost() {
        if(curSuggestion)
        {
            const response = await axios.post(backend_url + "/upvote?", null, {params: {
                id: curSuggestion.id
            }});
            console.log(response);
            updateSuggestions();
        }
    }

    async function downvotePost() {
        if(curSuggestion)
        {
            const response = await axios.post(backend_url + "/downvote?", null, {params: {
                id: curSuggestion.id
            }});
            console.log(response);
            updateSuggestions();
        }
    }


    return (
        <div>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{curSuggestion ? curSuggestion.caption : ' '}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6>{curSuggestion ? curSuggestion.desc : ' '} </h6>
            </Modal.Body>
            <Modal.Footer>
                <h6 >{curSuggestion ? curSuggestion.upvotes - curSuggestion.downvotes : ' '} </h6>
                <ButtonGroup>
                    <Button variant="outline-danger" onClick={downvotePost}>
                    Downvote
                    </Button>
                    <Button variant="outline-success" onClick={upvotePost}>
                    Upvote
                    </Button>
                </ButtonGroup>
            </Modal.Footer>
        </Modal>
        </div>
    )
}