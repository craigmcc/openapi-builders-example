// Helpers.ts ----------------------------------------------------------------

/**
 * Shared constants and helpers for OpenAPI Builder 3.1 generators, not specific
 * to a particular project.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders/dist/3.1";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

// Public Objects ============================================================

// General Constants ---------------------------------------------------------

export const APPLICATION_JSON = "application/json";

// Assumed Schema Names ------------------------------------------------------

export const ERROR = "Error";
export const INTEGER = "Integer";
export const NUMBER = "Number";
export const STRING = "String";

// HTTP Response Codes -------------------------------------------------------

export const OK = "200";
export const CREATED = "201";
export const BAD_REQUEST = "400";
export const UNAUTHORIZED = "401";
export const FORBIDDEN = "403";
export const NOT_FOUND = "404";
export const NOT_UNIQUE = "409";
export const SERVER_ERROR = "500";

// Public Functions ----------------------------------------------------------

// Component References ------------------------------------------------------

/**
 * A reference to the specified schema.
 */
export const schemaRef = (name: string): ob.ReferenceObject => {
    return new ob.ReferenceObjectBuilder(`#/components/schemas/${name}`)
        .build();
}

// ParameterObject Helpers ---------------------------------------------------

/**
 * Generate a ParameterObject for the specified path parameter.
 *
 * @param name Name of the specified parameter
 * @param description Description of the specified parameter
 * @param type Parameter type (STRING | INTEGER | NUMBER) [STRING]
 */
export function pathParameter(
    name: string,
    description: string,
    type: string = STRING
): ob.ParameterObject
{
    const builder = new ob.ParameterObjectBuilder(name, "path")
        .description(description)
        .required(true)
        .schema(schemaRef(type))
    ;
    return builder.build();
}

/**
 * Generate a ParameterObject for the specified query parameter.
 *
 * @param name Name of the specified parameter
 * @param description Description of the specified parameter
 * @param allowEmptyValue Is an empty value allowed? [false]
 * @param type Parameter type (STRING | INTEGER | NUMBER) [STRING]
 */
export function queryParameter(
    name: string,
    description: string,
    allowEmptyValue: boolean = false,
    type: string = STRING
): ob.ParameterObject
{
    const builder = new ob.ParameterObjectBuilder(name, "query")
        .description(description)
        .required(false)
        .schema(schemaRef(type))
    ;
    return builder.build();
}

// ResponseObjectBuilder Helpers ---------------------------------------------

/**
 * Generate a ResponseObjectBuilder for the specified error description.
 *
 * @param description Description of this error
 */
export function errorResponseObjectBuilder(description: string): ob.ResponseObjectBuilder {
    const builder = new ob.ResponseObjectBuilder(description)
        .content(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .schema(schemaRef(ERROR))
            .build())
    ;
    return builder;
}
