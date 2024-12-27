import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Header, Modal, Dropdown, Image, Grid, Icon, Segment, TextArea } from 'semantic-ui-react';
import axios from 'axios';
import config from '../config';
import { useParams, useNavigate } from 'react-router-dom';

const DefectDetail = () => {
  const { id } = useParams();
  const [status, setStatus] = useState('');
  const [typeId, setTypeId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [detail, setDetail] = useState('');
  const [remark, setRemark] = useState('');
  const [imakgeList, setImageList] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false); // State for confirmation modal
  const [deleteImageId, setDeleteImageId] = useState(null); // State for the image ID to be deleted
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [statusList, setStatusList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [createdAt, setCreatedAt] = useState([]);
  const [updatedAt, setUpdatedAt] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // State for selected file

  useEffect( () => {
    const callAPI =  async () => {
      await getStatusList();
      await getTypeList();
      await getLocationList();
      await fetchImages();
    }

    callAPI();
  }, []);


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchImages();
      try {
        const response = await axios.get(`${config.apiUrl}/api/defect_log/${id}`);
        setStatus(response.data.status);
        setTypeId(response.data.type_id);
        setLocationId(response.data.location_id);
        setDetail(response.data.detail);
        setRemark(response.data.remark);
        setCreatedAt(response.data.created_at);
        setUpdatedAt(response.data.updated_at);

      } catch (err) {
        setMessage('Error fetching data');
      }
    }; 
    fetchData();
  }, [id]);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/image_defect_log/${id}`);
      setImageList(response.data);
      setMessage(null)
    } catch (err) {
      setMessage('Error fetching data');
    }
  }

  const getStatusList = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/status_defect_log`, {});
      const reuslt = response.data.map(item => ({
        key: item.id,
        text: item.name,
        value: item.id,
      }));
      setStatusList(reuslt);
      setMessage(null);
    } catch (err) {
      setMessage('Error fetching data');
      setStatusList([]);
    }
  }

  const getLocationList = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/location`, {});
      const reuslt = response.data.map(item => ({
        key: item.id,
        text: item.name,
        value: item.id,
      }));
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
      const reuslt = response.data.map(item => ({
        key: item.id,
        text: item.name,
        value: item.id,
      }));
      setTypeList(reuslt);
      setMessage(null);
    } catch (err) {
      setMessage('Error fetching data');
      setTypeList([]);
    }
  }

  const handleUpdate = async () => {
    try {
      await axios.put(`${config.apiUrl}/api/defect_log/${id}`, {
        "type_id": typeId,
        "detail": detail,
        "remark": remark,
        "status": status
      });
      setMessage('Record updated successfully!');
      setModalOpen(true); // Open modal on success
    } catch (err) {
      setMessage('Error updating record');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    window.location.reload();
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('defect_log_id', id);
    formData.append('image', selectedFile);

    try {
      await axios.post(`${config.apiUrl}/api/image_defect_log`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await fetchImages(); // Refresh images
      setSelectedFile(null)
    } catch (err) {
      setMessage('Error uploading file');
    }
  };

  const handleDeleteImage = async () => {
    try {
      await axios.delete(`${config.apiUrl}/api/image_defect_log/${deleteImageId}`);
      setMessage('Image deleted successfully!');
      await fetchImages(); // Refresh images
      setConfirmOpen(false); // Close confirmation modal
    } catch (err) {
      setMessage('Error deleting image');
    }
  };

  const openConfirmModal = (id) => {
    setDeleteImageId(id);
    setConfirmOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmOpen(false);
    setDeleteImageId(null);
  };

  return (
    <Container>
      <Header as='h2'>Defect Detail</Header>
      <label>Create at</label> <p>{createdAt}</p>
      <label>Update at</label> <p>{updatedAt}</p>
      <Form>
        <Form.Field>
          <label>Status</label>
          <Dropdown
            placeholder='Select Status'
            fluid
            selection
            options={statusList}
            value={status}
            onChange={(e, { value }) => setStatus(value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Type</label>
          <Dropdown
            placeholder='Select Type'
            fluid
            selection
            options={typeList}
            value={typeId}
            onChange={(e, { value }) => setTypeId(value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Location</label>
          <Dropdown
            placeholder='Select Location'
            fluid
            selection
            options={locationList}
            value={locationId}
            onChange={(e, { value }) => setLocationId(value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Detail</label>
          <TextArea 
            placeholder='Detail' 
            value={detail} 
            onChange={(e) => setDetail(e.target.value)} 
          />
        </Form.Field>
        <Form.Field>
          <label>Remark</label>
          <TextArea 
            placeholder='remark' 
            value={remark} 
            onChange={(e) => setRemark(e.target.value)} 
          />
        </Form.Field>
        <Form.Field>
          <label>Upload Image</label>
          <input 
            type='file' 
            onChange={handleFileChange} 
          />
          <Button type='button' onClick={handleFileUpload} disabled={!selectedFile}>Upload</Button>
        </Form.Field>
        <Button type='button' onClick={handleUpdate}>Update</Button>
        <Button type='button' onClick={()=> { navigate('/')}}>Back</Button>
        <Button type='button' onClick={()=> { 
          navigate(`/defect/${Number(id)+1}`)
        }}>Next</Button>
      </Form>
      <br />
      <Grid>
        {imakgeList.map((image) => (
          <Grid.Column key={image.id} mobile={16} largeScreen={8} style={{ position: 'relative' }}>
            <Segment>
            <label>CreatedAt:{image.created_at}</label>
              <Icon 
                name='delete' 
                style={{ cursor: 'pointer', position: 'absolute', top: 0, right: 0, zIndex: 1 }} 
                onClick={() => openConfirmModal(image.id)}
              />
              <div className="image-container">
                <Image src={`data:image/jpeg;base64,${image.image_data}`} alt={`Image ${image.id}`} centered size='medium'/>
              </div>

            </Segment>
          </Grid.Column>
        ))}
      </Grid>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Modal.Header>Update Successful</Modal.Header>
        <Modal.Content>
          <p>{message}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleModalClose}>OK</Button>
        </Modal.Actions>
      </Modal>
      <Modal size='mini' open={confirmOpen} onClose={closeConfirmModal}>
        <Modal.Header>Delete Confirmation</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete this image?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={closeConfirmModal}>No</Button>
          <Button positive onClick={handleDeleteImage}>Yes</Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
};

export default DefectDetail;
