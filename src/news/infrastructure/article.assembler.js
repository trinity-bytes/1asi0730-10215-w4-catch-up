/**
 * @fileoverview ArticleAssembler — News bounded context infrastructure layer.
 *
 * Responsible for translating raw API article records into {@link Article}
 * domain entities. Supports an optional pre-resolved {@link Source} entity to
 * avoid redundant source assembly when the source is already known.
 *
 * This assembler is compatible with Newsdata.io and NewsAPI.org response formats.
 *
 * @module news/infrastructure/article-assembler
 */

import {Article} from "../domain/model/article.entity.js";
import {SourceAssembler} from "./source.assembler.js";

/**
 * Assembler that converts raw NewsAPI article records into {@link Article}
 * domain entities.
 *
 * The `withSource` builder method enables the caller to supply a pre-resolved
 * {@link Source} entity. When the article's source ID matches the supplied
 * entity's ID, the assembler reuses the existing object instead of
 * re-assembling a new one — avoiding unnecessary work and preserving object
 * identity within a request cycle.
 *
 * All methods are static; the class acts as a stateless (per-call-chain)
 * translation service.
 */
export class ArticleAssembler {
    /**
     * A pre-resolved {@link Source} entity to reuse during assembly.
     * Set via {@link ArticleAssembler.withSource} and cleared between
     * independent call chains.
     *
     * @type {import('../domain/model/source.entity.js').Source|null}
     */
    static source = null;

    /**
     * Sets the pre-resolved {@link Source} entity for the current assembly
     * chain and returns the assembler class for fluent chaining.
     *
     * @param {import('../domain/model/source.entity.js').Source} source
     *   A fully hydrated {@link Source} entity that will be reused when
     *   assembling articles whose `source.id` matches.
     * @returns {typeof ArticleAssembler} The assembler class to allow method chaining.
     * @example
     * const articles = ArticleAssembler
     *   .withSource(currentSource)
     *   .toEntitiesFromResponse(response);
     */
    static withSource(source) {
        this.source = source;
        return this;
    }

    /**
 * Assembles a single {@link Article} entity from a raw API article record.
     *
     * Handles field mapping from different providers (e.g. image_url from Newsdata.io).
     *
     * If a pre-resolved source is set via {@link ArticleAssembler.withSource}
     * and its `id` matches the record's source ID, that entity is reused
     * directly. Otherwise, the source is assembled via
     * {@link SourceAssembler.toEntityFromResource}.
     *
     * @param {object}  resource               - Raw article record from the API response.
     * @param {string}  resource.title          - Article headline.
     * @param {string}  resource.description    - Article summary.
     * @param {string}  resource.url            - Permalink to the full article.
     * @param {string}  [resource.urlToImage]   - URL of the article's cover image (NewsAPI).
     * @param {string}  [resource.image_url]    - URL of the article's cover image (Newsdata.io).
     * @param {string}  [resource.publishedAt]  - ISO 8601 publication datetime (NewsAPI).
     * @param {string}  [resource.pubDate]      - Publication datetime (Newsdata.io).
     * @param {object}  [resource.source]       - Embedded raw source record (NewsAPI).
     * @param {string}  [resource.source_id]    - Source identifier (Newsdata.io).
     * @returns {Article} A fully hydrated {@link Article} entity.
     */
    static toEntityFromResource(resource) {
        // Normalize fields from different providers
        const normalizedResource = {
            ...resource,
            urlToImage: resource.urlToImage || resource.image_url || '',
            publishedAt: resource.publishedAt || resource.pubDate || '',
            source: resource.source || { id: resource.source_id || '' }
        };

        let article = new Article(normalizedResource);
        article.source = this.source && this.source.id === normalizedResource.source.id
            ? this.source : SourceAssembler.toEntityFromResource(normalizedResource.source);
        return article;
    }

    /**
     * Assembles a collection of {@link Article} entities from a full API
     * HTTP response.
     *
     * Returns an empty array — without throwing — when the API reports a
     * failure, and logs the error details for diagnostic purposes.
     *
     * @param {import('axios').AxiosResponse} response - The resolved Axios
     *   response from {@link NewsApi#getArticlesForSourceId}.
     * @param {object}   response.data            - Parsed JSON body of the response.
     * @param {string}   [response.data.status]   - API status flag ("ok", "success" or "error").
     * @param {object[]} [response.data.articles] - Array of raw article records (NewsAPI).
     * @param {object[]} [response.data.results]  - Array of raw article records (Newsdata.io).
     * @returns {Article[]} Array of assembled {@link Article} entities, or an
     *   empty array if the response indicates an error.
     */
    static toEntitiesFromResponse(response) {
        if (response.data.status !== 'ok' && response.data.status !== 'success') {
            console.error(`${response.status}, ${response.data.code || 'ERROR'}, ${response.data.message || 'Request failed'}`);
            return [];
        }
        const articlesResponse = response.data;
        const articles = articlesResponse["articles"] || articlesResponse["results"] || [];
        console.log(response.data);
        return articles.map(article => this.toEntityFromResource(article));
    }
}