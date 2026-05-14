import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const device_id = event.queryStringParameters.device_id;
    const start = event.queryStringParameters.start;
    const end = event.queryStringParameters.end;

    if (!device_id || !start || !end) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing parameters" })
        };
    }

    const result = await db.send(new QueryCommand({
        TableName: "Measurements",
        KeyConditionExpression: "device_id = :d AND #ts BETWEEN :start AND :end",
        ExpressionAttributeNames: {
            "#ts": "timestamp"
        },
        ExpressionAttributeValues: {
            ":d": device_id,
            ":start": start,
            ":end": end
        }
    }));

    return {
        statusCode: 200,
        body: JSON.stringify(result.Items)
    };
};