import express from 'express';
import Appointment from '../models/Appointment.js';
import { protect } from './auth.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      patient: req.user.role === 'patient' ? req.user._id : req.body.patient,
      doctor: req.user.role === 'doctor' ? req.user._id : req.body.doctor
    });

    res.status(201).json({
      status: 'success',
      data: { appointment }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/my-appointments', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName email profile')
      .populate('doctor', 'firstName lastName email doctorInfo')
      .sort({ date: 1 });

    res.json({
      status: 'success',
      data: { appointments }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      data: { appointment }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;