import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { handler } from "../src/register.js";

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
    ddbMock.reset();
});

test("successful registration", async () => {

    // No existing user found
    ddbMock.on(GetCommand).resolves({});

    // Mock successful database insert
    ddbMock.on(PutCommand).resolves({});

    const event = {
        body: JSON.stringify({
            email: "new@test.com",
            password: "1234"
        })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);

    expect(body.success).toBe(true);
    expect(body.user_id).toBeDefined();
});

test("registration fails if user already exists", async () => {

    // Existing user found
    ddbMock.on(GetCommand).resolves({
        Item: {
            email: "existing@test.com"
        }
    });

    const event = {
        body: JSON.stringify({
            email: "existing@test.com",
            password: "1234"
        })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);

    const body = JSON.parse(response.body);

    expect(body.success).toBe(false);
    expect(body.message).toBe("User exists");
});