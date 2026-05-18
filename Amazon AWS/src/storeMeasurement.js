import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const body = JSON.parse(event.body);

    await db.send(new PutCommand({
        TableName: "Measurements",
        Item: {
            device_id: body.device_id,
            timestamp: new Date().toISOString(),
            co2: body.co2,
            temperature: body.temperature
        }
    }));

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
    };
};