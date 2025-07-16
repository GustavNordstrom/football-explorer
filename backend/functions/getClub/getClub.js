const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const clubName = event.queryStringParameters?.name;

  if (!clubName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing 'name' query parameter" }),
    };
  }

  const filePath = path.join(__dirname, '..', '..', 'data', 'clubs.json');
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const clubs = JSON.parse(fileData);

  const club = clubs.find((c) => c.name.toLowerCase() === clubName.toLowerCase());

  if (!club) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: `Club '${clubName}' not found.` }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(club),
  };
};
