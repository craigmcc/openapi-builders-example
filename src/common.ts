// common.ts -----------------------------------------------------------------

// OpenAPI Builder 3.1 common constructs

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
} from "./constants";

// Public Objects ------------------------------------------------------------

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

// Parameters ----------------------------------------------------------------

// Path Items ----------------------------------------------------------------

// Path Parameters -----------------------------------------------------------

// Property Schemas ----------------------------------------------------------

// Query Parameters ----------------------------------------------------------

// Request Bodies ------------------------------------------------------------

// Responses -----------------------------------------------------------------

