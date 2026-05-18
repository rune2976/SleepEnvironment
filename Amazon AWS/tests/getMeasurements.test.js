import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { handler } from "../src/getMeasurements.js";

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
    ddbMock.reset();
});

test("successfully retrieves measurements", async () => {

    ddbMock.on(QueryCommand).resolves({
        Items: [
            {
                device_id: "device1",
                timestamp: "2025-09-20T10:00:00Z",
                temperature: 22,
                co2: 500
            },
            {
                device_id: "device1",
                timestamp: "2025-09-20T11:00:00Z",
                temperature: 23,
                co2: 520
            }
        ]
    });

    const event = {
        queryStringParameters: {
            device_id: "device1",
            start: "2025-09-20T00:00:00Z",
            end: "2025-09-21T00:00:00Z"
        }
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);

    expect(body.length).toBe(2);
    expect(body[0].temperature).toBe(22);
});

test("returns 400 if parameters are missing", async () => {

    const event = {
        queryStringParameters: {
            device_id: "device1"
        }
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);

    const body = JSON.parse(response.body);

    expect(body.error).toBe("Missing parameters");
});