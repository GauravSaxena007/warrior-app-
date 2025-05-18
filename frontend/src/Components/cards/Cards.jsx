import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cards.css';

const Cards = () => {
  const [cards, setCards] = useState([]);

  // Fetch cards on mount
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/cards`);
        const data = await response.json();
        setCards(data);
      } catch (err) {
        console.error('Error fetching cards:', err);
      }
    };
    fetchCards();
  }, []);

  return (
    <section className="container my-4">
      <div className="row">
        {cards.map((card) => (
          <div className="col-md-4 mb-4" key={card._id}>
            <div className="card shadow-lg">
              <img
                src={card.image}
                className="card-img-top img-fluid"
                alt={card.title}
              />
              <div className="card-body">
                <h5 className="card-title">{card.title}</h5>
                <ul className="card-text">
                  {card.details.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <span>
                  <strong>Duration:</strong> {card.duration}
                </span>
                <span>
                  <strong>Code:</strong> {card.code}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Explore Cards Button */}
      <div className="text-center mt-4">
        <Link to="/courses" className="btn btn-primary px-4 py-2">
          Explore Courses
        </Link>
      </div>
    </section>
  );
};

export default Cards;
