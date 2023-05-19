// Specific.ts -----------------------------------------------------------------

/**
 * Common constants and functions for OpenAPI Builder 3.1 generators,
 * specific to this type of project.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders/dist/3.1"
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {
    APPLICATION_JSON,
//    BAD_REQUEST,
//    CREATED,
    ERROR,
//    FORBIDDEN,
//    NOT_FOUND,
//    OK,
    parameterRef,
//    pathItemRef,
    requestBodyRef,
//    responseRef,
    schemaRef,
} from "./Generic";

// Public Constants ==========================================================

// Parameter Names (Pagination) ----------------------------------------------

export const LIMIT = "limit";
export const OFFSET = "offset";

// Tag Names -----------------------------------------------------------------

export const REQUIRE_ADMIN = "requireAdmin";
export const REQUIRE_ANY = "requireAny";
export const REQUIRE_REGULAR = "requireRegular";
export const REQUIRE_SUPERUSER = "requireSuperuser";

// Public Functions ==========================================================

// Operations ----------------------------------------------------------------

/**
 * A GET operation to return an array of model objects.
 *
 * @param model Name of the model whose objects are being returned
 * @param tag Optional tag for this operation
 * @param responses Optional responses object identifying possible responses
 * @param includes Optional include-child query parameters for this operation
 * @param matches Optional match-field query parameters for this operation
 */
export function allOperation(
    model: string,
    tag: string | null,
    responses?: () => ob.ResponsesObject,
    includes?: () => ob.ParametersObject,
    matches?: () => ob.ParametersObject,
): ob.OperationObject
{
    const models = pluralize(model);
    const builder = new ob.OperationObjectBuilder()
        .description(`Return all matching ${models}`)
        .parameters(includes ? includes() : {})
        .parameters(matches ? matches() : {})
        .parameters(paginationParameters())
        .responses(responses ? responses() : {})
        .summary(`The requested ${models}`)
    ;
    if (tag) {
        builder.tag(new ob.TagObjectBuilder(tag).build());
    }
    return builder.build();
}

/**
 * A GET operation to return an array of children of a parent model object.
 *
 * @param parentModel Name of the model whose children are being returned
 * @param childModel Name of the models of the child objects
 * @param tag Optional tag for this operation
 * @param responses Optional responses object identifying possible responses
 * @param includes Optional include-child query parameters for this operation
 * @param matches Optional match-field query parameters for this operation
 * @param responses Optional responses object identifying possible responses
 */
export function childrenOperation(
    parentModel: string,
    childModel: string,
    tag: string | null,
    responses?: () => ob.ResponsesObject,
    includes?: () => ob.ParametersObject,
    matches?: () => ob.ParametersObject,
): ob.OperationObject
{
    const children = pluralize(childModel);
    const builder = new ob.OperationObjectBuilder()
        .description(`Return matching ${children} of this ${parentModel}`)
        .parameters(includes ? includes() : {})
        .parameters(matches ? matches() : {})
        .parameters(paginationParameters())
        .responses(responses ? responses() : {})
        .summary(`The requested ${children}`)
    ;
    if (tag) {
        builder.tag(new ob.TagObjectBuilder(tag).build());
    }
    return builder.build();
}

/**
 * A GET operation to return a specific model object.
 *
 * @param model Name of the model to be returned
 * @param tag Optional tag for this operation
 * @param responses Optional responses object identifying possible responses
 * @param includes Optional include-child parameters for this operation
 */
export function findOperation(
    model: string,
    tag: string | null,
    responses?: () => ob.ResponsesObject,
    includes?: () => ob.ParametersObject,
)
{
    const builder = new ob.OperationObjectBuilder()
       .description(`Return the specified ${model}`)
        .parameters(includes ? includes() : {})
        .responses(responses ? responses() : {})
        .summary(`The specified ${model}`)
    ;
    if (tag) {
        builder.tag(new ob.TagObjectBuilder(tag).build());
    }
    return builder.build();
}

/**
 * A POST operation to create and return a new object.
 *
 * @param model Name of the model to be created and returned
 * @param tag Optional tag for this operation
 * @param responses Optional responses object identifying possible responses
 */
export function insertOperation(
    model: string,
    tag: string | null,
    responses?: () => ob.ResponsesObject,
): ob.OperationObject
{
    const builder = new ob.OperationObjectBuilder()
        .description(`Create and return the specified ${model}`)
        .requestBody(requestBodyRef(model))
        .responses(responses ? responses() : {})
        .summary(`The created ${model}`)
    ;
    if (tag) {
        builder.tag(new ob.TagObjectBuilder(tag).build());
    }
    return builder.build();
}

/**
 * A DELETE operation to remove and return the specified object
 *
 * @param model Name of the model to be deleted and returned
 * @param tag Optional tag for this operation
 * @param responses Optional responses object identifying possible responses
 */
export function removeOperation(
    model: string,
    tag: string | null,
    responses?: () => ob.ResponsesObject,
): ob.OperationObject
{
    const builder = new ob.OperationObjectBuilder()
        .description(`Remove and return the specified ${model}`)
        .responses(responses ? responses() : {})
        .summary(`The removed ${model}`)
    ;
    if (tag) {
        builder.tag(new ob.TagObjectBuilder(tag).build());
    }
    return builder.build();
}

/**
 * A PUT operation to update and return the specified object
 *
 * @param model Name of the model to be updated and returned
 * @param tag Optional tag for this operation
 * @param responses Optional responses object identifying possible responses
 */
export function updateOperation(
    model: string,
    tag: string | null,
    responses?: () => ob.ResponsesObject,
): ob.OperationObject
{
    const builder = new ob.OperationObjectBuilder()
        .description(`Update and return the specified ${model}`)
        .requestBody(requestBodyRef(model))
        .responses(responses ? responses() : {})
        .summary(`The updated ${model}`)
    ;
    if (tag) {
        builder.tag(new ob.TagObjectBuilder(tag).build());
    }
    return builder.build();
}

// Path Items ----------------------------------------------------------------

/**
 * A path item for a child object collection endpoint.
 *
 * @param childModel Name of the model for the child objects
 * @param parentId Name of the parent ID path parameter
 * @param all Optional "all" OperationObject for retrieving the child collection
 * @param insert Optional "insert" OperationObject for inserting a new child
 */
export function childCollectionPathItem(
    childModel: string,
    parentId: string,
    all?: () => ob.OperationObject,
    insert?: () => ob.OperationObject,
): ob.PathItemObject
{
    const builder = new ob.PathItemObjectBuilder()
        .parameter(parameterRef(parentId));
    if (all) {
        builder.get(all());
    }
    if (insert) {
        builder.post(insert());
    }
    return builder.build();
}

/**
 * A path item for a child object detail endpoint
 *
 * @param childModel Name of the model for the child object
 * @param childId Name of the child ID path parameter
 * @param parentId Name of the parent ID path parameter
 * @param find Optional "find" OperationObject for finding the specified child
 * @param remove Optional "remove" OperationObject for removing the specified child
 * @param update Optional "update" OperationObject for updating the specified child
 */
export function childDetailPathItem(
    childModel: string,
    childId: string,
    parentId: string,
    find?: () => ob.OperationObject,
    remove?: () => ob.OperationObject,
    update?: () => ob.OperationObject,
): ob.PathItemObject
{
    const builder = new ob.PathItemObjectBuilder()
        .parameter(parameterRef(parentId))
        .parameter(parameterRef(childId));
    if (find) {
        builder.get(find());
    }
    if (remove) {
        builder.delete(remove());
    }
    if (update) {
        builder.put(update());
    }
    return builder.build();
}

/**
 * A path item for a parent object children endpoint
 *
 * @param parentId Name of the parent ID path parameter
 * @param children "all" OperationObject for finding children of this parent
 */
export function parentChildrenPathItem(
    parentId: string,
    children: () => ob.OperationObject,
): ob.PathItemObject
{
    const builder = new ob.PathItemObjectBuilder()
        .parameter(parameterRef(parentId))
        .get(children());
    return builder.build();
}

/**
 * A path item for a parent object collection
 *
 * @param model Name of the parent model
 * @param all Optional "all" OperationObject for finding parent objects
 * @param insert Optional "insert" OperationObject for creating parent objects
 */
export function parentCollectionPathItem(
    model: string,
    all?: () => ob.OperationObject,
    insert?: () => ob.OperationObject,
): ob.PathItemObject
{
    const builder = new ob.PathItemObjectBuilder();
    if (all) {
        builder.get(all());
    }
    if (insert) {
        builder.post(insert());
    }
    return builder.build();
}

/**
 * A path item for a parent object detail
 *
 * @param model Name of the parent model
 * @param modelId Name of the parent object ID path parameter
 * @param find Optional "find" OperationObject for finding the parent object
 * @param remove Optional "remove" OperationObject for removing the parent object
 * @param update Optional "update" OperationObject for updating the parent object
 */
export function parentDetailPathItem(
    model: string,
    modelId: string,
    find?: () => ob.OperationObject,
    remove?: () => ob.OperationObject,
    update?: () => ob.OperationObject,
): ob.PathItemObject
{
    const builder = new ob.PathItemObjectBuilder()
        .parameter(parameterRef(modelId));
    if (find) {
        builder.get(find());
    }
    if (remove) {
        builder.delete(remove());
    }
    if (update) {
        builder.put(update());
    }
    return builder.build();
}

// Path Parameters -----------------------------------------------------------

/**
 * Return a path parameter string for the specified `modelId`.
 */
export function pathParameter(modelId: string): string {
    return "{" + modelId + "}";
}

// Property Schemas ----------------------------------------------------------

/**
 * Property schema for the `active` property of the specified model.
 */
export function activeProperty(model: string): ob.SchemaPropertyObject {
    const property = new ob.SchemaPropertyObjectBuilder("boolean")
        .description(`Is this ${model} active?`)
        //TODO .nullable(true)
        .build();
    return property;
}

/**
 * Property schema for the `id` property of the specified model.
 * Technically nullable because not required on inserts.
 */
export function idProperty(model: string): ob.SchemaPropertyObject {
    const property = new ob.SchemaPropertyObjectBuilder("integer")
        .description(`Primary key of this ${model}`)
        //TODO .nullable(true)
        .build();
    return property;
}

/**
 * Property schema for the `libraryId` property of the specified model.
 */
export function libraryIdProperty(model: string): ob.SchemaPropertyObject {
    const property = new ob.SchemaPropertyObjectBuilder("integer")
        .description(`Primary key of the Library that owns this ${model}`)
        //TODO .nullable(false)
        .build();
    return property;
}

/**
 * Property schema for the `name` property of the specified model.
 */
export function nameProperty(model: string): ob.SchemaPropertyObject {
    const property = new ob.SchemaPropertyObjectBuilder("string")
        .description(`Canonical name of this ${model}`)
        // TODO .nullable(false)
        .build();
    return property;
}

/**
 * Property schema for the `notes` property of the specified model.
 */
export function notesProperty(model: string): ob.SchemaPropertyObject {
    const property = new ob.SchemaPropertyObjectBuilder("string")
        .description(`General notes about this ${model}`)
        //TODO .nullable(true)
        .build();
    return property;
}

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
