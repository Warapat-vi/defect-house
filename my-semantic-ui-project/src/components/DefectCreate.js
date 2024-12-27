import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Header, Modal, Dropdown, TextArea, Message } from 'semantic-ui-react';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

const DefectCreate = () => {
  const [status, setStatus] = useState('');
  const [typeId, setTypeId] = useState(0);
  const [detail, setDetail] = useState('');
  const [remark, setRemark] = useState('');
  const [locationId, setLocationId] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [defectLogId, setDefectLogId] = useState(null);
  const navigate = useNavigate();
  const [typeList, setTypeList] = useState([]);
  const [locationList, setLocationList] = useState([]);

  const [detailError, setDetailError] = useState('');
  const [typeIdError, setTypeIdError] = useState('');
  const [locationIdError, setLocationIdError] = useState('');

  useEffect( () => {
    setStatus(1)
    getTypeList();
    getLocationList();
  }, []);

  const getLocationList = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/location`, {});
      let reuslt = [{
        key: '0',
        text: '',
        value: '',
      }]

      response.data.forEach(item => {
        reuslt.push({
          key: `location-list-${item.id}`,
          text: item.name,
          value: item.id,
        })
      })

      setLocationList(reuslt);
      setMessage(null);
    } catch (err) {
      setMessage('Error fetching data');
      setLocationList([]);
    }
  }

  const getTypeList = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/type_defect_log`, {});
      let reuslt = [{
        key: '0',
        text: '',
        value: '',
      }]

      response.data.forEach(item => {
        reuslt.push({
          key: `location-list-${item.id}`,
          text: item.name,
          value: item.id,
        })
      })
      setTypeList(reuslt);
      setMessage(null);
    } catch (err) {
      setMessage('Error fetching data');
      setTypeList([]);
    }
  }

  const handleCreate = async () => {
    try {
      const validateTypeId = typeId === 0;
      const validateLocationId = locationId === 0;
      const validateDetail =  _.isEmpty(detail);
      if(validateTypeId || validateLocationId ||validateDetail){
        if(validateTypeId) setTypeIdError("Error Type");
        if(validateLocationId) setLocationIdError("Error Location");
        if(validateDetail) setDetailError("Error Detail");
      } else {
        const result = await axios.post(`${config.apiUrl}/api/defect_log`, {
          "type_id": typeId,
          "detail": detail,
          "remark": remark,
          "status": status
        });
        setDefectLogId(result.data.defectLogId)
        setMessage('Record Created successfully!');
        setModalOpen(true); // Open modal on success
      }
    } catch (err) {
      setMessage('Error Created record');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    navigate(`/defect/${defectLogId}`);
  };

  return (
    <Container>
      <Header as='h2'>Defect Create</Header>
      <Form>
        <Form.Field error={!!typeIdError}>
          <label>Type</label>
          <Dropdown
            placeholder='Select Type'
            fluid
            selection
            options={typeList}
            value={typeId}
            onChange={(e, { value }) => setTypeId(value)}
          />
          {typeIdError && <Message negative>{typeIdError}</Message>}
        </Form.Field>
        <Form.Field error={!!locationIdError}>
          <label>Location</label>
          <Dropdown
            placeholder='Select Location'
            fluid
            selection
            options={locationList}
            value={locationId}
            onChange={(e, { value }) => setLocationId(value)}
          />
          {locationIdError && <Message negative>{locationIdError}</Message>}
        </Form.Field>
        
        <Form.Field error={!!detailError}>
          <label>Detail</label>
          <TextArea 
            placeholder='Detail' 
            value={detail} 
            onChange={(e) => setDetail(e.target.value)} 
          />
          {detailError && <Message negative>{detailError}</Message>}

        </Form.Field>
        <Form.Field>
          <label>Remark</label>
          <TextArea 
            placeholder='remark' 
            value={remark} 
            onChange={(e) => setRemark(e.target.value)} 
          />
        </Form.Field>
        <Button type='button' onClick={handleCreate}>Create</Button>
        <Button type='button' onClick={()=> { navigate('/')}}>Back</Button>
      </Form>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Modal.Header>Create Successful</Modal.Header>
        <Modal.Content>
          <p>{message}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleModalClose}>OK</Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
};

export default DefectCreate;
