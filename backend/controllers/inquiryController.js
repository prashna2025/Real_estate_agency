import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';
import { sendInquiryEmail } from '../services/emailServices.js';

/**
 * @desc   Create new inquiry from public property page
 * @route  POST /api/inquiries
 * @access Public
 */
export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message, propertyId } = req.body;
    if (!name || String(name).trim().length < 2 || String(name).length > 100) {
      return res.status(400).json({ message: 'Name must be between 2 and 100 characters' });
    }
    if (!/^\S+@\S+\.\S+$/.test(String(email || '')) || String(email).length > 254) {
      return res.status(400).json({ message: 'A valid email is required' });
    }
    if (!phone || String(phone).length > 30 || !/^[+\d ()-]+$/.test(String(phone))) {
      return res.status(400).json({ message: 'A valid phone number is required' });
    }
    if (!message || String(message).trim().length < 5 || String(message).length > 2000) {
      return res.status(400).json({ message: 'Message must be between 5 and 2000 characters' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      message,
      propertyId,
    });

    // Send email alert to admin asynchronously
    sendInquiryEmail({ inquiry, property });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. Our team will contact you shortly.',
      inquiry,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc   Get all inquiries with property metadata
 * @route  GET /api/inquiries
 * @access Private/Admin
 */
export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('propertyId', 'title slug price location city images')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Update inquiry follow-up status (New / Contacted / Resolved)
 * @route  PATCH /api/inquiries/:id/status
 * @access Private/Admin
 */
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    inquiry.status = status || inquiry.status;
    const updated = await inquiry.save();

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};