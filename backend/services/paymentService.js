import crypto from 'crypto';

// eSewa requires HMAC SHA256 signature for the newer ePay API
export const generateEsewaSignature = (totalAmount, transactionUuid, productCode) => {
  const secretKey = process.env.ESEWA_SECRET_KEY;
  if (!secretKey) throw new Error('ESEWA_SECRET_KEY is not configured');
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  
  const hash = crypto.createHmac('sha256', secretKey)
                     .update(message)
                     .digest('base64');
  return hash;
};