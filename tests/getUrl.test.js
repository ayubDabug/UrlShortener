const request = require("supertest");
const app = require("../app.js")

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    url: {
      findFirst: jest.fn().mockResolvedValue({ 
        randomCode: "abc123", 
        longUrl: "https://example.com",
        clickCount: 5
      }),
      update: jest.fn().mockResolvedValue({})
    }
  }))
}));

describe('GET /:shorten', () => {
  test('valid code is accepted', async () => {
    const res = await request(app).get('/abc123')
    expect(res.status).toBe(302)
  })

  test('invalid code is rejected', async () => {
    const { PrismaClient } = require('@prisma/client')
    const mockPrisma = PrismaClient.mock.results[0].value
    mockPrisma.url.findFirst.mockResolvedValueOnce(null)
    
    const res = await request(app).get('/thisCodeisntright')
    expect(res.status).toBe(404)
  })
})