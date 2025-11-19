import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
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
  date: { type: Date, required: true },
  duration: { type: Number, default: 30 },
  status: { 
    type: String, 
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  type: { 
    type: String, 
    enum: ['video', 'audio', 'chat'],
    required: true 
  },
  symptoms: [String],
  notes: String,
  meetingLink: String,
  reminders: [{
    sentAt: Date,
    type: String
  }]
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);