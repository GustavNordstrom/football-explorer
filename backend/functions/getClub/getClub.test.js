const { handler } = require('./getClub.js');

const mockClubs = [
    { name: "Liverpool", stadium: "Anfield"},
    {name: "Manchester United", stadium: "Old Trafford"}
];

jest.mock('fs', () => ({
    readFileSync: jest.fn(() => JSON.stringify(mockClubs))
  }));

describe("getClub Lambda function", () => {
    it("returns club data when name is found", async () => {
        const event = {
            queryStringParameters: { name: 'Liverpool' }
        };
        const result = await handler(event);

        expect(result.statusCode).toBe(200);
        const body = JSON.parse(result.body);
        expect(body.name).toBe('Liverpool');
        expect(body.stadium).toBe('Anfield');
    });

    it('returns 404 if club not found', async () => {
        const event = {
          queryStringParameters: { name: 'Chelsea' }
        };
        const result = await handler(event);
    
        expect(result.statusCode).toBe(404);
        const body = JSON.parse(result.body);
        expect(body.message).toMatch(/not found/i);
    });

    it('returns 400 if name parameter is missing', async () => {
        const event = { queryStringParameters: null };
        const result = await handler(event);
    
        expect(result.statusCode).toBe(400);
        const body = JSON.parse(result.body);
        expect(body.message).toMatch(/missing/i);
    });
    
});