// __tests__/api.test.js
const { GET, POST } = require('../seu-arquivo-api'); // Substitua pelo caminho correto

describe('GET', () => {
    it('deve retornar os produtos corretamente', async () => {
        // Simule a requisição GET
        const req = { query: { page: 1, limit: 10 } };
        const res = { json: jest.fn() };

        await GET(req, res);

        // Verifique se a função res.json foi chamada com os produtos corretos
        expect(res.json).toHaveBeenCalledWith(/* produtos esperados */);
    });
});

describe('POST', () => {
    it('deve criar um novo produto', async () => {
        // Simule a requisição POST
        const req = { json: jest.fn().mockReturnValue({ /* dados do produto */ }) };
        const res = { json: jest.fn() };

        await POST(req, res);

        // Verifique se a função res.json foi chamada com o produto criado
        expect(res.json).toHaveBeenCalledWith(/* produto criado esperado */);
    });
});
