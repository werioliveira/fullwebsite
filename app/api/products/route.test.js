// Import the required modules
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createClient } from 'redis';
import { request } from '@playwright/test';

// Define the test suite
describe('Products API', () => {
  // Define the test
  test('GET /products should return a list of products from the database and cache the response in Redis for 10 minutes', async () => {
    // Start a MongoDB instance
    const mongod = new MongoMemoryServer();
    const uri = await mongod.getUri();

    // Start a Redis instance
    const redis = createClient();
    await redis.connect();

    // Start a Playwright browser instance
    const browser = await playwright.chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Create a mock products collection
    const products = [
      {
        _id: '1234',
        name: 'Product 1',
        price: 10.99,
      },
      {
        _id: '5678',
        name: 'Product 2',
        price: 29.99,
      },
    ];

    // Mock the products collection
    await page.exposeFunction('getProducts', async () => products);

    // Start the server and make a request to the GET /products endpoint
    const server = await context.getServer();
    server.setRoute('/products', async (req, res) => {
      const cachedProducts = await redis.get('products');
      if (cachedProducts) {
        res.setHeader('Cache-Control', 'public, max-age=600');
        res.end(cachedProducts);
      } else {
        const products = await page.evaluate('getProducts');
        await redis.set('products', JSON.stringify(products), 'EX', 600);
        res.end(JSON.stringify(products));
      }
    });
    await server.run();
    const response = await request(page, 'http://localhost:3000/products');

    // Verify the response
    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).toBe('public, max-age=600');
    expect(JSON.parse(await response.text())).toEqual(products);

    // Close the server and browser instance
    await server.close();
    await browser.close();
  });
});