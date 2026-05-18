import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { handler } from "../src/storeSleep.js";

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
    ddbMock.reset();
});

test("successfully stores sleep data", async () => {

    ddbMock.on(PutCommand).resolves({});

    const event = {
        body: JSON.stringify({
            user_id: "user123",
            date: "2025-09-20",
            sleep_score: 88,
            disturbances: 1
        })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);

    expect(body.success).toBe(true);
});