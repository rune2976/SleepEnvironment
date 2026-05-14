import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const body = JSON.parse(event.body);

    const { email, password } = body;

    const result = await db.send(new GetCommand({
        TableName: "Users",
        Key: { email }
    }));

    if (!result.Item || result.Item.password !== password) {
        return {
            statusCode: 401,
            body: JSON.stringify({ success: false })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
            user_id: result.Item.user_id
        })
    };
};