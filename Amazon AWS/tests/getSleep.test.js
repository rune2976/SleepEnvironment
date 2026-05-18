import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { handler } from "../src/getSleep.js";

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
    ddbMock.reset();
});

test("successfully retrieves sleep data", async () => {

    ddbMock.on(QueryCommand).resolves({
        Items: [
            {
                user_id: "user123",
                date: "2025-09-20",
                sleep_score: 85,
                disturbances: 2
            },
            {
                user_id: "user123",
                date: "2025-09-21",
                sleep_score: 90,
                disturbances: 1
            }
        ]
    });

    const event = {
        queryStringParameters: {
            user_id: "user123",
            start: "2025-09-20",
            end: "2025-09-21"
        }
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);

    expect(body.length).toBe(2);
    expect(body[0].sleep_score).toBe(85);
});

test("returns 400 if parameters are missing", async () => {

    const event = {
        queryStringParameters: {
            user_id: "user123"
        }
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);

    const body = JSON.parse(response.body);

    expect(body.error).toBe("Missing parameters");
});