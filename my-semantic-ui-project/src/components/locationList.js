import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Header, Table, Message } from 'semantic-ui-react';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';

const LocationList = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/location`, {});
      setResults(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching data');
      setResults([]);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/location/${id}`);
  };

  return (
    <Container>
      <Header as='h2'>Location List</Header>
      <Form>
        <Button type='button' onClick={handleSearch}>Search</Button>
        <Button type='button' onClick={()=> {navigate(`/location/create`);}}>Create</Button>
      </Form>
      {error && <Message negative>{error}</Message>}
      {results.length > 0 && (
        <Table celled className="striped-rows">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {results.map((result, index) => (
              <Table.Row key={index} onClick={() => handleRowClick(result.id)}>
                <Table.Cell>{result.id}</Table.Cell>
                <Table.Cell>{result.name}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  );
};

export default LocationList;
