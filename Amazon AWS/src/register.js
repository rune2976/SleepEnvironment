import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const body = JSON.parse(event.body);

    const { email, password } = body;

    // Check if user exists
    const existing = await db.send(new GetCommand({
        TableName: "Users",
        Key: { email }
    }));

    if (existing.Item) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: "User exists" })
        };
    }

    const user_id = Math.random().toString(36).substring(2, 12);

    await db.send(new PutCommand({
        TableName: "Users",
        Item: {
            email,
            password,
            user_id
        }
    }));

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true, user_id })
    };
};