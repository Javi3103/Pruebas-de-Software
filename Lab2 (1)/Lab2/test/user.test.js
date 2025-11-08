// Importamos supertest para simular peticiones HTTP
const request = require('supertest');

// Importamos la app (exportada, sin listen)
const app = require('../src/app');

// Importamos el controlador para acceder al array en memoria
const userController = require('../src/controllers/user.controller');
const { users } = userController;

// Hook: limpia el array antes de cada prueba
beforeEach(() => {
  users.length = 0;
});

// Prueba: GET /api/users devuelve lista vacía
test('Get /api/users - should return an empty list initially', async () => {
  const res = await request(app).get('/api/users');
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual([]);
});

// Prueba: POST crea usuario válido
test('Post /api/users - should create a new user', async () => {
  const newUser = { name: 'Javier', email: 'javier@ejemplo.com' };
  const res = await request(app).post('/api/users').send(newUser);
  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty('id');
  expect(res.body.name).toBe('Javier');
});

// Prueba: POST rechaza datos incompletos
test('Post /api/users - should fail if data is incomplete', async () => {
  const res = await request(app).post('/api/users').send({ name: 'Carlos' });
  expect(res.statusCode).toBe(400);
  expect(res.body.message).toBe('Name and email are required');
});

// Prueba de flujo: POST + GET
test('POST then GET - should list created user', async () => {
  await request(app).post('/api/users').send({ name: 'Ana', email: 'ana@ejemplo.com' });
  const getRes = await request(app).get('/api/users');
  expect(getRes.body).toHaveLength(1);
  expect(getRes.body[0].name).toBe('Ana');
});

// Prueba: Ruta inexistente devuelve 404
test('GET /ruta-inexistente - should return 404', async () => {
  const res = await request(app).get('/ruta-inexistente');
  expect(res.statusCode).toBe(404);
  expect(res.body.message).toBe('Route not found');
});