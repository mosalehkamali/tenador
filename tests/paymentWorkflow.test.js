const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Installment = require('../models/Installment');
const User = require('../models/User');

// Mock auth middleware
const mockAuth = (req, res, next) => {
  req.user = { _id: new mongoose.Types.ObjectId(), role: 'USER' };
  next();
};

const mockAdminAuth = (req, res, next) => {
  req.user = { _id: new mongoose.Types.ObjectId(), role: 'ADMIN' };
  next();
};

// Create test app
const app = express();
app.use(express.json());

// Routes
app.post('/orders', mockAuth, require('../src/app/api/orders/route').POST);
app.post('/payments/online/callback', require('../src/app/api/payments/online/callback/route').POST);
app.post('/payments/bank-receipt', mockAuth, require('../src/app/api/payments/bank-receipt/route').POST);
app.post('/admin/payments/:id/approve', mockAdminAuth, require('../src/app/api/admin/payments/[id]/approve/route').POST);
app.post('/admin/payments/:id/reject', mockAdminAuth, require('../src/app/api/admin/payments/[id]/reject/route').POST);
app.patch('/installments/checks/:checkId/status', mockAdminAuth, require('../src/app/api/installments/checks/[checkId]/status/route').PATCH);

describe('Payment Workflow Tests', () => {
  let userId, adminId, orderId, paymentId, installmentId, checkId;

  beforeEach(async () => {
    userId = new mongoose.Types.ObjectId();
    adminId = new mongoose.Types.ObjectId();
  });

  describe('1. Order Creation', () => {
    it('should create order with ONLINE paymentMethod and set correct initial states', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          items: [{ product: new mongoose.Types.ObjectId(), quantity: 1, price: 100 }],
          totalPrice: 100,
          paymentMethod: 'ONLINE',
          address: new mongoose.Types.ObjectId(),
        });

      expect(response.status).toBe(201);
      expect(response.body.order.paymentStatus).toBe('PENDING');
      expect(response.body.order.fulfillmentStatus).toBe('WAITING');
      expect(response.body.payment.status).toBe('PENDING');

      orderId = response.body.order._id;
      paymentId = response.body.payment._id;
    });

    it('should create order with BANK_RECEIPT and set correct states', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          items: [{ product: new mongoose.Types.ObjectId(), quantity: 1, price: 100 }],
          totalPrice: 100,
          paymentMethod: 'BANK_RECEIPT',
          address: new mongoose.Types.ObjectId(),
        });

      expect(response.status).toBe(201);
      expect(response.body.order.paymentStatus).toBe('PENDING');
      expect(response.body.order.fulfillmentStatus).toBe('WAITING');
      expect(response.body.payment.status).toBe('PENDING');
    });

    it('should create order with INSTALLMENT and set UNDER_REVIEW', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          items: [{ product: new mongoose.Types.ObjectId(), quantity: 1, price: 100 }],
          totalPrice: 100,
          paymentMethod: 'INSTALLMENT',
          address: new mongoose.Types.ObjectId(),
        });

      expect(response.status).toBe(201);
      expect(response.body.order.paymentStatus).toBe('UNDER_REVIEW');
      expect(response.body.order.fulfillmentStatus).toBe('WAITING');
      expect(response.body.payment.status).toBe('PENDING');

      const installment = await Installment.findOne({ order: response.body.order._id });
      expect(installment).toBeTruthy();
      installmentId = installment._id;
    });
  });

  describe('2. ONLINE Payment Flow', () => {
    it('should handle successful callback and update statuses', async () => {
      // Create order first
      const orderRes = await request(app)
        .post('/orders')
        .send({
          items: [{ product: new mongoose.Types.ObjectId(), quantity: 1, price: 100 }],
          totalPrice: 100,
          paymentMethod: 'ONLINE',
          address: new mongoose.Types.ObjectId(),
        });
      paymentId = orderRes.body.payment._id;
      orderId = orderRes.body.order._id;

      const response = await request(app)
        .post('/payments/online/callback')
        .send({
          paymentId,
          status: 'success',
          transactionId: 'txn123',
        });

      expect(response.status).toBe(200);

      const payment = await Payment.findById(paymentId);
      const order = await Order.findById(orderId);

      expect(payment.status).toBe('PAID');
      expect(order.paymentStatus).toBe('PAID');
      expect(order.fulfillmentStatus).toBe('PROCESSING');
    });

    it('should handle failed callback and not update statuses', async () => {
      const response = await request(app)
        .post('/payments/online/callback')
        .send({
          paymentId,
          status: 'failed',
          transactionId: 'txn123',
        });

      expect(response.status).toBe(200);

      const payment = await Payment.findById(paymentId);
      const order = await Order.findById(orderId);

      expect(payment.status).toBe('FAILED');
      expect(order.paymentStatus).toBe('REJECTED');
    });

    it('should handle duplicate gateway callbacks', async () => {
      // First callback
      await request(app)
        .post('/payments/online/callback')
        .send({
          paymentId,
          status: 'success',
          transactionId: 'txn123',
        });

      // Duplicate callback
      const response = await request(app)
        .post('/payments/online/callback')
        .send({
          paymentId,
          status: 'success',
          transactionId: 'txn123',
        });

      expect(response.status).toBe(400); // Already processed
    });
  });

  describe('3. BANK_RECEIPT Flow', () => {
    it('should upload receipt and set UNDER_REVIEW', async () => {
      // Create order
      const orderRes = await request(app)
        .post('/orders')
        .send({
          items: [{ product: new mongoose.Types.ObjectId(), quantity: 1, price: 100 }],
          totalPrice: 100,
          paymentMethod: 'BANK_RECEIPT',
          address: new mongoose.Types.ObjectId(),
        });
      paymentId = orderRes.body.payment._id;
      orderId = orderRes.body.order._id;

      const response = await request(app)
        .post('/payments/bank-receipt')
        .send({
          paymentId,
          receiptUrl: 'http://example.com/receipt.jpg',
        });

      expect(response.status).toBe(200);

      const order = await Order.findById(orderId);
      expect(order.paymentStatus).toBe('UNDER_REVIEW');
    });

    it('should allow admin to approve payment', async () => {
      const response = await request(app)
        .post(`/admin/payments/${paymentId}/approve`);

      expect(response.status).toBe(200);

      const payment = await Payment.findById(paymentId);
      const order = await Order.findById(orderId);

      expect(payment.status).toBe('PAID');
      expect(order.paymentStatus).toBe('PAID');
      expect(order.fulfillmentStatus).toBe('PROCESSING');
    });

    it('should allow admin to reject payment', async () => {
      // Create another order
      const orderRes = await request(app)
        .post('/orders')
        .send({
          items: [{ product: new mongoose.Types.ObjectId(), quantity: 1, price: 100 }],
          totalPrice: 100,
          paymentMethod: 'BANK_RECEIPT',
          address: new mongoose.Types.ObjectId(),
        });
      const newPaymentId = orderRes.body.payment._id;
      const newOrderId = orderRes.body.order._id;

      await request(app)
        .post('/payments/bank-receipt')
        .send({
          paymentId: newPaymentId,
          receiptUrl: 'http://example.com/receipt.jpg',
        });

      const response = await request(app)
        .post(`/admin/payments/${newPaymentId}/reject`);

      expect(response.status).toBe(200);

      const payment = await Payment.findById(newPaymentId);
      const order = await Order.findById(newOrderId);

      expect(payment.status).toBe('REJECTED');
      expect(order.paymentStatus).toBe('REJECTED');
    });

    it('should prevent concurrent admin approvals', async () => {
      // Simulate concurrent by checking state
      const response1 = await request(app)
        .post(`/admin/payments/${paymentId}/approve`);

      const response2 = await request(app)
        .post(`/admin/payments/${paymentId}/approve`);

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(400); // Invalid state
    });
  });

  describe('4. INSTALLMENT Flow', () => {
    it('should add checks to installment', async () => {
      // Assume installment created in order creation test
      // For simplicity, add checks manually in test
      const installment = await Installment.findById(installmentId);
      installment.checks = [
        { amount: 50, dueDate: new Date(), status: 'PENDING' },
        { amount: 50, dueDate: new Date(), status: 'PENDING' },
      ];
      await installment.save();
      checkId = installment.checks[0]._id;
    });

    it('should update check status and mark payment as PAID when all cleared', async () => {
      // Clear first check
      await request(app)
        .patch(`/installments/checks/${checkId}/status`)
        .send({ status: 'CLEARED' });

      let payment = await Payment.findOne({ order: orderId });
      let order = await Order.findById(orderId);
      expect(payment.status).toBe('PENDING'); // Not yet all cleared

      // Clear second check
      const installment = await Installment.findById(installmentId);
      const secondCheckId = installment.checks[1]._id;

      await request(app)
        .patch(`/installments/checks/${secondCheckId}/status`)
        .send({ status: 'CLEARED' });

      payment = await Payment.findOne({ order: orderId });
      order = await Order.findById(orderId);
      expect(payment.status).toBe('PAID');
      expect(order.paymentStatus).toBe('PAID');
    });

    it('should handle partial installment clearance', async () => {
      // Create new installment order
      const orderRes = await request(app)
        .post('/orders')
        .send({
          items: [{ product: new mongoose.Types.ObjectId(), quantity: 1, price: 100 }],
          totalPrice: 100,
          paymentMethod: 'INSTALLMENT',
          address: new mongoose.Types.ObjectId(),
        });
      const newOrderId = orderRes.body.order._id;
      const newInstallment = await Installment.findOne({ order: newOrderId });
      newInstallment.checks = [
        { amount: 33, dueDate: new Date(), status: 'PENDING' },
        { amount: 33, dueDate: new Date(), status: 'PENDING' },
        { amount: 34, dueDate: new Date(), status: 'PENDING' },
      ];
      await newInstallment.save();

      // Clear one check
      const check1Id = newInstallment.checks[0]._id;
      await request(app)
        .patch(`/installments/checks/${check1Id}/status`)
        .send({ status: 'CLEARED' });

      let payment = await Payment.findOne({ order: newOrderId });
      expect(payment.status).toBe('PENDING');

      // Clear second
      const check2Id = newInstallment.checks[1]._id;
      await request(app)
        .patch(`/installments/checks/${check2Id}/status`)
        .send({ status: 'CLEARED' });

      payment = await Payment.findOne({ order: newOrderId });
      expect(payment.status).toBe('PENDING'); // Still not all

      // Clear third
      const check3Id = newInstallment.checks[2]._id;
      await request(app)
        .patch(`/installments/checks/${check3Id}/status`)
        .send({ status: 'CLEARED' });

      payment = await Payment.findOne({ order: newOrderId });
      expect(payment.status).toBe('PAID');
    });
  });

  describe('5. Security & Invalid Transitions', () => {
    it('should prevent client from setting status fields', async () => {
      // This is enforced by not allowing status in input validation
      const response = await request(app)
        .post('/orders')
        .send({
          items: [{ product: new mongoose.Types.ObjectId(), quantity: 1, price: 100 }],
          totalPrice: 100,
          paymentMethod: 'ONLINE',
          address: new mongoose.Types.ObjectId(),
          paymentStatus: 'PAID', // Should be ignored
        });

      expect(response.body.order.paymentStatus).toBe('PENDING');
    });

    it('should reject illegal state transitions', async () => {
      // Try to approve already approved payment
      const response = await request(app)
        .post(`/admin/payments/${paymentId}/approve`);

      expect(response.status).toBe(400); // Invalid state
    });

    it('should prevent duplicate payments', async () => {
      // Unique constraint on Payment.order
      const duplicate = new Payment({
        order: orderId,
        method: 'ONLINE',
        amount: 100,
      });
      await expect(duplicate.save()).rejects.toThrow();
    });

    it('should reject invalid status updates', async () => {
      const response = await request(app)
        .patch(`/installments/checks/${checkId}/status`)
        .send({ status: 'INVALID' });

      expect(response.status).toBe(400);
    });
  });
});
