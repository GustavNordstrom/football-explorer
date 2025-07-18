const { mockClient } = require("aws-sdk-client-mock");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const ddb = require("../../utils/dbClient");
const ddbMock = mockClient(ddb.constructor);
const { handler } = require("./checkLogin");
const bcrypt = require("bcrypt");

describe("checkLogin Lambda", () => {
    beforeEach(() => {
        ddbMock.reset();
    });

    it("returns 200 when login credentials are correct", async () => {
        const password = "testpassword";
        const hash = await bcrypt.hash(password, 10);

        ddbMock.on(GetCommand).resolves({
            Item: {username: "testuser", password: hash}
        });

        const response = await handler({
            body: JSON.stringify({username: "testuser", password: password})
        });

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).message).toBe("Login successful");
    });

    it("returns 401 when password is incorrect", async () => {
        const correctHash = await bcrypt.hash("correctpassword", 10);

        ddbMock.on(GetCommand).resolves({
            Item: {username: "testuser", password: correctHash}
        });

        const response = await handler({
            body: JSON.stringify({username: "testuser", password: "wrongpassword"})
        });

        expect(response.statusCode).toBe(401);
        expect(JSON.parse(response.body).message).toBe("Invalid username or password");
    });

    it("returns 401 when user does not exist", async () => {
        ddbMock.on(GetCommand).resolves({});

        const response = await handler({
            body: JSON.stringify({username: "username", password: "password"})
        });

        expect(response.statusCode).toBe(401);
        expect(JSON.parse(response.body).message).toBe("Invalid username or password");
    });
});