// Common.ts -----------------------------------------------------------------

/**
 * Common functions for OpenAPI Builder 3.1 generators.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders/dist/3.1"
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {
    APPLICATION_JSON,
    BAD_REQUEST,
    CREATED,
    ERROR,
    FORBIDDEN,
    LIMIT,
    NOT_FOUND,
    OFFSET,
    OK,
    STRING,
} from "./Constants";

// Public Objects ============================================================

// Component References ------------------------------------------------------

/**
 * A reference to the specified parameter.
 */
export const parameterRef = (name: string): ob.ReferenceObject => {
    const parameterRef = new ob.ReferenceObjectBuilder(`#/components/parameters/${name}`)
        .build();
    return parameterRef;
}

/**
 * A reference to the specified path item.
 */
export const pathItemRef = (name: string): ob.ReferenceObject => {
    const pathItemRef = new ob.ReferenceObjectBuilder(`#/components/pathItems/${name}`)
        .build();
    return pathItemRef;
}

/**
 * A reference to the specified request body.
 */
export const requestBodyRef = (name: string): ob.ReferenceObject => {
    const requestBodyRef = new ob.ReferenceObjectBuilder(`#/components/requestBodies/${name}`)
        .build();
    return requestBodyRef;
}

/**
 * A reference to the specified response.
 */
export const responseRef = (name: string): ob.ReferenceObject => {
    const responseRef = new ob.ReferenceObjectBuilder(`#/components/responses/${name}`)
        .build();
    return responseRef;
}

/**
 * A reference to the specified schema.
 */
export const schemaRef = (name: string): ob.ReferenceObject => {
    const schemaRef = new ob.ReferenceObjectBuilder(`#/components/schemas/${name}`)
        .build();
    return schemaRef;
}

// Operations ----------------------------------------------------------------

// TODO

// Path Items ----------------------------------------------------------------

// TODO

// Path Parameters -----------------------------------------------------------

/**
 * Return a path parameter string for the specified `modelId`.
 */
export function pathParameter(modelId: string): string {
    return "{" + modelId + "}";
}

// Property Schemas ----------------------------------------------------------

// TODO

// Query Parameters ----------------------------------------------------------

/**
 * Return the query parameters relevant for paginated requests.
 */
export function paginationParameters(): ob.ParametersObject {
    const parametersObject: ob.ParametersObject = {};
    parametersObject[LIMIT] = parameterRef(LIMIT);
    parametersObject[OFFSET] = parameterRef(OFFSET);
    return parametersObject;
}

// Request Bodies ------------------------------------------------------------

/**
 * Return a `RequestBodyObject` for a request body corresponding to
 * the specified model name.
 */
export function modelRequestBody(model: string): ob.RequestBodyObject {
    const modelRequestBody = new ob.RequestBodyObjectBuilder()
        .content(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .schema(schemaRef(model))
            .build())
        .required(true)
        .build();
    return modelRequestBody;
}

// Responses -----------------------------------------------------------------

/**
 * Return a `ResponseObject` for an error response with the
 * specified description.
 */
export function errorResponse(description: string): ob.ResponseObject {
    const errorResponse = new ob.ResponseObjectBuilder(description)
        .content(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .schema(schemaRef(ERROR))
            .build())
        .build();
    return errorResponse;
}

/**
 * Return a `ResponseObject` for a single instance of the specified model.
 */
export function modelResponse(model: string): ob.ResponseObject {
    const modelResponse = new ob.ResponseObjectBuilder(`The requested ${model}`)
        .content(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .schema(schemaRef(model))
            .build())
        .build();
    return modelResponse;
}

/**
 * Return a `ResponseObject` for an array of the specified model.
 */
export function modelsResponse(model: string): ob.ResponseObject {
    const modelsResponse = new ob.ResponseObjectBuilder(`The requested ${pluralize(model)}`)
        .content(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .schema(schemaRef(pluralize(model)))
            .build())
        .build();
    return modelsResponse;
}
