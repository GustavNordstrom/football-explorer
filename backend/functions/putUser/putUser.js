const ddb = require("../../utils/dbClient.js");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require("bcrypt");

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { username, password } = body;
    
        if (!username || !password) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: "Username and password are required." }),
          };
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        const params = {
            TableName: "Users",
            Item: {username, hash}
        };

        await ddb.send(new PutCommand(params));
        return {
            statusCode: 201,
            body: JSON.stringify({message: "User added"})
        };

    } catch (err) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal server error", error: err.message }),
        };
    }
};