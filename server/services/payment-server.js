import express from 'express';

const router = express.Router();
router.use(express.json());

const paymentGatewayUrl = 'https://checkout.totalpay.global/api/v1/session'; // Replace with actual payment API endpoint

// http://localhost:3005/paymentService/initiate-checkout
router.post('/initiate-checkout', async (req, res) => {
  try {
    const { merchant_key, success_url, cancel_url, operation, order, hash } = req.body;

    if (!merchant_key || !success_url || !cancel_url || !operation || !order || !hash) {
      return res.status(400).json({ error_message: 'Missing required parameters.' });
    }

    const checkoutData = {
      merchant_key,
      success_url,
      cancel_url,
      operation,
      hash,
      order: {
        number: order.number,
        amount: order.amount,
        currency: order.currency,
        description: order.description,
      },
    };

    const response = await fetch(paymentGatewayUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutData),
    });

    const data = await response.json();
    console.log(data);

    if (data && data.redirect_url) {
      return res.json({ payment_url: data.redirect_url });
    } else {
      return res.status(500).json({ error_message: 'Failed to create payment session.' });
    }
  } catch (error) {
    return res.status(500).json({ error_message: error.message || 'Internal Server Error' });
  }
});

router.get('/', (req, res) => {
  res.json({ message: 'Payment-service' });
});

export default router; // ✅ Fix: Use ES module export
