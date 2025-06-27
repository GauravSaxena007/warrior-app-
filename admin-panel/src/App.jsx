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
                  <Sidebar />
                  <Dashboard />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/subjects"
              element={
                <PrivateRouteadminpanel>
                  <Subjects/>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRouteadminpanel>
                  <Settings />
                </PrivateRouteadminpanel>
              }
            />
             <Route
              path="/generatecertificate"
              element={
                <PrivateRouteadminpanel>
                 <Generatecer/>
                </PrivateRouteadminpanel>
              }
            />
             <Route
              path="/generatemarksheet"
              element={
                <PrivateRouteadminpanel>
                  <Generatemar/>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/format"
              element={
                <PrivateRouteadminpanel>
                  <Format/>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/manualcertificate"
              element={
                <PrivateRouteadminpanel>
                 <Manualcerti/>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/payments"
              element={
                <PrivateRouteadminpanel>
                 <Payments/>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/reset"
              element={
                <PrivateRouteadminpanel>
                  <Reset/>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/addcourses"
              element={
                <PrivateRouteadminpanel>
                  <Addcourses />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/slider"
              element={
                <PrivateRouteadminpanel>
                  <Slider />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/enquiry"
              element={
                <PrivateRouteadminpanel>
                  <Enquiries />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/contactuss"
              element={
                <PrivateRouteadminpanel>
                  <Contactus />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/management"
              element={
                <PrivateRouteadminpanel>
                  <FranchiseeManagement />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/issuecerti"
              element={
                <PrivateRouteadminpanel>
                  <Issuecerti />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/transac"
              element={
                <PrivateRouteadminpanel>
                  <Transac />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/certificatesv3"
              element={
                <PrivateRouteadminpanel>
                  <CertificatesV3 />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/courdetail"
              element={
                <PrivateRouteadminpanel>
                  <CourierDet />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/fracer"
              element={
                <PrivateRouteadminpanel>
                  <FraCer />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/reel"
              element={
                <PrivateRouteadminpanel>
                  <Reeladmin />
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/agreementadmin"
              element={
                <PrivateRouteadminpanel>
                  <AgreementAdmin/>
                </PrivateRouteadminpanel>
              }
            />
            <Route
              path="/cardsadmin"
              element={
                <PrivateRouteadminpanel>
                  <CardsAdmin />
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