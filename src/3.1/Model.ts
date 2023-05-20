// Model.ts ------------------------------------------------------------------

/**
 * An amalgamation of OpenAPI object generation helpers for all the objects
 * related to a particular "model" object.  This is part of the "specific
 * to this type of project" assumption in `Specific.ts`.
 *
 * Additional methods (such as operations) for specific model types can be
 * added to an implementation class.  However, the design of the corresponding
 * required methods should be respected.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders/dist/3.1";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export default abstract class Model {

    constructor(name: string) {
        this.name = name;
    }

    public readonly name: string;

    // Operations ------------------------------------------------------------

    /**
     * IMPLEMENTATION NOTE:  If a particular type of OperationObject is not
     * supported for a particular model object type, return a
     * zero-length array.
     */

    /**
     * Return an array of OperationObjects representing a GET request for
     * an array of matching instances of this model.
     */
    public abstract all(): ob.OperationObject[];

    /**
     * Return an array of OperationObjects representing a GET request for
     * a specific instance of this model.
     */
    public abstract find(): ob.OperationObject[];

    /**
     * Return an array of OperationObjects representing a POST request
     * to insert a specific instance of this model.
     */
    public abstract insert(): ob.OperationObject[];

    /**
     * Return an array of OperationObjects representing a DELETE request
     * to remove a specific instance of this model.
     */
    public abstract remove(): ob.OperationObject[];

    /**
     * Return an array OperationObjects representing a PUT request
     * to update a specific instance of this model.
     */
    public abstract update(): ob.OperationObject;

    // Parameters ------------------------------------------------------------

    /**
     * Return a ParametersObject representing query parameters defining child
     * objects to be included in the returned object representation.
     */
    public abstract includes(): ob.ParametersObject;

    /**
     * Return a ParametersObject representing query parameters defining match
     * criteria when selecting particular instances of this model.
     */
    public abstract matches(): ob.ParametersObject;

    // Paths -----------------------------------------------------------------

    /**
     * Return a PathsObject containing a set of mappings of a path specifier
     * to a PathItem that describes the configuration of that path.
     */
    public abstract paths(): ob.PathsObject;

    // Schemas ---------------------------------------------------------------

    /**
     * Return a SchemaObject representing an individual instance of this model.
     */
    public abstract schema(): ob.SchemaObject;

    /**
     * Return a SchemaObject representing an array of individual instances
     * of this model.
     */
    public abstract schemas(): ob.SchemaObject;

}
