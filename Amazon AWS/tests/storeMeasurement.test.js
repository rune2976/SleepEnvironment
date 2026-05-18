import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { handler } from "../src/storeMeasurement.js";

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
    ddbMock.reset();
});

test("successfully stores measurement data", async () => {

    ddbMock.on(PutCommand).resolves({});

    const event = {
        body: JSON.stringify({
            device_id: "device1",
            co2: 550,
            temperature: 22
        })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);

    expect(body.success).toBe(true);
});