import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { handler } from "../src/login.js";

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
    ddbMock.reset();
});

test("successful login", async () => {

    ddbMock.on(GetCommand).resolves({
        Item: {
            email: "test@test.com",
            password: "1234",
            user_id: "abc123"
        }
    });

    const event = {
        body: JSON.stringify({
            email: "test@test.com",
            password: "1234"
        })
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);

    expect(body.success).toBe(true);
    expect(body.user_id).toBe("abc123");
});