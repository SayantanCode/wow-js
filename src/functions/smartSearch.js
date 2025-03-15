import Redis from "ioredis";
import consoleColor from "../logger/consoleColor.js";

export const smartSearch = (function () {
  let redisClient = null;

  /**
   * Initializes the Redis client with a given configuration object.
   * If the configuration object is not given, Redis caching is disabled.
   * @param {object} redisConfig - The configuration object for Redis.
   * @returns {void}
   */
  const initializeRedis = (redisConfig) => {
    if (redisConfig) {
      try {
        redisClient = new Redis(redisConfig);
        console.log("✅ Redis Connected!");
      } catch (error) {
        console.warn(
          consoleColor(
            "⚠️ Redis connection failed. Running without caching.",
            "yellow"
          )
        );
        redisClient = null;
      }
    }
  };

  /**
   * Normalizes a query object's keys from bracket notation to dot notation.
   * This allows for easier access to nested properties in the query object.
   * @param {object} query - The query object to normalize.
   * @returns {object} - The normalized query object.
   * @example
   * const query = { 'profile[address][city]': 'New York' };
   * const normalizedQuery = normalizeQueryKeys(query);
   * console.log(normalizedQuery); // { 'profile.address.city': 'New York' }
   */
  const normalizeQueryKeys = (query) => {
    return Object.keys(query).reduce((acc, key) => {
      const normalizedKey = key.replace(/\[([^\]]+)\]/g, ".$1"); // Convert `profile[address][city]` to `profile.address.city`
      acc[normalizedKey] = query[key];
      return acc;
    }, {});
  };

  /**
   * Retrieves a value from a nested object using a dot notation path.
   *
   * @param {object} obj - The object to retrieve the value from.
   * @param {string} path - The dot notation path to the value.
   * @returns {*} - The value at the given path, or undefined if not found.
   * @example
   * const obj = { profile: { address: { city: 'New York' } } };
   * const value = getDeepValue(obj, 'profile.address.city');
   * console.log(value); // New York
   */
  const getDeepValue = (obj, path) => {
    return path
      .split(".")
      .reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
        obj
      );
  };

  /**
   * Calculates the Levenshtein distance between two strings.
   * The Levenshtein distance is a measure of the number of single-character
   * edits (insertions, deletions, or substitutions) required to change one
   * string into the other.
   *
   * @param {string} a - The first string.
   * @param {string} b - The second string.
   * @returns {number} - The Levenshtein distance between the two strings.
   */

  const levenshteinDistance = (a, b) => {
    const m = a.length,
      n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }
    return dp[m][n];
  };

  /**
   * Checks if the given item matches the query.
   * Supports nested queries with $and and $or operators.
   * Supports various operators: $eq, $gt, $gte, $lt, $lte, $in, $regex.
   * If fuzzySearch is enabled in options, it will perform a fuzzy search with
   * a levenshtein distance of up to 2.
   * If caseSensitive is disabled in options, it will perform a case-insensitive
   * search.
   * @param {Object} item
   * @param {Object} query
   * @param {Object} [options]
   * @returns {boolean}
   */
  const matchesQuery = (item, query, options) => {
    if (query.$and) {
      return query.$and.every((subQuery) =>
        matchesQuery(item, subQuery, options)
      );
    }
    if (query.$or) {
      return query.$or.some((subQuery) =>
        matchesQuery(item, subQuery, options)
      );
    }
    
    return Object.keys(query).every((key) => {
      const condition = query[key];
      const value = getDeepValue(item, key); // This is required to find nested values in the item. value = item[key]

      if (value === undefined) return false;

      if (typeof condition === "object") {
        if ("$eq" in condition) return value === condition["$eq"];
        if ("$gt" in condition) return value > condition["$gt"];
        if ("$gte" in condition) return value >= condition["$gte"];
        if ("$lt" in condition) return value < condition["$lt"];
        if ("$lte" in condition) return value <= condition["$lte"];
        if ("$in" in condition) {
            if (Array.isArray(value) && Array.isArray(condition["$in"])) {
                return condition["$in"].every(element => value.includes(element));
            }
            return false; // Return false if value or condition is not an array
        }
        if ("$regex" in condition) {
          const regex = new RegExp(
            condition["$regex"],
            options.caseSensitive ? "" : "i"
          );
          return regex.test(value);
        }
      } else {
        if (options.fuzzySearch && options.substringSearch) {
            const fuzzyThreshold = options.fuzzyThreshold !== undefined ? options.fuzzyThreshold : 2;
            if (typeof value === 'string' && typeof condition === 'string') {
                const fuzzyMatch = levenshteinDistance(value.toString().toLowerCase(), condition.toString().toLowerCase()) <= fuzzyThreshold;
                const substringMatch = value.toLowerCase().includes(condition.toLowerCase());
                return fuzzyMatch || substringMatch; // Return true if either fuzzy or substring matches
            } else {
                return options.caseSensitive ? value === condition : value.toString().toLowerCase() === condition.toString().toLowerCase();
            }

        } else if (options.fuzzySearch) {
            const fuzzyThreshold = options.fuzzyThreshold !== undefined ? options.fuzzyThreshold : 2;
            if (typeof value === 'string' && typeof condition === 'string') {
                return levenshteinDistance(value.toString().toLowerCase(), condition.toString().toLowerCase()) <= fuzzyThreshold;
            } else {
                return options.caseSensitive ? value === condition : value.toString().toLowerCase() === condition.toString().toLowerCase();
            }

        } else if (options.substringSearch && typeof value === 'string' && typeof condition === 'string') {
            return value.toLowerCase().includes(condition.toLowerCase());
        }

        return options.caseSensitive ? value === condition : value.toString().toLowerCase() === condition.toString().toLowerCase();
    }
    });
  };

  /**
   * Searches an array of objects using a query object and returns the matching
   * items. Supports sorting and pagination.
   *
   * @param {Array} arr - The array of objects to search.
   * @param {Object} query - The query object. Supports the following operators:
   *   - $and: Matches all objects that match all the subqueries.
   *   - $or: Matches all objects that match any of the subqueries.
   *   - $eq: Matches the exact value.
   *   - $gt: Matches values greater than the given value.
   *   - $gte: Matches values greater than or equal to the given value.
   *   - $lt: Matches values less than the given value.
   *   - $lte: Matches values less than or equal to the given value.
   *   - $in: Matches any value in the given array.
   *   - $regex: Matches using the given regex pattern (case sensitive by default).
   * @param {Object} [options] - Optional settings.
   * @param {boolean} [options.caseSensitive=false] - Whether to perform case sensitive
   *   matching.
   * @param {boolean} [options.fuzzySearch=false] - Whether to perform fuzzy matching.
   * @param {boolean} [options.sort=false] - Whether to sort the results.
   * @param {string} [options.sortBy] - The key to sort by.
   * @param {string} [options.order="asc"] - The order to sort in (asc or desc).
   * @param {number} [options.limit=null] - The number of results to return per page.
   * @param {number} [options.page=1] - The page number to return.
   * @return {Array} The matching items.
   */
  const searchArray = (arr, query, options) => {
    if (!Array.isArray(arr)) return [];
    // Filter the array based on the query
    let results = arr.map((item) => ({
      item,
      score: matchesQuery(item, query, options) ? 1 : 0, // Score is 1 if the item matches the query, 0 otherwise
    })).filter((r) => r.score > 0);;

    // Keep best matches on top if sorting is disabled
    if (options.sort && options.sortBy) {
      results.sort((a, b) => {
        let valA = getDeepValue(a.item, options.sortBy);
        let valB = getDeepValue(b.item, options.sortBy);
        return options.order === "asc" ? valA - valB : valB - valA;
      });
    }else if (!options.sort && options.sortBy) {
        console.log(consoleColor(`⚠️ ${" "} Sorting is disabled. Ignoring sortBy option.`, "yellow"));
    }else if (options.sort && !options.sortBy) {
        console.log(consoleColor(`⚠️ ${" "} Sorting is enabled but sortBy option is missing.`, "yellow"));
    }

    let finalResults = results.map((r) => r.item);

    if (options.limit !== null) {
      const start = (options.page - 1) * options.limit;
      finalResults = finalResults.slice(start, start + options.limit);
    }

    return finalResults;
  };

  /**
   * Caches the search results in Redis for 5 minutes.
   *
   * @param {string} cacheKey - The key to cache under.
   * @param {Array} results - The search results to cache.
   */
  const cacheResults = (cacheKey, results) => {
    if (redisClient) {
      redisClient
        .set(cacheKey, JSON.stringify(results), "EX", 60 * 5)
        .catch(() => {
          console.warn("⚠️ Redis caching failed.");
        });
    }
  };
  // Return the smartSearch function
  // Documentation:
  // smartSearch(data, query, options = {}, redisConfig = null)
    // data: The data to search. Can be an array or an object.
    // query: The query object. Supports the following operators:
    //   - $and: Matches all objects that match all the subqueries.
    //   - $or: Matches all objects that match any of the subqueries.
    //   - $eq: Matches the exact value.
    //   - $gt: Matches values greater than the given value.
    //   - $gte: Matches values greater than or equal to the given value.
    //   - $lt: Matches values less than the given value.
    //   - $lte: Matches values less than or equal to the given value.
    //   - $in: Matches any value in the given array.
    //   - $regex: Matches using the given regex pattern (case sensitive by default).
    // options: Optional settings.
    //   - caseSensitive: Whether to perform case sensitive matching.
    //   - fuzzySearch: Whether to perform fuzzy matching.
    //   - limit: The number of results to return per page.
    //   - page: The page number to return.
    //   - sort: Whether to sort the results.
    //   - sortBy: The key to sort by.
    //   - order: The order to sort in (asc or desc).
    // redisConfig: The configuration object for Redis.
  //examples
    // const users = [
    //   { name: "Charlie", age: 35 },
    //   { name: "Alice", age: 25 },
    //   { name: "Bob", age: 29 },
    // ];
    // const query = { age: { $gt: 20}, age: { $lt: 30 } };
    // const options = {fuzzySearch: false};
    // const results = smartSearch(users, query, options);
  return function (data, query, options = {}, redisConfig = null) {
    options = Object.assign(
      {
        deepSearch: true,
        caseSensitive: false,
        substringSearch: true,
        fuzzySearch: true,
        fuzzyThreshold: 2,
        cacheEnabled: true,
        limit: null,
        page: 1,
        sort: false,
        sortBy: null,
        order: "asc",
      },
      options
    );

    query = normalizeQueryKeys(query);

    if (options.cacheEnabled && redisClient === null) {
      if (redisConfig) {
        initializeRedis(redisConfig);
      } else {
        console.warn(
          consoleColor(
            `⚠️ ${" "}Redis config not provided. Running without caching.`,
            "yellow"
          )
        );
      }
    }

    const cacheKey = JSON.stringify({ query, options });

    if (options.cacheEnabled && redisClient) {
      redisClient
        .get(cacheKey)
        .then((cachedData) => {
          if (cachedData) {
            return JSON.parse(cachedData);
          }
        })
        .catch(() => {
          console.warn("⚠️ Redis retrieval failed. Running without caching.");
        });
    }

    let results;
    if (Array.isArray(data)) {
      results = searchArray(data, query, options);
    } else if (typeof data === "object" && data !== null) {
      let collectedResults = [];
      for (let key in data) {
        if (Array.isArray(data[key])) {
          collectedResults.push(...searchArray(data[key], query, options));
        }
      }
      results = collectedResults;
    } else {
      results = [];
    }

    if (options.cacheEnabled && redisClient) {
      cacheResults(cacheKey, results);
    }

    return results;
  };
})();
