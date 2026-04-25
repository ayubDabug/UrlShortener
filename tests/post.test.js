
const request = require("supertest");
const app = require("../app.js")

jest.mock('../lib/prisma', () => ({
  prisma: {
    url: {
      create: jest.fn().mockResolvedValue({})
    }
  }
}));

describe('POST /shorten', () => {

test('valid post request is successful', async () => {
    const res = await request(app)
    .post('/shorten')
    .send({url: 'https://www.youtube.com/watch?v=p7kHHqi2lVE'})
    
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty("shortCode")
    expect(res.body).toHaveProperty("shortUrl")
    expect(res.body.shortCode).toHaveLength(6)
    expect(res.body.shortUrl).toContain(res.body.shortCode)

})

test('empty url is rejected', async () => {
    const res = await request(app)
    .post('/shorten')
    .send({url: ''})
    expect(res.status).toBe(400)
})

test('invalid url is rejected', async () => {
   const res = await request(app)
    .post('/shorten')
    .send({url: 'tps://utube.om/wat3Ja4&liMEM6ijAnFTG9nX1G-kbWBU'})
    expect(res.status).toBe(400)
})

test('missing url field is rejected', async () => {
  const res = await request(app)
    .post('/shorten')
    .send({}) 
  expect(res.status).toBe(400)
})







})