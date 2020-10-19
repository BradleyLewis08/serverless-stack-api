import * as uuid from "uuid";
import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export function main(event, context, callback) {
  // Event that called callback function
  const data = JSON.parse(event.body);

  // Specifies the data that will be input into the database when this API is called
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      // Creates a unique identifier by invoking this method
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }

  };

  dynamoDB.put(params, (error, data) => {
    // Allows CORS
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };
    // If there is an error, return 500
    if(error){
      const response = {
        statusCode: 500,
        headers: headers,
        // Response body has false status, likely to be used later
        body: JSON.stringify({ status: false }),
        error: error
      };
      callback(null, response);
      return;
    };

    // If not, return notes item with all relevant data that was constructed above
    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item)
    };
    callback(null, response); });
};
