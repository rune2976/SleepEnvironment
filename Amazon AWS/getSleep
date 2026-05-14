import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const user_id = event.queryStringParameters.user_id;
    const start = event.queryStringParameters.start;
    const end = event.queryStringParameters.end;

    if (!user_id || !start || !end) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing parameters" })
        };
    }

    const result = await db.send(new QueryCommand({
        TableName: "SleepSessions",
        KeyConditionExpression: "user_id = :u AND #d BETWEEN :start AND :end",
        ExpressionAttributeNames: {
            "#d": "date"
        },
        ExpressionAttributeValues: {
            ":u": user_id,
            ":start": start,
            ":end": end
        }
    }));

    return {
        statusCode: 200,
        body: JSON.stringify(result.Items)
    };
};