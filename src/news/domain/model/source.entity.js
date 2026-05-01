/**
 * @fileoverview Source domain entity belonging to the News bounded context.
 * @module news/domain/model/source
 */

/**
 * Represents a news source as a domain entity.
 *
 * A `Source` encapsulates the identity and descriptive attributes of a
 * publisher registered by the current news provider. It is the aggregate root
 * for source-related data within the News bounded context.
 */
export class Source {
    /**
     * Creates a new `Source` entity from a plain object of attributes.
     *
     * @param {object}  params              - Source attributes.
     * @param {string}  [params.id='']          - Unique identifier assigned by the news provider.
     * @param {string}  [params.name='']         - Human-readable display name of the source.
     * @param {string}  [params.description='']  - Brief description of the source's editorial focus.
     * @param {string}  [params.url='']          - Canonical homepage URL of the source.
     */
    constructor({id = '', name = '', description = '', url = ''}) {
        /** @type {string} Unique identifier assigned by the news provider. */
        this.id = id;
        /** @type {string} Human-readable display name of the source. */
        this.name = name;
        /** @type {string} Brief description of the source's editorial focus. */
        this.description = description;
        /** @type {string} Canonical homepage URL of the source. */
        this.url = url;
        /**
         * Resolved logo image URL provided by the Logo.dev API.
         * Populated by the infrastructure layer after entity construction.
         * @type {string}
         */
        this.urlToLogo = '';
    }

    /**
     * Serializes the source into a plain object.
     *
     * @returns {object} A plain representation of the source entity.
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            url: this.url,
            urlToLogo: this.urlToLogo
        };
    }
}