//#region General Errors
class InvalidInputError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidInputError";
    }
}

class InvalidResponseError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidResponseError";
    }
}
//#endregion

//#region AzureFaceApi Errors
class NoUserDetectedError extends Error {
    constructor() {
        super("No user detected in photo");
        this.name = "NoUserDetectedError";
    }
}
//#endregion

//#region Spotify Errors
class EmptyTracksError extends Error {
    constructor() {
        super("No tracks detected");
        this.name = "EmptyTracksError";
    }
}
//#endregion

//#region KMean Errors
class KMeanIterationError extends Error {
    constructor(currIterations, maxIterations) {
        super("Too many iterations: " + currIterations + ", maxIterations: " + maxIterations);
        this.name = "KMeanIterationError";
    }
}

class KMeanClusterError extends Error {
    constructor(message) {
        super(message);
        this.name = "KMeanClusterError";
    }
}
//#endregion

//#region Main Errors
class InvalidDataURLError extends Error {
    constructor() {
        super("dataURL is not set");
        this.name = "InvalidDataURLError";
    }
}
//#endregion

module.exports.InvalidInputError = InvalidInputError;
module.exports.InvalidResponseError = InvalidResponseError;
module.exports.NoUserDetectedError = NoUserDetectedError;
module.exports.EmptyTracksError = EmptyTracksError;
module.exports.KMeanClusterError = KMeanClusterError;
module.exports.KMeanIterationError = KMeanIterationError;
module.exports.InvalidDataURLError = InvalidDataURLError;