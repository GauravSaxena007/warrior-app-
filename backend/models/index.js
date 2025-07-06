const mongoose = require('mongoose');

// Import all models here
const FraCertificate = require('./FraCertificate');
const IssuedCertificate = require('./IssuedCertificate');
const issuedCertificatesRequest = require('./IssuedCertificateRequest');
const admincerti = require('./admin-certi');
const Transaction = require('./Transaction');
const Payment = require('./Payment');
const ManualCerti = require('./ManualCerti')

// Add other models as needed, e.g. Student, Transaction, Course, etc.

module.exports = {
  FraCertificate,
  issuedCertificatesRequest,
  Payment,
  ManualCerti,
  // Add all your models to the exports here
};
