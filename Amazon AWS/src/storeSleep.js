import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const body = JSON.parse(event.body);

    await db.send(new PutCommand({
        TableName: "SleepSessions",
        Item: {
            user_id: body.user_id,
            date: body.date,
            sleep_score: body.sleep_score,
            disturbances: body.disturbances
        }
    }));

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
    };
};