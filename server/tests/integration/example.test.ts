import request from 'supertest';
import app from '../../src/app';

describe('Integration Test Example', () => {
  describe('GET /api/v1/health', () => {
    it('should return 200 and health check response', async () => {
      const response = await request(app).get('/api/v1/health');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Health check passed');
      expect(response.body.data).toHaveProperty('status', 'UP');
    });
  });
});
