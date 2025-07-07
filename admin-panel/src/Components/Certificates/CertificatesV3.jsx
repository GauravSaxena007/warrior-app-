import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './CertificatesV3.css';

const CertificatesV3 = () => {
  const [issuedCerts, setIssuedCerts] = useState([]);
  const [manualCerts, setManualCerts] = useState([]);

  useEffect(() => {
    fetchIssuedCertificates();
    fetchManualCertificates();
  }, []);

const fetchIssuedCertificates = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin-certi/issuedCertificates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setIssuedCerts(res.data);
  } catch (error) {
    console.error('Failed to fetch issued certificates:', error);
    alert('Failed to fetch issued certificates.');
  }
};


  const fetchManualCertificates = async () => {
    try {
       const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/manualcerti`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setManualCerts(res.data);
    } catch (error) {
      console.error('Failed to fetch manual certificates:', error);
      alert('Failed to fetch manual certificates.');
    }
  };

  // Generic helper to build full URL for issued certs (used as is)
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    if (!filePath.includes('/')) {
      return `${import.meta.env.VITE_API_URL}/${filePath}`;
    }
    return `${import.meta.env.VITE_API_URL}/${filePath.replace(/\\/g, '/')}`;
  };

  // Specific helper for manual certificates - always prepends uploads/certificates/
  const getManualCertFileUrl = (fileNameOrPath) => {
    if (!fileNameOrPath) return null;

    if (!fileNameOrPath.includes('/')) {
      return `${import.meta.env.VITE_API_URL}/uploads/certificates/${fileNameOrPath}`;
    }

    if (fileNameOrPath.includes('uploads/certificates')) {
      return `${import.meta.env.VITE_API_URL}/${fileNameOrPath.replace(/\\/g, '/')}`;
    }

    return `${import.meta.env.VITE_API_URL}/uploads/certificates/${fileNameOrPath.replace(/\\/g, '/')}`;
  };

  // Generate CSV content combining both issued and manual certificates
  const generateCSV = () => {
    const headers = ['Student Name', 'Certificate Number', 'Course', 'Mobile', 'City', 'Source'];
    const rowsIssued = issuedCerts.map(cert => [
      cert.studentId?.name || 'N/A',
      cert.certificateNumber || 'N/A',
      cert.course || 'N/A',
      cert.studentId?.mobile || 'N/A',
      cert.studentId?.city || 'N/A',
      'Issued'
    ]);
    const rowsManual = manualCerts.map(cert => [
      cert.studentName || 'N/A',
      cert.certificateNumber || 'N/A',
      cert.courseName || cert.course || 'N/A',
      cert.mobile || 'N/A',
      cert.city || 'N/A',
      'Manual'
    ]);
    const allRows = [...rowsIssued, ...rowsManual];
    return [headers, ...allRows].map(row => row.join(',')).join('\n');
  };

  // Download ZIP of all certificates, marksheets, and CSV file
  const downloadZIP = async () => {
    const zip = new JSZip();

    // Add CSV to ZIP
    zip.file('certificates_list.csv', generateCSV());

    // Helper function to add a file to ZIP by URL
    const addFileToZip = async (url, filename) => {
      try {
        const response = await axios.get(url, { responseType: 'blob' });
        zip.file(filename, response.data);
      } catch (err) {
        console.error(`Error downloading file ${filename}:`, err);
      }
    };

    // Add issued certificates files
    for (const cert of issuedCerts) {
      if (cert.filePath) {
        const certUrl = getFileUrl(cert.filePath);
        const certFilename = `${cert.studentId?.name || 'N_A'}_Certificate_${cert.certificateNumber || 'N_A'}.pdf`;
        await addFileToZip(certUrl, certFilename);
      }
      if (cert.marksheetPath) {
        const marksheetUrl = getFileUrl(cert.marksheetPath);
        const marksheetFilename = `${cert.studentId?.name || 'N_A'}_Marksheet_${cert.certificateNumber || 'N_A'}.pdf`;
        await addFileToZip(marksheetUrl, marksheetFilename);
      }
    }

    // Add manual certificates files
    for (const cert of manualCerts) {
      if (cert.certificateFile) {
        const certUrl = getManualCertFileUrl(cert.certificateFile);
        const certFilename = `${cert.studentName || 'N_A'}_Manual_Certificate_${cert.certificateNumber || 'N_A'}.pdf`;
        await addFileToZip(certUrl, certFilename);
      }
      if (cert.marksheetFile) {
        const marksheetUrl = getManualCertFileUrl(cert.marksheetFile);
        const marksheetFilename = `${cert.studentName || 'N_A'}_Manual_Marksheet_${cert.certificateNumber || 'N_A'}.pdf`;
        await addFileToZip(marksheetUrl, marksheetFilename);
      }
    }

    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'all_certificates_with_csv.zip');
    } catch (error) {
      console.error('Error generating ZIP:', error);
      alert('Failed to generate the ZIP file.');
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Issued Certificates (Given To Franchisee)</h4>
      <div className="button-group-cer">
      <button onClick={downloadZIP} className="btn btn-success-cer mb-3">
        Download All Data (ZIP)
      </button>
      <button
  onClick={() => (window.location.href = '/dashboard/manualcertificate')}
  className="btn btn-blue-cer mb-3"
>
 Assign Certificate & Marksheet - Manually &#10149;
</button>
</div>
      {issuedCerts.length === 0 ? (
       null
      ) : (
        <table className="table table-bordered table-hover">
        </table>
      )}

      <h5 className="mt-5">--- Data of All Issued Certificates & Marksheets ---</h5>

      {manualCerts.length === 0 ? (
        <p>No Certificates / Marksheet Added Yet.</p>
      ) : (
        <table className="manualcerti-table table-bordered table-hover">
          <thead className="manualcerti-thead table-light">
            <tr>
              <th>Sr. No.</th>
              <th>Student Name</th>
              <th>Mobile</th>
              <th>Course</th>
              <th>Enrollment No.</th>
              <th>View Certificate</th>
              <th>View Marksheet</th>
            </tr>
          </thead>
          <tbody>
            {manualCerts.map((cert, i) => (
              <tr key={cert._id}>
                <td>{i + 1}</td>
                <td>{cert.studentName || 'N/A'}</td>
                <td>{cert.mobile || 'N/A'}</td>
                <td>{cert.courseName || cert.course || 'N/A'}</td>
                <td>{cert.certificateNumber || 'N/A'}</td>
                <td>
                  {cert.certificateFile ? (
                    <a
                      href={getManualCertFileUrl(cert.certificateFile)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </td>
                <td>
                  {cert.marksheetFile ? (
                    <a
                      href={getManualCertFileUrl(cert.marksheetFile)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-secondary btn-sm"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CertificatesV3;
