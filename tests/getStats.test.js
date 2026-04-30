const request = require("supertest");
const app = require("../app.js")  


jest.mock('../lib/prisma', () => ({
  prisma: {
    url: {
      findUnique: jest.fn()
      }
  }
}));


describe('GET /stats/:shortCode', () => {

 const { prisma } = require('../lib/prisma');
  beforeEach(() => {
    jest.clearAllMocks(); 
  });



  test('return stats for a valid code', async () => {


    prisma.url.findUnique.mockResolvedValue({
      randomCode: "abc123",
      longUrl: "https://example.com",
      clickCount: 5
    });
    
    const res = await request(app).get('/stats/abc123')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("clickCount")
    expect(res.body).toHaveProperty("originalUrl")
  })

  test('rejects invalid code', async () => {

prisma.url.findUnique.mockResolvedValueOnce(null);
    
    const res = await request(app).get('/stats/wdas12')
    expect(res.status).toBe(404)
  })
})