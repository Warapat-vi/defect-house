import React, { useState } from 'react';
import { Container, Menu, Sidebar, Segment, Icon } from 'semantic-ui-react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DefectList from './components/DefectList';
import DefectDetail from './components/DefectDetail';
import DefectCreate from './components/DefectCreate';
import DefectExport from './components/DefectExport';
import TypeList from './components/TypeList';
import TypeDetail from './components/TypeDetail';
import TypeCreate from './components/TypeCreate';
import StatusList from './components/StatusList';
import StatusDetail from './components/StatusDetail';
import StatusCreate from './components/StatusCreate';
import LocationDetail from './components/locationDetail';
import LocationCreate from './components/locationCreate';
import LocationList from './components/locationList';

const App = () => {
  const [visible, setVisible] = useState(false);

  return (
    <Router>
      <Sidebar.Pushable as={Segment} style={{ minHeight: '100vh' }}>
        <Sidebar
          as={Menu}
          animation='overlay'
          icon='labeled'
          inverted
          vertical
          visible={visible}
          width='thin'
        >
          <Menu.Item as={Link} to="/" onClick={() => setVisible(false)}>
            <Icon name='dochub' />
            Defect List
          </Menu.Item>
          <Menu.Item as={Link} to="/type/list" onClick={() => setVisible(false)}>
            <Icon name='info' />
            Type List
          </Menu.Item>
          <Menu.Item as={Link} to="/status/list" onClick={() => setVisible(false)}>
            <Icon name='star' />
            Status List
          </Menu.Item>
          <Menu.Item as={Link} to="/location/list" onClick={() => setVisible(false)}>
            <Icon name='location arrow' />
            Location List
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher>
          <Segment basic>
            <Menu secondary>
              <Menu.Item onClick={() => setVisible(!visible)}>
                <Icon name='sidebar' />
              </Menu.Item>
            </Menu>
            <Container>
              <Routes>
                <Route path="/" element={<DefectList />} />
                <Route path="/defect/:id" element={<DefectDetail />} />
                <Route path="/defect/create" element={<DefectCreate />} />
                <Route path="/defect/export" element={<DefectExport />} />
                <Route path="/type/list" element={<TypeList />} />
                <Route path="/type/:id" element={<TypeDetail />} />
                <Route path="/type/create" element={<TypeCreate />} />
                <Route path="/status/list" element={<StatusList />} />
                <Route path="/status/:id" element={<StatusDetail />} />
                <Route path="/status/create" element={<StatusCreate />} />
                <Route path="/location/list" element={<LocationList />} />
                <Route path="/location/:id" element={<LocationDetail />} />
                <Route path="/location/create" element={<LocationCreate />} />
              </Routes>
            </Container>
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Router>
  );
};

export default App;
