import React, { useState } from 'react';
import { Form, Button, Container, Header, Message, Modal } from 'semantic-ui-react';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';

const StatusCreate = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      await axios.post(`${config.apiUrl}/api/status_defect_log`, { name });
      setMessage('Record updated successfully!');
      setModalOpen(true); // Open modal on success

    } catch (err) {
      setMessage('Error updating record');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    navigate('/status/list'); // Navigate back to Search page after closing modal
  };

  return (
    <Container>
      <Header as='h2'>Status Create</Header>
      <Form>
        <Form.Field>
          <label>Name</label>
          <input 
            placeholder='Name' 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </Form.Field>
        <Button type='button' onClick={handleCreate}>Create</Button>
        <Button type='button' onClick={()=> { navigate('/status/list')}}>Back</Button>
      </Form>
      {message && <Message>{message}</Message>}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Modal.Header>Create Successful</Modal.Header>
        <Modal.Content>
          <p>The record has been Created successfully.</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleModalClose}>OK</Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
};

export default StatusCreate;
