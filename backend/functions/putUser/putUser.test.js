const { mockClient } = require("aws-sdk-client-mock");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");

const ddb = require("../../utils/dbClient");
const ddbMock = mockClient(ddb.constructor);

const { handler } = require("./putUser");

describe("putUser Lambda", () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  it("returns 201 when user is added", async () => {
    ddbMock.on(PutCommand).resolves({});

    const response = await handler({
      body: JSON.stringify({ username: "testuser", password: "testpass" }),
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body).message).toBe("User added");
  });

  it("returns 400 when username or password is missing", async () => {
    const response = await handler({ body: JSON.stringify({}) });

    expect(response.statusCode).toBe(400);
  });
});
