import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Components/Sidebar/Sidebar';
import Settings from './Components/Settings/Settings';
import Addcourses from './Components/Add-courses/Addcourses';
import Slider from './Components/Slider/Slider';
import Enquiries from './Components/Enquiries/Enquiries';
import Contactus from './Components/Contact-Us/Contactus';
import FranchiseeManagement from './Components/Fra-Managment/FranchiseeManagement';
import Issuecerti from './Components/Issued-Certificate/Issuecerti';
import Transac from './Components/Transaction/Transac';
import CertificatesV3 from './Components/Certificates/CertificatesV3';
import CourierDet from './Components/CourierDet/CourierDet';
import FraCer from './Components/FraCer/FraCer';
import Dashboard from './Components/Dashboard/Dashboard';
import Reeladmin from './Components/ReelAdmin/ReelAdmin';
import CardsAdmin from './Components/CardsAdmin/CardsAdmin';
import PrivateRouteadminpanel from './Components/PrivateRouteadminpanel';
import AgreementAdmin from './Components/AgreementAdmin/AgreementAdmin';
import Subjects from './Components/Subjects/Subjects';
import Generatemar from './Components/Generate/Generatemar';
import Generatecer from './Components/Generate/Generatecer';
import Format from './Components/Generate/Format';
import Reset from './Components/Reset/reset';
import Manualcerti from './Components/Manual-Certi/Manualcerti';
import Payments from './Components/Payments/Payments';

function App() {
  return (
    <Router basename="/dashboard">
      <div style={{ display: 'flex' }}>

        <div className="content" style={{ marginLeft: '350px', padding: '20px', width: '100%' }}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                    <div>
                      <Dashboard />
                    </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/subjects"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <Subjects />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <Settings />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/generatecertificate"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <Generatecer />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/generatemarksheet"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <Generatemar />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/format"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <Format />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/manualcertificate"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <Manualcerti />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/payments"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <Payments />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/reset"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <Reset />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/addcourses"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <Addcourses />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/slider"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <Slider />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/enquiry"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar/>
                  <div>
                  <Enquiries />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/contactuss"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <Contactus />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/management"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <FranchiseeManagement />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/issuecerti"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <Issuecerti />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/transac"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <Transac />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/certificatesv3"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <CertificatesV3 />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/courdetail"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <CourierDet />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/fracer"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <FraCer />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/reel"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <Reeladmin />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/agreementadmin"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <AgreementAdmin />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/cardsadmin"
              element={
                <PrivateRouteadminpanel>
                  <div>
                    <Sidebar />
                  <div>
                  <CardsAdmin />
                  </div>
                  </div>
                </PrivateRouteadminpanel>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;