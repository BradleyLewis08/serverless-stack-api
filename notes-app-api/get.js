import handler from "./libs/handler-lib";
import dynamoDB from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
    const params = {
        TableName: process.env.TableName,
        Key :{
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: event.pathParameters.id,
        }
    };
    // Unlike 'create', we need to return the result to the user
    const result = await dynamoDB.get(params);
    if (! result.Item) {
        throw new Error("Item not found");
    }

    return result.Item;
});