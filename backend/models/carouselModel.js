const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const carouselSchema = new mongoose.Schema({
  images: [imageSchema],
  maxImages: {
    type: Number,
    default: 7,
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: 'maxImages must be greater than 0',
    },
  },
});

// You can add a method to limit the number of images if needed
carouselSchema.methods.addImage = function(imageUrl) {
  if (this.images.length < this.maxImages) {
    this.images.push({ url: imageUrl });
  } else {
    throw new Error('Maximum number of images reached');
  }
};

module.exports = mongoose.model('Carousel', carouselSchema);
