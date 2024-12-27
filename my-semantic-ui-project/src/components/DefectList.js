import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Header, Table, Message, Dropdown } from 'semantic-ui-react';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';


const DefectList = () => {
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState([]);
  const [type, setType] = useState([]);
  const [location, setLocation] = useState([]);
  const [statusId, setStatusId] = useState('');
  const [typeId, setTypeId] = useState('');
  const [locationId, setLocationId] = useState('');

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect( () => {
    getStatus();
    getType();
    getLocations();
    handleSearch();
  }, []);

  const getStatus = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/status_defect_log`, {});
      const reuslt = response.data.map(item => ({
        key: item.id,
        text: item.name,
        value: item.id,
      }));
      setStatus(reuslt);
      setError(null);
    } catch (err) {
      setError('Error fetching data');
      setResults([]);
    }
  }

  const getType = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/type_defect_log`, {});
      const reuslt = response.data.map(item => ({
        key: item.id,
        text: item.name,
        value: item.id,
      }));
      setType(reuslt);
      setError(null);
    } catch (err) {
      setError('Error fetching data');
      setResults([]);
    }
  }

  const getLocations = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/location`, {});
      const reuslt = response.data.map(item => ({
        key: item.id,
        text: item.name,
        value: item.id,
      }));
      setLocation(reuslt);
      setError(null);
    } catch (err) {
      setError('Error fetching data');
      setResults([]);
    }
  }

  const objectToParams = (obj) => {
    return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
  }

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/defect_log?${objectToParams({
        status_id: statusId,
        location_id: locationId,
        type_id: typeId
      })}`);
      setResults(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching data');
      setResults([]);
    }
  };

  // const handleRowClick = (id, event) => {
  //   event.preventDefault();
  //   navigate(`/defect/${id}`);
  // };

  const detailButton = (id) => {
    const baseUrl = window.location.origin;;
    const newUrl = `/defect/${id}`;
  
    return (
      <Button as='a' href={newUrl} target='_blank'>
        Detail
      </Button>
    );
  };

  return (
    <Container>
      <Header as='h2'>Defect List</Header>
      <Form>
      <Form.Field>
          <label>Status</label>
          <Dropdown
            placeholder='Select Status'
            fluid
            selection
            options={status}
            value={statusId}
            onChange={(e, { value }) => setStatusId(value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Type</label>
          <Dropdown
            placeholder='Select Type'
            fluid
            selection
            options={type}
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
            options={location}
            value={locationId}
            onChange={(e, { value }) => setLocationId(value)}
          />
        </Form.Field>
        <Button type='button' onClick={handleSearch}>Search</Button>
        <Button type='button' onClick={()=> {navigate(`/defect/create`);}}>Create</Button>
      </Form>
      {error && <Message negative>{error}</Message>}
      {results.length > 0 && (
        <Table celled className="striped-rows">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.HeaderCell>Detail</Table.HeaderCell>
              <Table.HeaderCell>Remark</Table.HeaderCell>
              <Table.HeaderCell>Create Date</Table.HeaderCell>
              <Table.HeaderCell>Update Date</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {results.map((result, index) => {
              const statsObj = status.find(i => i.key === result.status);
              const typeObj = type.find(i => i.key === result.type_id);
              const locationObj = location.find(i => i.key === result.location_id);
              return (
                <Table.Row key={index}>
                  <Table.Cell>{result.id}</Table.Cell>
                  <Table.Cell>{_.get(typeObj,'text')}</Table.Cell>
                  <Table.Cell>{_.get(statsObj,'text')}</Table.Cell>
                  <Table.Cell>{_.get(locationObj,'text')}</Table.Cell>
                  <Table.Cell>{result.detail}</Table.Cell>
                  <Table.Cell>{result.remark}</Table.Cell>
                  <Table.Cell>{result.created_at}</Table.Cell>
                  <Table.Cell>{result.updated_at}</Table.Cell>
                  <Table.Cell>
                    {detailButton(result.id)}
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      )}
    </Container>
  );
};

export default DefectList;
