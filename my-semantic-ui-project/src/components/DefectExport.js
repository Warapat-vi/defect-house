import React, { useState, useEffect } from 'react';
import { Container, Header, Table, Message, Image, Segment } from 'semantic-ui-react';
import axios from 'axios';
import config from '../config';
import _ from 'lodash';

const DefectExport = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect( () => {
    handleSearch();
  }, []);
  const handleSearch = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/export/json`, {});
      const data = response.data;
      const sizeList = data.map(i => _.size(i.images));
      setResults(data);
      setError(null);
    } catch (err) {
      setError('Error fetching data');
      setResults([]);
    }
  };
  const renderImageCells = (images) => {
    const cells = [];

    return _.map(images, (i, index) => {
      return <Segment>
        <Image src= {`data:image/jpeg;base64,${i}`} alt={`Image ${index}`} bordered centered size='small' />
      </Segment>
    });
  };
  return (
    <Container>
      <Header as='h2'>Default List</Header>
      {error && <Message negative>{error}</Message>}
      {results.length > 0 && (
        <Table celled className="striped-rows">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ลำดับ</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Detail</Table.HeaderCell>
              <Table.HeaderCell>Remark</Table.HeaderCell>
              <Table.HeaderCell>Create Date</Table.HeaderCell>
              <Table.HeaderCell>Images</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {results.map((result, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell width={1} verticalAlign='top'>{result.no}</Table.Cell>
                  <Table.Cell width={1} verticalAlign='top'>{result.status}</Table.Cell>
                  <Table.Cell width={1} verticalAlign='top'>{result.location}</Table.Cell>
                  <Table.Cell width={1} verticalAlign='top'>{result.type}</Table.Cell>
                  <Table.Cell width={3} verticalAlign='top'>[{result.id}] {result.detail}</Table.Cell>
                  <Table.Cell width={3} verticalAlign='top'>{result.remark}</Table.Cell>
                  <Table.Cell width={2} verticalAlign='top'>{result.created_at}</Table.Cell>
                  <Table.Cell width={4} verticalAlign='top'>
                    {renderImageCells(result.images)}
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

export default DefectExport;
