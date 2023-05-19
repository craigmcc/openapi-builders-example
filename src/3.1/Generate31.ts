// Generate31.ts -------------------------------------------------------------

/**
 * Function to generate the OpenAPI 3.1 description document for a simple
 * application, using @craigmcc/openapi-builders for tooling.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders/dist/3.1";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {
    APPLICATION_JSON,
    BAD_REQUEST,
    FORBIDDEN,
    NOT_FOUND,
    schemaRef
} from "./Generic";
import {
    openApi,
} from "./Unique";

// Configuration Constants ---------------------------------------------------

const ERROR_SCHEMA = "GenericError";

// Public Objects ------------------------------------------------------------

let RESULT: string = "";

/**
 * Generate and return the OpenAPI 3.1 document for our sample application.
 */
export default function generate31(): string {

    if (RESULT === "") {

        const openApiResult = openApi();

        RESULT = JSON.stringify(
            openApiResult,
            (key: string, value: any) => {
                if ((value instanceof Map) || (value instanceof Set)) {
                    let output: any = {};
                    for (const [k, v] of value) {
                        output[k] = v;
                    }
                    return output;
                } else {
                    return value;
                }
            },
            2
        );

    }

    return RESULT;

}

// Private Objects -----------------------------------------------------------

/**
 * A ResponseObject for a specified HTTP status code and description.
 */
const errorResponse = (description: string): ob.ResponseObject => {
    const mediaType = new ob.MediaTypeObjectBuilder()
        .schema(schemaRef(ERROR_SCHEMA))
        .build();
    const response = new ob.ResponseObjectBuilder(description)
        .content(APPLICATION_JSON, mediaType)
        .build();
    return response;
}

/**
 * The set of ResponseObjects that represent error reports, keyed by HTTP status code
 */
const errorResponses = (): Map<string, ob.ResponseObject | ob.ReferenceObject> => {
    const responses = new Map<string, ob.ResponseObject | ob.ReferenceObject>();
    responses.set(BAD_REQUEST, errorResponse("Error in request properties"));
    responses.set(FORBIDDEN, errorResponse("Requested operation is forbidden"));
    responses.set(NOT_FOUND, errorResponse("Requested item is not found"));
    return responses;
}

/**
 * Schema for a generic response error report.
 */
const errorSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("object")
        .property("context", new ob.SchemaPropertyObjectBuilder("string")
            .description("Error source location")
            .build())
        .property("message", new ob.SchemaPropertyObjectBuilder("string")
            .description("Error message summary")
            .build())
        .property("status", new ob.SchemaPropertyObjectBuilder("integer")
            .description("HTTP status code")
            .build())
        .build();
}

/**
 * Consolidated schemas for this specification document, keyed by schema name.
 */
const schemas = (): Map<string, ob.SchemaObject> => {
    const schemas = new Map<string, ob.SchemaObject>();
    schemas.set(ERROR_SCHEMA, errorSchema());
    return schemas;
}
