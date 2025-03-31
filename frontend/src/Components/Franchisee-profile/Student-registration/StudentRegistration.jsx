import React, { useState } from 'react';
import "./StudentRegistration.css"; // Updated CSS filename

const StudentRegistration = () => {
    const [formData, setFormData] = useState({
        name: '',
        formNumber: '',
        email: '',
        mobile: '',
        address: '',
        photo: null,
        course: '',
        numOfStudents: '',
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'file' ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
        // Handle form submission logic here, like sending data to a server
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
            numOfStudents: '',
        });
    };

    return (
        <div className="registration-container">
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <div className="form-row">
                    {/* Left Column */}
                    <div className="form-column">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Name to Print on Certificate:</label>
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
                            <label htmlFor="email" className="form-label">Email:</label>
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
                            <label htmlFor="address" className="form-label">Address:</label>
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
                            <label htmlFor="course" className="form-label">Select Course:</label>
                            <select
                                name="course"
                                id="course"
                                value={formData.course}
                                onChange={handleChange}
                                className="form-input"
                                required
                            >
                                <option value="">Select a course</option>
                                <option value="course1">Course 1</option>
                                <option value="course2">Course 2</option>
                                <option value="course3">Course 3</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="numOfStudents" className="form-label">Number of Students:</label>
                            <input
                                type="number"
                                name="numOfStudents"
                                id="numOfStudents"
                                value={formData.numOfStudents}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="form-column">
                        <div className="form-group">
                            <label htmlFor="formNumber" className="form-label">Form No:</label>
                            <input
                                type="text"
                                name="formNumber"
                                id="formNumber"
                                value={formData.formNumber}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="mobile" className="form-label">Mobile Number:</label>
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
                            <label htmlFor="photo" className="form-label">Upload Photo:</label>
                            <input
                                type="file"
                                name="photo"
                                id="photo"
                                onChange={handleChange}
                                className="form-input"
                                accept="image/*"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-buttons">
                    <button type="submit" className="submit-button">Submit</button>
                    <button type="reset" className="reset-button">Reset</button>
                </div>
            </form>
        </div>
    );
};

export default StudentRegistration;
