const mongoose = require("mongoose");

const fraCertificateSchema = new mongoose.Schema(
  {
    franchisee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchisee",
      required: true,
    },
    photo: {
      type: String, // filename of uploaded certificate
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FraCertificate", fraCertificateSchema);
