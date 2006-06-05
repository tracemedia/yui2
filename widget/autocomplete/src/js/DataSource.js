/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Class providing encapsulation of a data source. 
 *  
 * @constructor
 *
 */
YAHOO.widget.DataSource = function() { 
    /* abstract class */
};


/***************************************************************************
 * Public constants
 ***************************************************************************/
/**
 * Error message for null data responses.
 *
 * @type constant
 * @final
 */
YAHOO.widget.DataSource.prototype.ERROR_DATANULL = "Response data was null";

/**
 * Error message for data responses with parsing errors.
 *
 * @type constant
 * @final
 */
YAHOO.widget.DataSource.prototype.ERROR_DATAPARSE = "Response data could not be parsed";


/***************************************************************************
 * Public member variables
 ***************************************************************************/
/**
 * Max size of the local cache.  Set to 0 to turn off caching.  Caching is
 * useful to reduce the number of server connections.  Recommended only for data
 * sources that return comprehensive results for queries or when stale data is
 * not an issue. Default: 15.
 *
 * @type number
 */
YAHOO.widget.DataSource.prototype.maxCacheEntries = 15;

/**
 * Use this to equate cache matching with the type of matching done by your live
 * data source. If caching is on and queryMatchContains is true, the cache
 * returns results that "contain" the query string. By default,
 * queryMatchContains is set to false, meaning the cache only returns results
 * that "start with" the query string. Default: false.
 *
 * @type boolean
 */
YAHOO.widget.DataSource.prototype.queryMatchContains = false;

/**
 * Data source query subset matching. If caching is on and queryMatchSubset is
 * true, substrings of queries will return matching cached results. For
 * instance, if the first query is for "abc" susequent queries that start with
 * "abc", like "abcd", will be queried against the cache, and not the live data
 * source. Recommended only for data sources that return comprehensive results
 * for queries with very few characters. Default: false.
 *
 * @type boolean
 */
YAHOO.widget.DataSource.prototype.queryMatchSubset = false;

/**
 * Data source query case-sensitivity matching. If caching is on and
 * queryMatchCase is true, queries will only return results for case-sensitive
 * matches. Default: false.
 *
 * @type boolean
 */
YAHOO.widget.DataSource.prototype.queryMatchCase = false;


/***************************************************************************
 * Public methods
 ***************************************************************************/
/**
 * Retrieves query results, first checking the local cache, then making the
 * query request to the live data source as defined by the function doQuery.
 *
 * @param {object} oCallbackFn Callback function defined by oParent object to
 *                             which to return results 
 * @param {string} sQuery Query string
 * @param {object} oParent The object instance that has requested data
 */
YAHOO.widget.DataSource.prototype.getResults = function(oCallbackFn, sQuery, oParent) {
    
    // First look in cache
    var aResults = this._doQueryCache(oCallbackFn,sQuery,oParent);
    
    // Not in cache, so get results from server
    if(aResults.length === 0) {
        this.queryEvent.fire(this, oParent, sQuery);
        //YAHOO.log("Data source for " + oParent.getName() + " made source query for '" + sQuery + "'.");
        this.doQuery(oCallbackFn, sQuery, oParent);
    }
};

/**
 * Abstract method implemented by subclasses to make a query to the live data
 * source. Must call the callback function with the response returned from the
 * query. Populates cache (if enabled).
 *
 * @param {object} oCallbackFn Callback function implemented by oParent to
 *                             which to return results 
 * @param {string} sQuery Query string
 * @param {object} oParent The object instance that has requested data
 */
YAHOO.widget.DataSource.prototype.doQuery = function(oCallbackFn, sQuery, oParent) {
    /* override this */ 
};

/**
 * Flushes cache.
 */
YAHOO.widget.DataSource.prototype.flushCache = function() {
    if(this._aCache) {
        this._aCache = [];
    }
    if(this._aCacheHelper) {
        this._aCacheHelper = [];
    }
    this.cacheFlushEvent.fire(this);
    //YAHOO.log("Cache flushed");
};

/***************************************************************************
 * Events
 ***************************************************************************/
/**
 * Fired when a query is made to the live data source. Subscribers receive the
 * following array:<br>
 *     - args[0] The data source instance
 *     - args[1] The requesting object
 *     - args[2] The query string
 */
YAHOO.widget.DataSource.prototype.queryEvent = null;

/**
 * Fired when a query is made to the local cache. Subscribers receive the
 * following array:<br>
 *     - args[0] The data source instance
 *     - args[1] The requesting object
 *     - args[2] The query string
 */
YAHOO.widget.DataSource.prototype.cacheQueryEvent = null;

/**
 * Fired when data is retrieved from the live data source. Subscribers receive
 * the following array:<br>
 *     - args[0] The data source instance
 *     - args[1] The requesting object
 *     - args[2] The query string
 *     - args[3] Array of result objects
 */
YAHOO.widget.DataSource.prototype.getResultsEvent = null;
    
/**
 * Fired when data is retrieved from the local cache. Subscribers receive the
 * following array :<br>
 *     - args[0] The data source instance
 *     - args[1] The requesting object
 *     - args[2] The query string
 *     - args[3] Array of result objects
 */
YAHOO.widget.DataSource.prototype.getCachedResultsEvent = null;

/**
 * Fired when an error is encountered with the live data source. Subscribers
 * receive the following array:<br>
 *     - args[0] The data source instance
 *     - args[1] The requesting object
 *     - args[2] The query string
 *     - args[3] Error message string
 */
YAHOO.widget.DataSource.prototype.dataErrorEvent = null;

/**
 * Fired when the local cache is flushed. Subscribers receive the following
 * array :<br>
 *     - args[0] The data source instance
 */
YAHOO.widget.DataSource.prototype.cacheFlushEvent = null;

/***************************************************************************
 * Private member variables
 ***************************************************************************/
/**
 * Local cache of data result objects indexed chronologically.
 *
 * @type array
 * @private
 */
YAHOO.widget.DataSource.prototype._aCache = null;


/***************************************************************************
 * Private methods
 ***************************************************************************/
/**
 * Initializes data source instance.
 *  
 * @private
 */
YAHOO.widget.DataSource.prototype._init = function() {
    // Validate and initialize public configs
    var maxCacheEntries = this.maxCacheEntries;
    if(isNaN(maxCacheEntries) || (maxCacheEntries < 0)) {
        maxCacheEntries = 0;
    }
    // Initialize local cache
    if(maxCacheEntries > 0 && !this._aCache) {
        this._aCache = [];
    }
    
    this.queryEvent = new YAHOO.util.CustomEvent("query", this);
    this.cacheQueryEvent = new YAHOO.util.CustomEvent("cacheQuery", this);
    this.getResultsEvent = new YAHOO.util.CustomEvent("getResults", this);
    this.getCachedResultsEvent = new YAHOO.util.CustomEvent("getCachedResults", this);
    this.dataErrorEvent = new YAHOO.util.CustomEvent("dataError", this);
    this.cacheFlushEvent = new YAHOO.util.CustomEvent("cacheFlush", this);
};

/**
 * Adds a result object to the local cache, evicting the oldest element if the 
 * cache is full. Newer items will have higher indexes, the oldest item will have
 * index of 0. 
 *
 * @param {object} resultObj  Object literal of data results, including internal
 *                            properties and an array of result objects
 * @private
 */
YAHOO.widget.DataSource.prototype._addCacheElem = function(resultObj) {
    var aCache = this._aCache;
    // Don't add if anything important is missing.
    if(!aCache || !resultObj || !resultObj.query || !resultObj.results) {
        return;
    }
    
    // If the cache is full, make room by removing from index=0
    if(aCache.length >= this.maxCacheEntries) {
        aCache.shift();
    }
        
    // Add to cache, at the end of the array
    aCache.push(resultObj);
};

/**
 * Queries the local cache for results. If query has been cached, the callback
 * function is called with the results, and the cached is refreshed so that it
 * is now the newest element.  
 *
 * @param {object} oCallbackFn Callback function defined by oParent object to 
 *                             which to return results 
 * @param {string} sQuery Query string
 * @param {object} oParent The object instance that has requested data
 * @return {array} aResults Result object from local cache if found, otherwise 
 *                          null
 * @private 
 */
YAHOO.widget.DataSource.prototype._doQueryCache = function(oCallbackFn, sQuery, oParent) {
    var aResults = [];
    var bMatchFound = false;
    var aCache = this._aCache;
    var nCacheLength = (aCache) ? aCache.length : 0;
    var bMatchContains = this.queryMatchContains;
    
    // If cache is enabled...
    if((this.maxCacheEntries > 0) && aCache && (nCacheLength > 0)) {
        this.cacheQueryEvent.fire(this, oParent, sQuery);
        //YAHOO.log("Data source for " + oParent.getName() + " made cache query for '" + sQuery + "'.");
        // If case is unimportant, normalize query now instead of in loops
        if(!this.queryMatchCase) {
            var sOrigQuery = sQuery;
            sQuery = sQuery.toLowerCase();
        }

        // Loop through each cached element's query property...
        for(var i = nCacheLength-1; i >= 0; i--) {
            var resultObj = aCache[i];
            var aAllResultItems = resultObj.results;
            // If case is unimportant, normalize match key for comparison
            var matchKey = (!this.queryMatchCase) ?
                encodeURIComponent(resultObj.query.toLowerCase()):
                encodeURIComponent(resultObj.query);
            
            // If a cached match key exactly matches the query...
            if(matchKey == sQuery) {
                    // Stash all result objects into aResult[] and stop looping through the cache.
                    bMatchFound = true;
                    aResults = aAllResultItems;
                    
                    // The matching cache element was not the most recent,
                    // so now we need to refresh the cache.
                    if(i != nCacheLength-1) {                        
                        // Remove element from its original location
                        aCache.splice(i,1);
                        // Add element as newest
                        this._addCacheElem(resultObj);
                    }
                    break;
            }
            // Else if this query is not an exact match and subset matching is enabled...
            else if(this.queryMatchSubset) {
                // Loop through substrings of each cached element's query property...
                for(var j = sQuery.length-1; j >= 0 ; j--) {
                    var subQuery = sQuery.substr(0,j);
                    
                    // If a substring of a cached sQuery exactly matches the query...
                    if(matchKey == subQuery) {                    
                        bMatchFound = true;
                        
                        // Go through each cached result object to match against the query...
                        for(var k = aAllResultItems.length-1; k >= 0; k--) {
                            var aRecord = aAllResultItems[k];
                            var sKeyIndex = (this.queryMatchCase) ?
                                encodeURIComponent(aRecord[0]).indexOf(sQuery):
                                encodeURIComponent(aRecord[0]).toLowerCase().indexOf(sQuery);
                            
                            // A STARTSWITH match is when the query is found at the beginning of the key string...
                            if((!bMatchContains && (sKeyIndex === 0)) ||
                            // A CONTAINS match is when the query is found anywhere within the key string...
                            (bMatchContains && (sKeyIndex > -1))) {
                                // Stash a match into aResults[].
                                aResults.unshift(aRecord);
                            }
                        }
                        
                        // Add the subset match result set object as the newest element to cache,
                        // and stop looping through the cache.
                        resultObj = {};
                        resultObj.query = sQuery;
                        resultObj.results = aResults;
                        this._addCacheElem(resultObj);
                        break;
                    }
                }
                if(bMatchFound) {
                    break;
                }
            }
        }
        
        // If there was a match, send along the results.
        if(bMatchFound) {
            this.getCachedResultsEvent.fire(this, oParent, sOrigQuery, aResults);
            //YAHOO.log("Data source for " + oParent.getName() + " got " + aResults.length + " results from cache.");
            oCallbackFn(sOrigQuery, aResults, oParent);
        }
    }
    return aResults;
};


/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Implementation of YAHOO.widget.DataSource using XML HTTP requests that return
 * query results.
 * requires YAHOO.util.Connect XMLHTTPRequest library
 * extends YAHOO.widget.DataSource
 *  
 * @constructor
 * @param {string} sScriptURI Absolute or relative URI to script that returns 
 *                            query results as JSON, XML, or delimited flat data
 * @param {array} aSchema Data schema definition of results
 * @param {object} oConfigs Optional object literal of config params
 */
YAHOO.widget.DS_XHR = function(sScriptURI, aSchema, oConfigs) {
    // Set any config params passed in to override defaults
    if(typeof oConfigs == "object") {
        for(var sConfig in oConfigs) {
            this[sConfig] = oConfigs[sConfig];
        }
    }
    
    // Initialization sequence
    if(!aSchema || (aSchema.constructor != Array)) {
        //log this.ERROR_INIT
    }
    else {
        this.schema = aSchema;
    }
    this.scriptURI = sScriptURI;
    this._init();
};

YAHOO.widget.DS_XHR.prototype = new YAHOO.widget.DataSource();

/***************************************************************************
 * Public constants
 ***************************************************************************/
/**
 * JSON data type
 *
 * @type constant
 * @final
 */
YAHOO.widget.DS_XHR.prototype.TYPE_JSON = 0;

/**
 * XML data type
 *
 * @type constant
 * @final
 */
YAHOO.widget.DS_XHR.prototype.TYPE_XML = 1;

/**
 * Flat file data type
 *
 * @type constant
 * @final
 */
YAHOO.widget.DS_XHR.prototype.TYPE_FLAT = 2;

/**
 * Error message for XHR failure.
 *
 * @type constant
 * @final
 */
YAHOO.widget.DS_XHR.prototype.ERROR_DATAXHR = "XHR response failed";

/***************************************************************************
 * Public member variables
 ***************************************************************************/
/**
 * Absolute or relative URI to script that returns query results. For instance,
 * queries will be sent to
 *   <scriptURI>?<scriptQueryParam>=userinput
 *
 * @type string
 */
YAHOO.widget.DS_XHR.prototype.scriptURI = null;

/**
 * Query string parameter name sent to scriptURI. For instance, queries will be
 * sent to
 *   <scriptURI>?<scriptQueryParam>=userinput
 * Default: "query".
 *
 * @type string
 */
YAHOO.widget.DS_XHR.prototype.scriptQueryParam = "query";

/**
 * String of key/value pairs to append to requests made to scriptURI. Define
 * this string when you want to send additional query parameters to your script.
 * When defined, queries will be sent to
 *   <scriptURI>?<scriptQueryParam>=userinput&<scriptQueryAppend>
 * Default: "".
 *
 * @type string
 */
YAHOO.widget.DS_XHR.prototype.scriptQueryAppend = "";

/**
 * XHR response data type. Other types that may be defined are TYPE_XML and
 * TYPE_FLAT. Default: TYPE_JSON.
 *
 * @type type
 */
YAHOO.widget.DS_XHR.prototype.responseType = YAHOO.widget.DS_XHR.prototype.TYPE_JSON;

/**
 * String after which to strip results. If the results from the XHR are sent
 * back as HTML, the gzip HTML comment appears at the end of the data and should
 * be ignored.  Default: "\n&lt;!--"
 *
 * @type string
 */
YAHOO.widget.DS_XHR.prototype.responseStripAfter = "\n<!--";

/***************************************************************************
 * Public methods
 ***************************************************************************/
/**
 * Queries the live data source defined by scriptURI for results. Results are
 * passed back to a callback function.
 *  
 * @param {object} oCallbackFn Callback function defined by oParent object to 
 *                             which to return results 
 * @param {string} sQuery Query string
 * @param {object} oParent The object instance that has requested data
 */
YAHOO.widget.DS_XHR.prototype.doQuery = function(oCallbackFn, sQuery, oParent) {
    var isXML = (this.responseType == this.TYPE_XML);
    var sUri = this.scriptURI+"?"+this.scriptQueryParam+"="+sQuery;
    if(this.scriptQueryAppend.length > 0) {
        sUri += "&" + this.scriptQueryAppend;
    }
    //YAHOO.log("Data source query URL is " + sUri);
    var oResponse = null;
    
    var oSelf = this;
    /**
     * Sets up ajax request callback
     *
     * @param {object} oReq          HTTPXMLRequest object
     * @private
     */
    var responseSuccess = function(oResp) {
        if(!isXML) {
            oResp = oResp.responseText;
        }
        else { 
            oResp = oResp.responseXML;
        }
        if(oResp === null) {
            oSelf.dataErrorEvent.fire(oSelf, oParent, sQuery, oSelf.ERROR_DATANULL);
            //YAHOO.log("Data source for " + oParent.getName() +
            //    " experienced a data error for query \"" + sQuery +
            //    "\": " + oSelf.ERROR_DATANULL, "error");
            oCallbackFn(sQuery, null, oParent);
            return;
        }
        
        var resultObj = {};
        resultObj.query = decodeURIComponent(sQuery);
        resultObj.results = oSelf.parseResponse(sQuery, oResp, oParent);
        oSelf._addCacheElem(resultObj);
        oCallbackFn(sQuery, resultObj.results, oParent);
    };

    var responseFailure = function(oResp) {
        oSelf.dataErrorEvent.fire(oSelf, oParent, sQuery, oSelf.ERROR_DATAXHR);
        //YAHOO.log("Data source for " + oParent.getName() +
        //        " experienced a data error for query \"" + sQuery +
        //        "\": " + oSelf.ERROR_DATAXHR, "error");
        oCallbackFn(sQuery, null, oParent);
        return;
    };
    
    var oCallback = {
        success:responseSuccess,
        failure:responseFailure
    };
    
    YAHOO.util.Connect.asyncRequest("GET", sUri, oCallback, null);
};

/**
 * Parses raw response data into an array of result objects. The result data key
 * is always stashed in the [0] element of each result object. 
 *
 * @param {string} sQuery Query string
 * @param {object} oResponse The raw response data to parse
 * @param {object} oParent The object instance that has requested data
 * @returns {array} Array of result objects
 */
YAHOO.widget.DS_XHR.prototype.parseResponse = function(sQuery, oResponse, oParent) {
    var aSchema = this.schema;
    var aResults = [];
    var bError = false;

    // Strip out comment at the end of results
    var nEnd = ((this.responseStripAfter !== "") && (oResponse.indexOf)) ?
        oResponse.indexOf(this.responseStripAfter) : -1;
    if(nEnd != -1) {
        oResponse = oResponse.substring(0,nEnd);
    }

    switch (this.responseType) {
        case this.TYPE_JSON:
            var jsonList;
            if(window.JSON) {
                // Use the JSON utility if available
                var jsonObjParsed = JSON.parse(oResponse);
                if(!jsonObjParsed) {
                    bError = true;
                    break;
                }
                else {
                    // eval is necessary here since aSchema[0] is of unknown depth
                    jsonList = eval("jsonObjParsed." + aSchema[0]);
                }
            }
            else {
                // Parse the JSON response as a string
                try {
                    // Trim leading spaces
                    while (oResponse.substring(0,1) == " ") {
                        oResponse = oResponse.substring(1, oResponse.length);
                    }
                    
                    // Invalid JSON response
                    if(oResponse.indexOf("{") < 0) {
                        bError = true;
                        break;
                    }
                
                    // Empty (but not invalid) JSON response
                    if(oResponse.indexOf("{}") === 0) {
                        break;
                    }
                    
                    // Turn the string into an object literal...
                    // ...eval is necessary here
                    var jsonObjRaw = eval("(" + oResponse + ")");
                    if(!jsonObjRaw) {
                        bError = true;
                        break;
                    }
                    
                    // Grab the object member that contains an array of all reponses...
                    // ...eval is necessary here since aSchema[0] is of unknown depth
                    jsonList = eval("(jsonObjRaw." + aSchema[0]+")");
                }
                catch(e) {
                    bError = true;
                    break;
               }
            }

            if(!jsonList) {
                bError = true;
                break;
            }
            
            // Loop through the array of all responses...
            for(var i = jsonList.length-1; i >= 0 ; i--) {
                var aResultItem = [];
                // ...and loop through each data field value of each response
                for(var j = aSchema.length-1; j >= 1 ; j--) {
                    // ...and capture data into an array mapped according to the schema...
                    var dataFieldValue = jsonList[i][aSchema[j]];
                    //doLog(dataFieldValue);
                    aResultItem.unshift(dataFieldValue);
                }
                // Capture the array of data field values in an array of results
                aResults.unshift(aResultItem);
            }
            break;
        case this.TYPE_XML:
            // Get the collection of results
            var xmlList = oResponse.getElementsByTagName(aSchema[0]);
            // Loop through each result
            for(var k = xmlList.length-1; k >= 0 ; k--) {
                var result = xmlList.item(k);
                //doLog(k+' is '+result.attributes.item(0).firstChild.nodeValue);
                var aFieldSet = [];
                // Loop through each data field in each result using the schema
                for(var m = aSchema.length-1; m >= 1 ; m--) {
                    //doLog(aSchema[m]+' is '+result.attributes.getNamedItem(aSchema[m]).firstChild.nodeValue);
                    var sValue = null;
                    // Values may be held in an attribute...
                    var xmlAttr = result.attributes.getNamedItem(aSchema[m]);
                    if(xmlAttr) {
                        sValue = xmlAttr.value;//doLog('attr'+sValue);
                    }
                    // ...or in a node
                    else {
                        var xmlNode = result.getElementsByTagName(aSchema[m]);
                        if(xmlNode) {
                            sValue = xmlNode.item(0).firstChild.nodeValue;// doLog('node'+sValue);
                        }
                    }
                    // Capture the schema-mapped data field values into an array
                    aFieldSet.unshift(sValue);
                }
                // Capture each array of values into an array of results
                aResults.unshift(aFieldSet);
            }
            break;
        case this.TYPE_FLAT:
            if(oResponse.length > 0) {
                // Delete the last line delimiter at the end of the data if it exists
                var newLength = oResponse.length-aSchema[0].length;
                if(oResponse.substr(newLength) == aSchema[0]) {
                    oResponse = oResponse.substr(0, newLength);
                }
                var aRecords = oResponse.split(aSchema[0]);
                for(var n = aRecords.length-1; n >= 0; n--) {
                    aResults[n] = aRecords[n].split(aSchema[1]);
                }
            }
            break;
        default:
            break;
    }    
    if(bError) {
        this.dataErrorEvent.fire(this, oParent, sQuery, this.ERROR_DATAPARSE);
        //YAHOO.log("Data source for " + oParent.getName() +
        //        " experienced a data error for query \"" + sQuery +
        //        "\": " + this.ERROR_DATAPARSE, "error");
        return null;
    }
    else {
        this.getResultsEvent.fire(this, oParent, sQuery, aResults);
        //YAHOO.log("Data source for " + oParent.getName() + " got " + aResults.length + " results from source.");
        return aResults;
    }
};            


/***************************************************************************
 * Private member variables
 ***************************************************************************/
/**
 * XHR connection object.
 *
 * @type object
 * @private
 */
YAHOO.widget.DS_XHR.prototype._oConn = null;


/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Implementation of YAHOO.widget.DataSource using a native Javascript struct as
 * its live data source.
 *  
 * @constructor
 * extends YAHOO.widget.DataSource 
 *  
 * @param {string} oFunction In-memory Javascript function that returns query
 *                           results as an array of objects
 * @param {object} oConfigs Optional object literal of config params
 */
YAHOO.widget.DS_JSFunction = function(oFunction, oConfigs) {
    // Set any config params passed in to override defaults
    if(typeof oConfigs == "object") {
        for(var sConfig in oConfigs) {
            this[sConfig] = oConfigs[sConfig];
        }
    }
    
    // Initialization sequence
    this.dataFunction = oFunction;
    this._init();
};

YAHOO.widget.DS_JSFunction.prototype = new YAHOO.widget.DataSource();

/***************************************************************************
 * Public member variables
 ***************************************************************************/
/**
 * In-memory Javascript function that returns query results.
 *
 * @type function
 */
YAHOO.widget.DS_JSFunction.prototype.dataFunction = null;


/***************************************************************************
 * Public methods
 ***************************************************************************/
/**
 * Queries the live data source defined by function for results. Results are
 * passed back to a callback function.
 *  
 * @param {object} oCallbackFn Callback function defined by oParent object to 
 *                             which to return results 
 * @param {string} sQuery Query string
 * @param {object} oParent The object instance that has requested data
 */
YAHOO.widget.DS_JSFunction.prototype.doQuery = function(oCallbackFn, sQuery, oParent) {
    var oFunction = this.dataFunction;
    var aResults = [];
    
    aResults = oFunction(sQuery);
    if(aResults === null) {
        this.dataErrorEvent.fire(this, oParent, sQuery, this.ERROR_DATANULL);
        //YAHOO.log("Data source for " + oParent.getName() +
        //        " experienced a data error for query \"" + sQuery +
        //        "\": " + oSelf.ERROR_DATANULL, "error");
        oCallbackFn(sQuery, null, oParent);
        return;
    }
    
    var resultObj = {};
    resultObj.query = decodeURIComponent(sQuery);
    resultObj.results = aResults;
    this._addCacheElem(resultObj);
    
    this.getResultsEvent.fire(this, oParent, sQuery, aResults);
    //YAHOO.log("Data source for " + oParent.getName() + " got " + aResults.length + " results from source.");
    oCallbackFn(sQuery, aResults, oParent);
    return;
};

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Implementation of YAHOO.widget.DataSource using a native Javascript array as
 * its live data source.
 *
 * @constructor
 * extends YAHOO.widget.DataSource
 *
 * @param {string} aData In-memory Javascript array of simple string data
 * @param {object} oConfigs Optional object literal of config params
 */
YAHOO.widget.DS_JSArray = function(aData, oConfigs) {
    // Set any config params passed in to override defaults
    if(typeof oConfigs == "object") {
        for(var sConfig in oConfigs) {
            this[sConfig] = oConfigs[sConfig];
        }
    }

    // Initialization sequence
    this.data = aData;
    this._init();
};

YAHOO.widget.DS_JSArray.prototype = new YAHOO.widget.DataSource();

/***************************************************************************
 * Public member variables
 ***************************************************************************/
/**
 * In-memory Javascript array of strings.
 *
 * @type array
 */
YAHOO.widget.DS_JSArray.prototype.data = null;

/***************************************************************************
 * Public methods
 ***************************************************************************/
/**
 * Queries the live data source defined by data for results. Results are passed
 * back to a callback function.
 *
 * @param {object} oCallbackFn Callback function defined by oParent object to
 *                             which to return results
 * @param {string} sQuery Query string
 * @param {object} oParent The object instance that has requested data
 */
YAHOO.widget.DS_JSArray.prototype.doQuery = function(oCallbackFn, sQuery, oParent) {
    var aData = this.data;
    var aResults = [];
    var bMatchFound = false;
    var bMatchContains = this.queryMatchContains;
    if(!this.queryMatchCase) {
        sQuery = sQuery.toLowerCase();
    }

    // Loop through each element of the array...
    for(var i = aData.length-1; i >= 0; i--) {
        var aDataset = [];
        if(typeof aData[i] == "string") {
            aDataset[0] = aData[i];
        }
        else {
            aDataset = aData[i];
        }

        var sKeyIndex = (this.queryMatchCase) ?
            encodeURIComponent(aDataset[0]).indexOf(sQuery):
            encodeURIComponent(aDataset[0]).toLowerCase().indexOf(sQuery);

        // A STARTSWITH match is when the query is found at the beginning of the key string...
        if((!bMatchContains && (sKeyIndex === 0)) ||
        // A CONTAINS match is when the query is found anywhere within the key string...
        (bMatchContains && (sKeyIndex > -1))) {
            // Stash a match into aResults[].
            aResults.unshift(aDataset);
        }
    }

    this.getResultsEvent.fire(this, oParent, sQuery, aResults);
    //YAHOO.log("Data source for " + oParent.getName() + " got " + aResults.length + " results from source.");
    oCallbackFn(sQuery, aResults, oParent);
};
