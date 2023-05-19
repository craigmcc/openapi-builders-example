// Unique.ts -----------------------------------------------------------------

/**
 * Manifest constants and functions for OpenAPI Builder 3.1 generators,
 * completely unique to this project.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders/dist/3.1";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {LIMIT, OFFSET} from "./Specific";
import {APPLICATION_JSON,
    BAD_REQUEST,
    ERROR,
    FORBIDDEN,
    NOT_FOUND,
    NOT_UNIQUE,
    SERVER_ERROR,
    schemaRef
} from "./Generic";

// Public Constants ==========================================================

// Miscellaneous Constants ---------------------------------------------------

export const API_PREFIX = "/api";

// Model Names ---------------------------------------------------------------

export const AUTHOR = "Author";
export const LIBRARY = "Library";
export const SERIES = "Series";
export const STRING = "String";
export const STORY = "Story";
export const USER = "User";
export const VOLUME = "Volume";

export const AUTHOR_DESCRIPTION = "Author of one or more Series, Stories, or Volumes";
export const LIBRARY_DESCRIPTION = "Library containing Authors, Series, Stories, and Volumes";
export const SERIES_DESCRIPTION = "Collection of related Stories, normally by the same Authors";
export const STORY_DESCRIPTION = "Individual Story that may be part of a Series, and published in one or more Volumes";
export const USER_DESCRIPTION = "Authorized User of this application";
export const VOLUME_DESCRIPTION = "Individual Volume (normally a book) containing one or more Stories";

export const MODELS = [
    AUTHOR,
    LIBRARY,
    SERIES,
    STORY,
    USER,
    VOLUME,
];

// Model Properties ----------------------------------------------------------

export const ACTIVE = "active";
export const AUTHOR_ID = "authorId";
export const COPYRIGHT = "copyright";
export const FIRST_NAME = "firstName";
export const ID = "id";
export const LAST_NAME = "lastName";
export const LIBRARY_ID = "libraryId";
export const NAME = "name";
export const NOTES = "notes";
export const ORDINAL = "ordinal";
export const PASSWORD = "password";
export const PRINCIPAL = "principal";
export const SCOPE = "scope";
export const SERIES_ID = "seriesId";
export const STORY_ID = "storyId";
export const USER_ID = "userId";
export const USERNAME = "username";
export const VOLUME_ID = "volumeId";

// Parameter Names (Includes) ------------------------------------------------

export const WITH_AUTHORS = "withAuthors";
export const WITH_LIBRARY = "withLibrary";
export const WITH_SERIES = "withSeries";
export const WITH_STORIES = "withStories";
export const WITH_VOLUMES = "withVolumes";

// Parameter Names (Matches) -------------------------------------------------

export const MATCH_ACTIVE = "active";
export const MATCH_NAME = "name";
export const MATCH_SCOPE = "scope";
export const MATCH_USERNAME = "username";

// Tag Names -----------------------------------------------------------------

export const REQUIRE_ADMIN = "requireAdmin";
export const REQUIRE_ANY = "requireAny";
export const REQUIRE_REGULAR = "requireRegular";
export const REQUIRE_SUPERUSER = "requireSuperuser";

// Public Functions ==========================================================

// Convenience Builders ------------------------------------------------------

/**
 * Return the ComponentsObject for this application.
 */
export function components(): ob.ComponentsObject {
    return new ob.ComponentsObjectBuilder()
        .parameters(parameters())
        //TODO .pathItems(pathItems())
        .requestBodies(requestBodies())
        .responses(responses())
        //TODO .schemas(schemas())
        .build();
}

/**
 * Return the ContactObject for this application.
 */
export function contact(): ob.ContactObject {
    return new ob.ContactObjectBuilder()
        .email("craigmcc@gmail.com")
        .name("Craig McClanahan")
        .build();
}

/**
 * Return the InfoObject for this application.
 */
export function info(): ob.InfoObject {
    return new ob.InfoObjectBuilder("Library Management Application", "1.0")
        .contact(contact())
        .description("Manage contents and authors of one or more libraries")
        .license(license())
        .build();
}

/**
 * Return the LicenseObject for this application.
 */
export function license(): ob.LicenseObject {
    return new ob.LicenseObjectBuilder("Apache 2.0")
        .identifier("Apache-2.0")
        .build();
}

/**
 * Return the OpenApiObject for this application.
 */
export function openApi(): ob.OpenApiObject {
    return new ob.OpenApiObjectBuilder(info())
        .components(components())
        .tags(tags())
        .build();
}

/**
 * Return a ParametersObject defining all the parameters (of any type)
 * for this application.
 */
export function parameters(): ob.ParametersObject {
    return new ob.ParametersObjectBuilder()
        // Path Parameters
        .parameter(parameterPath(AUTHOR_ID, "ID of the specified Author"))
        .parameter(parameterPath(FIRST_NAME, "First Name of the specified Author"))
        .parameter(parameterPath(LAST_NAME, "Last Name of the specified Author"))
        .parameter(parameterPath(LIBRARY_ID, "ID of the specified Library"))
        .parameter(parameterPath(NAME + "Path", "Name of the specified object"))
        .parameter(parameterPath(SERIES_ID, "ID of the specified Series"))
        .parameter(parameterPath(STORY_ID, "ID of the specified Story"))
        .parameter(parameterPath(USER_ID, "ID of the specified User"))
        .parameter(parameterPath(VOLUME_ID, "ID of the specified Volume"))
        // Query Parameters (Include)
        .parameter(parameterQuery(WITH_AUTHORS, "Include associated Authors", true))
        .parameter(parameterQuery(WITH_LIBRARY, "Include parent Library", true))
        .parameter(parameterQuery(WITH_SERIES, "Include associated Series", true))
        .parameter(parameterQuery(WITH_STORIES, "Include associated Stories", true))
        .parameter(parameterQuery(WITH_VOLUMES, "Include associated Volumes", true))
        // Query Parameters (Match)
        .parameter(parameterQuery(MATCH_ACTIVE, "Select only active objects", true))
        .parameter(parameterQuery(MATCH_NAME, "Select objects with name matching wildcard"))
        .parameter(parameterQuery(MATCH_SCOPE, "Select objects with matching scope"))
        .parameter(parameterQuery(MATCH_USERNAME, "Select objects with matching username"))
        // Query Parameters (Pagination)
        .parameter(parameterQuery(LIMIT, "Maximum number of rows to return [25]"))
        .parameter(parameterQuery(OFFSET, "Zero-relative offset to first returned row [0]"))
        .build();
}

/**
 * Return a Map of RequestBodyObjects for this application, keyed by model name.
 */
export function requestBodies(): Map<string, ob.RequestBodyObject | ob.ReferenceObject> {
    const map: Map<string, ob.RequestBodyObject | ob.ReferenceObject> = new Map();
    map.set(AUTHOR, requestBodyModel(AUTHOR, AUTHOR_DESCRIPTION));
    map.set(LIBRARY, requestBodyModel(LIBRARY, LIBRARY_DESCRIPTION));
    map.set(SERIES, requestBodyModel(SERIES, SERIES_DESCRIPTION));
    map.set(STORY, requestBodyModel(STORY, STORY_DESCRIPTION));
    map.set(USER, requestBodyModel(USER, USER_DESCRIPTION));
    map.set(VOLUME, requestBodyModel(VOLUME, VOLUME_DESCRIPTION));
    return map;
}

/**
 * Return a Map of ResponseObjects for this application, keyed by name.
 */
export function responses(): Map<string, ob.ResponseObject | ob.ReferenceObject> {
    const responses: Map<string, ob.ResponseObject | ob.ReferenceObject> = new Map();

    // Responses for model objects
    for (const model of MODELS) {
        responses.set(model, responseModel(model));
        responses.set(pluralize(model), responseModels(model));
    }

    // Responses for HTTP errors
    responses.set(BAD_REQUEST, responseError("Error in request properties"));
    responses.set(FORBIDDEN, responseError("Requested operation is not allowed"));
    responses.set(NOT_FOUND, responseError("Requested item is not found"));
    responses.set(NOT_UNIQUE, responseError("Request object would violate uniqueness constraints"));
    responses.set(SERVER_ERROR, responseError("General server error occurred"));

    return responses;
}

/**
 * Return an array of TagObjects for each tag defined by this application.
 */
export function tags(): ob.TagObject[] {
    const tags: ob.TagObject[] = [];
    tags.push(new ob.TagObjectBuilder(REQUIRE_ADMIN)
        .description("Requires 'admin' permission on the associated Library")
        .build());
    tags.push(new ob.TagObjectBuilder(REQUIRE_ANY)
        .description("Requires logged in user")
        .build());
    tags.push(new ob.TagObjectBuilder(REQUIRE_REGULAR)
        .description("Requires 'regular' permission on the associated Library")
        .build());
    tags.push(new ob.TagObjectBuilder(REQUIRE_SUPERUSER)
        .description("Requires 'superuser' permission on the overall application")
        .build());
    return tags;
}

// Private Functions =========================================================

/**
 * Return a RequestBodyObject with the specified characteristics.
 * @param model Name of the model object
 * @param description Description of the model object
 */
function requestBodyModel(model: string, description: string): ob.RequestBodyObject {
    return new ob.RequestBodyObjectBuilder()
        .content(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .schema(schemaRef(model))
            .build())
        .description(description)
        .required(true)
        .build();
}

/**
 * Return a ParameterObject for a path parameter with the specified characteristics.
 * @param name Name of this parameter
 * @param description Description of this parameter
 */
function parameterPath(
    name: string,
    description: string
): ob.ParameterObject
{
    const builder = new ob.ParameterObjectBuilder(name, "path")
        .description(description)
        .required(true)
    ;
    return builder.build();

}

/**
 * Return a ParameterObject for a query parameter with the specified characteristics.
 * @param name Name of this parameter
 * @param description Description of this parameter
 * @param allowEmptyValue Optional flag that no value is required [false]
 */
function parameterQuery(
    name: string,
    description: string,
    allowEmptyValue?: boolean,
): ob.ParameterObject
{
    return new ob.ParameterObjectBuilder(name, "query")
        .allowEmptyValue(allowEmptyValue ? allowEmptyValue : false)
        .build();
}

/**
 * Return a ResponseObject for an error with the specified characteristics.
 * @param description Description of this error
 */
function responseError(description: string): ob.ResponseObject {
    return new ob.ResponseObjectBuilder(description)
        .content(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .schema(schemaRef(ERROR))
            .build())
        .build();
}

/**
 * Return a ResponseObject for a single model instance.
 * @param model Name of the model object being returned
 */
function responseModel(model: string): ob.ResponseObject {
    return new ob.ResponseObjectBuilder(`The specified ${model}`)
        .content(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .schema(schemaRef(model))
            .build())
        .build();
}

/**
 * Return a ResponseObject for an array of models of the same type.
 * @param model Name of the model objects being returned
 */
function responseModels(model: string): ob.ResponseObject {
    return new ob.ResponseObjectBuilder(`The specified ${pluralize(model)}`)
        .content(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .schema(schemaRef(pluralize(model)))
            .build())
        .build();
}

