import { generateEsewaSignature } from '../services/paymentService.js';
import Property from '../models/Property.js';

export const initPayment = async (req, res) => {
  const { propertyId } = req.body;
  const property = await Property.findById(propertyId);
  if (!property) return res.status(404).json({ message: 'Property not found' });
  const transactionUuid = `${propertyId}-${Date.now()}`;
  const amount = 500; // NPR 500 to feature
  const productCode = process.env.ESEWA_MERCHANT_ID || 'EPAYTEST';

  const signature = generateEsewaSignature(amount, transactionUuid, productCode);

  res.json({
    amount,
    tax_amount: 0,
    total_amount: amount,
    transaction_uuid: transactionUuid,
    product_code: productCode,
    product_delivery_charge: 0,
    product_service_charge: 0,
    success_url: `${process.env.CLIENT_URL}/admin/properties?payment=success&property=${propertyId}`,
    failure_url: `${process.env.CLIENT_URL}/admin/properties?payment=failed`,
    signed_field_names: 'total_amount,transaction_uuid,product_code',
    signature,
  });
};

export const verifyPayment = async (req, res) => {
  return res.status(501).json({ message: 'Payment verification is not configured' });
};