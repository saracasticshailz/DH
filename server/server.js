import cors from 'cors';
import express from 'express';
import paymentService from './services/payment-server.js';
import samlService from './services/saml-service.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/paymentService', paymentService);
app.use('/samlService', samlService);

const PORT = process.env.BE_PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
