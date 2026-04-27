const request = require("supertest");
const app = require("../server.js")

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    url: {
      findFirst: jest.fn().mockResolvedValue({ 
        randomCode: "abc123", 
        longUrl: "https://example.com",
        clickCount: 5
      })
    }
  }))
}));

describe('GET /stats/:shortCode', () => {
  test('return stats for a valid code', async () => {
    const res = await request(app).get('/stats/abc123')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("clickCount")
    expect(res.body).toHaveProperty("originalUrl")
  })

  test('rejects invalid code', async () => {

    const { PrismaClient } = require('@prisma/client')
    const mockPrisma = PrismaClient.mock.results[0].value
    mockPrisma.url.findFirst.mockResolvedValueOnce(null)
    
    const res = await request(app).get('/stats/wdas12')
    expect(res.status).toBe(404)
  })
})