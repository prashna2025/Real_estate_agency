import Appointment from '../models/Appointment.js';

/**
 * @desc  Book a property visit
 * @route POST /api/appointments
 * @access Public (optionally attached to logged-in user)
 */
export const createAppointment = async (req, res) => {
  try {
    const { name, email, phone, date, time, message, propertyId } = req.body;
    if (!name || !email || !phone || !date || !time || !propertyId) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const appointment = await Appointment.create({
      name, email, phone, date, time, message, propertyId,
      userId: req.user?._id ?? undefined,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc  Get all appointments (admin)
 * @route GET /api/appointments
 * @access Admin
 */
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('propertyId', 'title slug city')
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc  Update appointment status (admin)
 * @route PATCH /api/appointments/:id/status
 * @access Admin
 */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc  Get appointments for the logged-in user
 * @route GET /api/appointments/mine
 * @access User
 */
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate('propertyId', 'title slug city images')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc  Cancel an appointment (user)
 * @route PATCH /api/appointments/:id/cancel
 * @access User
 */
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    appointment.status = 'Cancelled';
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
