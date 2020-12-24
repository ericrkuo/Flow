//#region General Errors
class InvalidInputError extends Error {
    /**
     * Constructor for InvalidInputError
     * @param message - error message
     */
    constructor(message) {
        super(message);
        this.name = "InvalidInputError";
    }
}

class InvalidResponseError extends Error {
    /**
     * Constructor for InvalidResponseError
     * @param message - error message
     */
    constructor(message) {
        super(message);
        this.name = "InvalidResponseError";
    }
}

//#endregion

//#region AzureFaceApiService Errors
class NoUserDetectedError extends Error {
    /**
     * Constructor for NoUserDetectedError
     * @param message - error message
     */
    constructor() {
        super("No user detected in photo");
        this.name = "NoUserDetectedError";
    }
}

class AzureFaceApiError extends Error {
    /**
     * Constructor for AzureFaceApiError
     * @param message - error message
     */
    constructor(message) {
        super(message);
        this.name = "AzureFaceApiError";
    }
}

//#endregion

//#region SpotifyService Errors
class EmptyTracksError extends Error {
    /**
     * Constructor for EmptyTracksError
     * @param message - error message
     */
    constructor() {
        super("No tracks detected");
        this.name = "EmptyTracksError";
    }
}

//#endregion

//#region KMean Errors
class KMeanIterationError extends Error {
    /**
     *  Constructor for KMeanIterationError
     * @param currIterations - current number of iterations
     * @param maxIterations - max number of iterations possible
     */
    constructor(currIterations, maxIterations) {
        super("Too many iterations: " + currIterations + ", maxIterations: " + maxIterations);
        this.name = "KMeanIterationError";
    }
}

class KMeanClusterError extends Error {
    /**
     * Constructor for KMeanClusterError
     * @param message - error message
     */
    constructor(message) {
        super(message);
        this.name = "KMeanClusterError";
    }
}

//#endregion

//#region Main Errors
class InvalidDataURLError extends Error {
    /**
     * Constructor for InvalidDataURLError
     */
    constructor() {
        super("dataURL is not set");
        this.name = "InvalidDataURLError";
    }
}

//#endregion

//#region RefreshCredentialService Errors
class RefreshCredentialError extends Error {
    /**
     * Constructor for RefreshCredentialError
     * @param message - error message
     */
    constructor(message) {
        super(message);
        this.name = "RefreshCredentialError";
    }
}

//#endregion

module.exports.InvalidInputError = InvalidInputError;
module.exports.InvalidResponseError = InvalidResponseError;
module.exports.NoUserDetectedError = NoUserDetectedError;
module.exports.AzureFaceApiError = AzureFaceApiError;
module.exports.EmptyTracksError = EmptyTracksError;
module.exports.KMeanClusterError = KMeanClusterError;
module.exports.KMeanIterationError = KMeanIterationError;
module.exports.InvalidDataURLError = InvalidDataURLError;
module.exports.RefreshCredentialError = RefreshCredentialError;
