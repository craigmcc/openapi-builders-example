// Library.ts ----------------------------------------------------------------

/**
 * OpenAPI generators for a Library model object.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders/dist/3.1";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import Model from "../Model";
import {
    allOperation,
    findOperation,
    insertOperation,
    parentCollectionPathItem,
    parentDetailPathItem,
    pathParameter,
    removeOperation,
    updateOperation,
} from "../Specific";
import {
    activeProperty, idProperty, nameProperty, notesProperty,
    ACTIVE, API_PREFIX, ID, LIBRARY, LIBRARY_ID,
    MATCH_ACTIVE, MATCH_NAME, MATCH_SCOPE, NAME, NOTES,
    REQUIRE_ADMIN, REQUIRE_ANY, REQUIRE_REGULAR, REQUIRE_SUPERUSER,
    SCOPE, WITH_AUTHORS, WITH_SERIES, WITH_STORIES, WITH_VOLUMES,
} from "../Unique";
import {parameterRef, schemaRef} from "../Generic";

// Public Objects ------------------------------------------------------------

class Library extends Model {

    constructor() {
        super(LIBRARY);
    }

    // Operations -----------------------------------------------------------

    public all(): ob.OperationObject[] {
        const results: ob.OperationObject[] = [];
        results.push(allOperation(LIBRARY, REQUIRE_ANY, this.includes, this.matches));
        return results;
    }

    // TODO - authors stuff

    public find(): ob.OperationObject[] {
        const results: ob.OperationObject[] = [];
        results.push(findOperation(LIBRARY, REQUIRE_REGULAR, this.includes));
        return results;
    }

    public insert(): ob.OperationObject[] {
        const results: ob.OperationObject[] = [];
        results.push(insertOperation(LIBRARY, REQUIRE_SUPERUSER));
        return results;
    }

    public remove(): ob.OperationObject[] {
        const results: ob.OperationObject[] = [];
        results.push(removeOperation(LIBRARY, REQUIRE_SUPERUSER));
        return results;
    }

    // TODO - series stuff

    // TODO - stories stuff

    public update(): ob.OperationObject[] {
        const results: ob.OperationObject[] = [];
        results.push(updateOperation(LIBRARY, REQUIRE_ADMIN));
        return results;
    }

    // TODO - volumes stuff

    // Parameters ------------------------------------------------------------

    public includes(): ob.ParametersObject {
        return new ob.ParametersObjectBuilder()
            .parameter(WITH_AUTHORS, parameterRef(WITH_AUTHORS))
            .parameter(WITH_SERIES, parameterRef(WITH_SERIES))
            .parameter(WITH_STORIES, parameterRef(WITH_STORIES))
            .parameter(WITH_VOLUMES, parameterRef(WITH_VOLUMES))
            .build();
    }

    public matches(): ob.ParametersObject {
        return new ob.ParametersObjectBuilder()
            .parameter(MATCH_ACTIVE, parameterRef(MATCH_ACTIVE))
            .parameter(MATCH_NAME, parameterRef(MATCH_NAME))
            .parameter(MATCH_SCOPE, parameterRef(MATCH_SCOPE))
            .build();
    }

    // Paths -----------------------------------------------------------------

    public paths(): ob.PathsObject {
        const pluralized = pluralize(LIBRARY.toLowerCase());
        return new ob.PathsObjectBuilder()
            .pathItem(
                `${API_PREFIX}/${pluralized}`,
                parentCollectionPathItem(LIBRARY, this.all, this.insert)
            )
            .pathItem(
                `${API_PREFIX}/${pluralized}/${pathParameter(LIBRARY_ID)}`,
                parentDetailPathItem(LIBRARY,  LIBRARY_ID, this.find, this.remove, this.update)
            )
            // TODO - authors stuff
            // TODO - series stuff
            // TODO - stories stuff
            // TODO - volumes stuff
            .build();
    }

    // Schemas ---------------------------------------------------------------

    public schema(): ob.SchemaObject {
        return new ob.SchemaObjectBuilder("object")
            .property(ID, idProperty(LIBRARY))
            .property(ACTIVE, activeProperty(LIBRARY))
            .property(NAME, nameProperty(LIBRARY))
            .property(NOTES, notesProperty(LIBRARY))
            .property(SCOPE, new ob.SchemaPropertyObjectBuilder("string")
                .description("Scope prefix for 'require' permissions")
                .build())
            .requireds([ NAME, SCOPE ])
            .build();
    }

    public schemas(): ob.SchemaObject {
        return new ob.SchemaObjectBuilder("array")
            .items(schemaRef(LIBRARY))
            .build();
    }

}

const instance = new Library();
export default instance;
