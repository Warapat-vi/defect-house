import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Button, Container, Header, Segment, Message, Image, Form, Dropdown, Grid, GridRow, GridColumn, Label } from 'semantic-ui-react';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';

const ExportImage = () => {
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
            return <GridColumn >
                <p>เวลาถ่าย : {i.created_at}</p>
                <Image src={`data:image/jpeg;base64,${i.image_data}`} alt={`Image ${index}`} centered size='small' />
            </GridColumn>
        });
    };

    const handleDownloadMultipleImages = async () => {
        const today = moment().format('DDMMYYY');
        for (const i of results) { 
            const element = document.getElementById(`item-${i.id}`);
            if (element) {
                const canvas = await html2canvas(element);
                const image = canvas.toDataURL('image/png');
                
                const link = document.createElement('a');
                link.href = image;
                link.download = `image_${today}_${i.id}.png`;
                link.click();
            }
        }
      };
    return (
        <Container >
            <Header as='h1'>Default List</Header>
            {error && <Message negative>{error}</Message>}

            <div>
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
                    <Button primary onClick={handleDownloadMultipleImages}>Download Multiple Images</Button>
                </Form>
            </div>
            {results.length > 0 && (
                <Container>
                {_.map(results, (i) => {
                    return (
                    <Segment key={i.id} id={`item-${i.id}`} style={{minHeight: '98vh'}}>
                        <Grid >
                            <GridRow columns={5}>
                                <GridColumn>
                                    <Label basic>No.</Label> {i.no}
                                </GridColumn>
                                <GridColumn>
                                    <Label basic>Status</Label> {i.status}
                                </GridColumn>
                                <GridColumn>
                                    <Label basic>Location</Label> {i.location}
                                </GridColumn>
                                <GridColumn>
                                    <Label basic>Type</Label> {i.type}
                                </GridColumn>
                                <GridColumn>
                                    <Label basic>Create Date</Label> {i.created_at}
                                </GridColumn>
                            </GridRow>
                            <GridRow>
                                <GridColumn>
                                    <Label basic>Detail</Label> [{i.id}] {i.detail}
                                </GridColumn>
                            </GridRow>
                            <GridRow>
                                <GridColumn>
                                    <Label basic>Remark</Label> {i.remark}
                                </GridColumn>
                            </GridRow>
                            <GridRow columns={3}>
                                {renderImageCells(i.images)}
                            </GridRow>
                        </Grid>
                    </Segment>
                    )
                })}
                {/* <Button primary onClick={handleDownloadMultipleImages}>Download Multiple Images</Button> */}
              </Container>
            )}
        </Container>
    );

};

export default ExportImage;