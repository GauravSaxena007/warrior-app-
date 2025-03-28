import React from "react";
import { courses } from "./data";

const Cards = () => {
  return (
    <section className="container my-4">
      <div className="row">
        {courses.map((course) => (
          <div className="col-md-4 mb-4" key={course.id}>
            <div className="card h-100 shadow-lg">
              {/* Image rendering */}
              <img 
                src={course.image} 
                className="card-img-top img-fluid" 
                alt={course.title} 
              />
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <ul className="card-text">
                  {course.details.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <span><strong>Course Duration:</strong> {course.duration}</span>
                <span><strong>Code:</strong> {course.code}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Cards;
