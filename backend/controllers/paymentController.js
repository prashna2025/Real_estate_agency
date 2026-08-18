import { generateEsewaSignature } from '../services/paymentService.js';
import Property from '../models/Property.js';

export const initPayment = async (req, res) => {
  const { propertyId } = req.body;
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
    success_url: `http://localhost:5173/admin/properties?payment=success&property=${propertyId}`,
    failure_url: `http://localhost:5173/admin/properties?payment=failed`,
    signed_field_names: 'total_amount,transaction_uuid,product_code',
    signature,
  });
};

export const verifyPayment = async (req, res) => {
  // In production, you would call eSewa's status check API here using req.query.data
  // For this scope, we simulate successful webhook update:
  const { propertyId } = req.body;
  await Property.findByIdAndUpdate(propertyId, { isFeatured: true });
  res.json({ success: true, message: 'Property is now featured!' });
};