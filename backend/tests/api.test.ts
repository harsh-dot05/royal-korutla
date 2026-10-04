import request from 'supertest';
import app from '../src/app';
import { env } from '../src/config/env';

describe('👑 Royal Korutla Express Backend API Test Suite', () => {
  let adminToken: string;
  let adminCookie: string;

  describe('1. Health Check Endpoint', () => {
    it('GET /health should return status UP with 200', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('UP');
    });
  });

  describe('2. Owner Admin Authentication System', () => {
    it('POST /api/admin/login with invalid credentials should return 401', async () => {
      const res = await request(app).post('/api/admin/login').send({
        email: 'wrong@admin.com',
        password: 'WrongPassword123',
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('POST /api/admin/login with valid owner admin credentials should return token & set cookie', async () => {
      const res = await request(app).post('/api/admin/login').send({
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('ADMIN');
      expect(res.body.data.token).toBeDefined();

      adminToken = res.body.data.token;
      const cookies = res.get('Set-Cookie');
      if (cookies && cookies.length > 0) {
        adminCookie = cookies[0];
      }
    });

    it('GET /api/admin/me without token should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/admin/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/admin/me with valid Bearer token should return 200 and admin payload', async () => {
      const res = await request(app)
        .get('/api/admin/me')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(env.ADMIN_EMAIL);
    });
  });

  describe('3. Public & Admin Data Endpoints', () => {
    it('GET /api/businesses should return 200 and business payload', async () => {
      const res = await request(app).get('/api/businesses');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.items)).toBe(true);
    });

    it('GET /api/photography should return 200 and photography payload', async () => {
      const res = await request(app).get('/api/photography');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('GET /api/promotions should return 200 and active promotions payload', async () => {
      const res = await request(app).get('/api/promotions');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('4. Input Validation & Error Handling', () => {
    it('POST /api/orders with empty payload should return 400 Validation Error', async () => {
      const res = await request(app).post('/api/orders').send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('POST /api/admin/promotions without admin auth should return 401', async () => {
      const res = await request(app).post('/api/admin/promotions').send({
        businessName: 'Unauthorized Promo',
      });
      expect(res.status).toBe(401);
    });
  });
});
