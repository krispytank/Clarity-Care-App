import express from 'express';
import Prescription from '../models/Prescription.js';
import { protect } from './auth.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const prescription = await Prescription.create({
      ...req.body,
      doctor: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: { prescription }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }

    const prescriptions = await Prescription.find(query)
      .populate('patient', 'firstName lastName email profile')
      .populate('doctor', 'firstName lastName email doctorInfo')
      .populate('appointment');

    res.json({
      status: 'success',
      data: { prescriptions }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', protect, async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      data: { prescription }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;