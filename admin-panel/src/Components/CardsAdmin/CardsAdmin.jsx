import React, { useState, useEffect } from 'react';
import './CardsAdmin.css';

const CardsAdmin = () => {
  const [cards, setCards] = useState([]);
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    details: '',
    duration: '',
    code: '',
  });
  const [editId, setEditId] = useState(null);

  // Fetch cards on mount
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cards');
      if (!response.ok) throw new Error(`Failed to fetch cards: ${response.status}`);
      const data = await response.json();
      setCards(data);
    } catch (err) {
      console.error('Error fetching cards:', err);
      alert('Failed to load cards. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result });
      };
      if (files[0]) reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const detailsArray = formData.details.split(',').map(item => item.trim());

    const newCard = {
      image: formData.image,
      title: formData.title,
      details: detailsArray,
      duration: formData.duration,
      code: formData.code,
    };

    try {
      if (editId !== null) {
        // Update card
        const response = await fetch(`http://localhost:5000/api/cards/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCard),
        });
        if (!response.ok) throw new Error(`Failed to update card: ${response.status}`);
        await fetchCards();
        setEditId(null);
        alert('Card updated successfully!');
      } else {
        // Add new card
        if (cards.length >= 3) {
          alert('Only 3 cards are allowed.');
          return;
        }
        const response = await fetch('http://localhost:5000/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCard),
        });
        if (!response.ok) throw new Error(`Failed to add card: ${response.status}`);
        await fetchCards();
        alert('Card added successfully!');
      }
      setFormData({ image: '', title: '', details: '', duration: '', code: '' });
    } catch (err) {
      console.error('Error submitting card:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleEdit = (card) => {
    setFormData({
      image: card.image,
      title: card.title,
      details: card.details.join(', '),
      duration: card.duration,
      code: card.code,
    });
    setEditId(card._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/cards/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete card: ${errorData.message || response.status}`);
      }
      await fetchCards();
      alert('Card deleted successfully!');
    } catch (err) {
      console.error('Error deleting card:', err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="cards-admin-wrapper container mt-5">
      <h3 className="text-center mb-4">Manage Cards</h3>

      {/* Horizontal 3 cards */}
      <div className="cards-row">
        {cards.map((card) => (
          <div className="custom-card" key={card._id}>
            <img src={card.image} className="custom-img" alt={card.title} />
            <div className="card-body">
              <h5 className="card-title">{card.title}</h5>
              <ul className="card-text small">
                {card.details.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="card-footer">
              <span><strong>Duration:</strong> {card.duration}</span>
              <span><strong>Code:</strong> {card.code}</span>
            </div>
            <div className="card-footer">
              <button className="btn btn-sm btn-warning" onClick={() => handleEdit(card)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(card._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Form section below cards */}
      <form onSubmit={handleSubmit} className="card-form-mqqc mt-5">
        <h4 className="mb-4">{editId !== null ? 'Update Card' : 'Add New Card'}</h4>

        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="form-control"
            onChange={handleChange}
            required={!editId && !formData.image}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Card Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Card Details (comma-separated)</label>
          <textarea
            name="details"
            className="form-control"
            value={formData.details}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Card Duration</label>
          <input
            type="text"
            name="duration"
            className="form-control"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Card Code</label>
          <input
            type="text"
            name="code"
            className="form-control"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success">
          {editId !== null ? 'Update Card' : 'Add Card'}
        </button>
      </form>
    </div>
  );
};

export default CardsAdmin;