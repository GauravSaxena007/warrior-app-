const mongoose = require('mongoose');

const marqueeSchema = new mongoose.Schema({
  texts: {
    type: [String],
    required: true,
    default: [
      '🎓 Franchisee Opportunity',
      '📜 Get Certified Today',
      '💼 Job-Ready Courses',
      '🌐 Online & Offline Training',
      '📍 Join the Warrior Family',
      '🎯 Skill-Oriented Programs',
      '🛡️ Trusted by Thousands'
    ]
  },
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  font: {
    type: String,
    default: 'Arial'
  },
  showMarquee: {
    type: Boolean,
    default: true
  }
});

// Add error handling for schema validation
marqueeSchema.post('save', function (error, doc, next) {
  if (error.name === 'ValidationError') {
    console.error('Marquee validation error:', error.message);
    next(new Error('Invalid marquee data'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Marquee', marqueeSchema);