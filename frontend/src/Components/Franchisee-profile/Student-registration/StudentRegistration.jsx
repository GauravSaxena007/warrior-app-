import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentRegistration.css';

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    formNumber: '',
    email: '',
    mobile: '',
    address: '',
    photo: null,
    course: '',
    registrationDate: '',
    courseCompletionDate: '',
    courseAmount: '',
    franchiseeHead: '',
  });

  const [courses, setCourses] = useState([]);
  const [franchiseeHead, setFranchiseeHead] = useState('');

  // Fetch courses
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/courses`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error('Error fetching courses:', err));
  }, []);

  // Fetch franchisee profile to get centerHead
  useEffect(() => {
    const fetchFranchisee = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/franchisee/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFranchiseeHead(res.data.centerHead);
        setFormData((prevState) => ({
          ...prevState,
          franchiseeHead: res.data.centerHead,
        }));
      } catch (err) {
        console.error('Failed to load franchisee profile:', err);
      }
    };

    fetchFranchisee();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleReset = () => {
    setFormData({
      name: '',
      formNumber: '',
      email: '',
      mobile: '',
      address: '',
      photo: null,
      course: '',
      registrationDate: '',
      courseCompletionDate: '',
      courseAmount: '',
      franchiseeHead,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/students`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Student saved:', response.data);
      handleReset();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  return (
    <div>
      <h4
        className="profile-header pro-h mx-auto text-left"
        style={{ width: '80%', marginTop: '5px' }}
      >
        Student Registration
      </h4>
      <div className="registration-container">
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div className="form-row">
            {/* Left Column */}
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Name to Print on Certificate:
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  Address:
                </label>
                <textarea
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="course" className="form-label">
                  Select Course:
                </label>
                <select
                  name="course"
                  id="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course.title}>
                      {course.code} {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {formData.course && (
                <>
                  {/* Semester display */}
                  <div className="form-group">
                    <label className="form-label">Total Semesters:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={courses.find((c) => c.title === formData.course)?.semester || ''}
                      readOnly
                      disabled
                    />
                  </div>

                  {/* Subjects display from semesters */}
                  <div className="form-group">
                    {courses.find((c) => c.title === formData.course)?.semesters?.length > 0 ? (
                      courses
                        .find((c) => c.title === formData.course)
                        ?.semesters.map((sem, i) => (
                          <div key={i} style={{ marginBottom: '16px' }}>
                            <strong style={{ color: 'green' }}>Semester : {sem.semester}</strong>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                              <thead>
                                <tr>
                                  <th style={{ border: '1px solid #ccc', padding: '6px' }}>Subject</th>
                                  <th style={{ border: '1px solid #ccc', padding: '6px' }}>Max Marks</th>
                                  <th style={{ border: '1px solid #ccc', padding: '6px' }}>Passing Marks</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sem.subjects.map((subj, idx) => (
                                  <tr key={idx}>
                                    <td style={{ border: '1px solid #ccc', padding: '6px' }}>{subj.subject}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '6px' }}>{subj.maxMarks}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '6px' }}>{subj.passingMarks}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))
                    ) : (
                      <p>No subjects available</p>
                    )}
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="registrationDate" className="form-label">
                  Student Registration Date:
                </label>
                <input
                  type="date"
                  name="registrationDate"
                  id="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="courseCompletionDate" className="form-label">
                  Course Completion Date:
                </label>
                <input
                  type="date"
                  name="courseCompletionDate"
                  id="courseCompletionDate"
                  value={formData.courseCompletionDate}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="formNumber" className="form-label">
                  Form No:
                </label>
                <input
                  type="text"
                  name="formNumber"
                  id="formNumber"
                  value={formData.formNumber}
                  onChange={handleChange}
                  className="form-input"
                  required
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobile" className="form-label">
                  Mobile Number:
                </label>
                <input
                  type="tel"
                  name="mobile"
                  id="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="photo" className="form-label">
                  Upload Photo:
                </label>
                <input
                  type="file"
                  name="photo"
                  id="photo"
                  onChange={handleChange}
                  className="form-input"
                  accept="image/*"
                />
              </div>

              <div className="form-group">
                <label htmlFor="courseAmount" className="form-label">
                  Course Amount (₹):
                </label>
                <input
                  type="number"
                  name="courseAmount"
                  id="courseAmount"
                  value={formData.courseAmount}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="franchiseeHead" className="form-label">
                  Franchisee Head:
                </label>
                <input
                  type="text"
                  name="franchiseeHead"
                  id="franchiseeHead"
                  value={formData.franchiseeHead}
                  className="form-input"
                  required
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-button">
              Submit
            </button>
            <button type="reset" className="reset-button">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRegistration;