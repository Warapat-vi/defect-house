import React, { useState, useEffect } from 'react';
import { Button, Container, Header, Table, Message, Image, Form, Dropdown } from 'semantic-ui-react';
import axios from 'axios';
import _ from 'lodash';

const ExportPdf = () => {
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [statusList, setStatusList] = useState([]);
    const [status, setStatus] = useState('');
    const apiURL = 'http://localhost:3001';

    useEffect(() => {
        const callAPI = async () => {
            await getStatusList();
        }

        callAPI();
    }, []);

    const getStatusList = async () => {
        try {
            const response = await axios.get(`${apiURL}/api/status_defect_log`, {});
            const reuslt = response.data.map(item => ({
                key: item.id,
                text: item.name,
                value: item.id,
            }));
            setStatusList(reuslt);
            setError(null);
        } catch (err) {
            setError('Error fetching data');
            setStatusList([]);
        }
    }

    const getImage = async (id) => {
        try {
            const response = await axios.get(`${apiURL}/api/image_defect_log/${id}`);
            setError(null)
            return response.data;
        } catch (err) {
            setError('Error fetching data');
        }
    }

    const handleSearch = async () => {
        try {
            if (!_.isEmpty(status) || _.isNumber(status)) {
                const response = await axios.get(`${apiURL}/api/export/json?status_id=${status}`);
                const data = await Promise.all(response.data.map(async (i) => {
                    const { id } = i;
                    const imageList = await getImage(id);
                    return { ...i, images: imageList };
                }));

                setResults(data);
                setError(null);
            }
        } catch (err) {
            setError('Error fetching data');
            setResults([]);
        }
    };
    const renderImageCells = (images) => {
        return _.map(images, (i, index) => {
            return <div style={{ margin: '10px' }}>
                <p>เวลาถ่าย : {i.created_at}</p>
                <Image src={`data:image/jpeg;base64,${i.image_data}`} alt={`Image ${index}`} centered size='small' />
            </div>
        });
    };
    return (
        <Container >
            <Header as='h1'>Default List</Header>
            {error && <Message negative>{error}</Message>}

            {_.size(results) === 0 && <div>
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
                    <Button primary onClick={handleSearch}>Click Here</Button>
                </Form>
            </div>}
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

export default ExportPdf;