import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  appointment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Appointment' 
  },
  medications: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: String
  }],
  labTests: [{
    testName: String,
    instructions: String,
    urgency: { type: String, enum: ['routine', 'urgent'] }
  }],
  diagnosis: String,
  notes: String,
  isDigitalSignature: { type: Boolean, default: false },
  sentToPharmacy: {
    status: { type: Boolean, default: false },
    pharmacyInfo: {
      name: String,
      address: String,
      phone: String
    }
  }
}, { timestamps: true });

export default mongoose.model('Prescription', prescriptionSchema);