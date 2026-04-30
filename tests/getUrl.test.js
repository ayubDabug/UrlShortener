const request = require("supertest");
const app = require("../app.js")

jest.mock('../lib/prisma', () => ({
  prisma: {
    url: {
      findUnique: jest.fn(),
      update: jest.fn()
    }
  }
}));

describe('GET /:shorten', () => {


 const { prisma } = require('../lib/prisma');
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  test('valid code is accepted', async () => {
    prisma.url.findUnique.mockResolvedValue({
      randomCode: "abc123",
      longUrl: "https://example.com",
      clickCount: 5
    });
    
    const res = await request(app).get('/abc123')
    expect(res.status).toBe(302)
  })

  test('invalid code is rejected', async () => {
   const { prisma } = require('../lib/prisma')

    prisma.url.findUnique.mockResolvedValueOnce(null)
    
    const res = await request(app).get('/thisCodeisntright')
    expect(res.status).toBe(404)
  })
})