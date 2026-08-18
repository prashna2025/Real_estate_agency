import crypto from 'crypto';

// eSewa requires HMAC SHA256 signature for the newer ePay API
export const generateEsewaSignature = (totalAmount, transactionUuid, productCode) => {
  const secretKey = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  
  const hash = crypto.createHmac('sha256', secretKey)
                     .update(message)
                     .digest('base64');
  return hash;
};