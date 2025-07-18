const ddb = require("../../utils/dbClient.js");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");
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

        const params = {
            TableName: "Users",
            Key: { username },
        };
    
        const result = await ddb.send(new GetCommand(params));
        const user = result.Item;

        if(!user){
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Invalid username or password" })
            };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return {
              statusCode: 401,
              body: JSON.stringify({ message: "Invalid username or password" }),
            };
        }
      
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Login successful" }),
        };

    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Internal server error", error: err.message})
        };
    }
}