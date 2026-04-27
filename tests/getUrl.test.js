
const request = require("supertest");
const app = require("../server.js")
jest.mock('../lib/prisma', () => ({
  prisma: {
    url: {
      findFirst: jest.fn().mockResolvedValue({ 
        randomCode: "abc123", 
        longUrl: "https://example.com",
        clickCount: 5
      }),
      update: jest.fn().mockResolvedValue({})
    }
  }
}));

describe('GET /:shorten', () => {

test('valid code is accepted', async () => {
   const res = await request(app).get('/abc123')

   expect(res.status).toBe(302)

})


test('invalid code is rejected', async () => {
   const { prisma } = require('../lib/prisma');
   prisma.url.findFirst.mockResolvedValueOnce(null)
   const res = await request(app).get('/thisCodeisntright')
   expect(res.status).toBe(404)

})
})

