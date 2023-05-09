// generate31.ts -------------------------------------------------------------

import {MediaTypeObjectBuilder} from "@craigmcc/openapi-builders";

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
    parameterRef,
    schemaRef,
} from "./common";
import {
    APPLICATION_JSON,
    BAD_REQUEST,
    FORBIDDEN,
    NOT_FOUND,
    REQUIRE_ADMIN,
    REQUIRE_ANY,
    REQUIRE_REGULAR,
    REQUIRE_SUPERUSER,
} from "./constants";

// Configuration Constants ---------------------------------------------------

const ERROR_SCHEMA = "GenericError";

// Public Objects ------------------------------------------------------------

let RESULT: string = "";

/**
 * Generate and return the OpenAPI 3.1 document for our sample application.
 */
export default function generate31(): string {

    if (RESULT === "") {

        const openApi =
            new ob.OpenApiObjectBuilder(info())
                .components(components())
                .tags(tags())
                .build();

        RESULT = JSON.stringify(
            openApi,
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
 * Consolidated ComponentsObject for this specification document.
 */
const components = (): ob.ComponentsObject => {
    const components = new ob.ComponentsObjectBuilder()
        .responses(errorResponses())
        .schemas(schemas())
        // TODO
        .build();
    return components;
}

/**
 * The ContactObject for this specification document.
 */
const contact = (): ob.ContactObject => {
    const contact = new ob.ContactObjectBuilder()
        .email("fred@example.com")
        .name("Fred Flintstone")
        .build();
    return contact;
}

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
 * The InfoObject for this specification document.
 */
const info = (): ob.InfoObject => {
    const info =
        new ob.InfoObjectBuilder("Example Application", "3.1.0")
            .contact(contact())
            .description("Illustrate ways to use Builder Patterns for OpenAPI 3.1")
            .license(license())
            .build();
    return info;
}

/**
 * The LicenseObject for this specification document.
 */
const license = (): ob.LicenseObject => {
    const license = new ob.LicenseObjectBuilder("Apache-2.0")
        .identifier("Apache-2.0")
        //.url("https://apache.org/licenses/LICENSE-2.0")
        .build();
    return license;
}

/**
 * Consolidated schemas for this specification document, keyed by schema name.
 */
const schemas = (): Map<string, ob.SchemaObject> => {
    const schemas = new Map<string, ob.SchemaObject>();
    schemas.set(ERROR_SCHEMA, errorSchema());
    return schemas;
}

/**
 * Consolidated tags for this specification document.
 */
const tags = (): ob.TagObject[] => {
    const tags: ob.TagObject[] = [];
    tags.push(new ob.TagObjectBuilder(REQUIRE_ADMIN)
        .description("Requires 'admin' permission on the associated Library")
        .build())
    tags.push(new ob.TagObjectBuilder(REQUIRE_ANY)
        .description("Requires any permission on the associated Library")
        .build())
    tags.push(new ob.TagObjectBuilder(REQUIRE_REGULAR)
        .description("Requires 'regular' permission on the associated Library")
        .build())
    tags.push(new ob.TagObjectBuilder(REQUIRE_SUPERUSER)
        .description("Requires 'superuser' permission on the overall application")
        .build())
    return tags;
}
