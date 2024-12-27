import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Header, Message, Modal } from 'semantic-ui-react';
import axios from 'axios';
import config from '../config';
import { useParams, useNavigate } from 'react-router-dom';

const StatusDetail = () => {
  const { id } = useParams();
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/status_defect_log/${id}`);
        setStatus(response.data.status);
        setName(response.data.name);
      } catch (err) {
        setMessage('Error fetching data');
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(`${config.apiUrl}/api/status_defect_log/${id}`, { status, name });
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
      <Header as='h2'>Status Detail</Header>
      <Form>
        <Form.Field>
          <label>Name</label>
          <input 
            placeholder='Name' 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </Form.Field>
        <Button type='button' onClick={handleUpdate}>Update</Button>
        <Button type='button' onClick={()=> { navigate('/status/list')}}>Back</Button>
      </Form>
      {message && <Message>{message}</Message>}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Modal.Header>Update Successful</Modal.Header>
        <Modal.Content>
          <p>The record has been updated successfully.</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleModalClose}>OK</Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
};

export default StatusDetail;
