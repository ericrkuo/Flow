const Err = require("../constant/Error");

class AzureFaceAPIService {

    /**
     * Constructor for AzureFaceAPIService
     */
    constructor() {
        require("dotenv").config();
    }

    /**
     * Returns emotion of current user by processing image to binary and issuing POST request to AzureFaceAPI
     * @param dataURI - image encoding of the user's submitted photo
     * @returns {Promise<* | void>} - returns data regarding user's mood
     */
    getEmotions(dataURI) {
        return this.convertDataURIToBinary(dataURI)
            .then((data) => {
                const axios = require("axios");
                const config = {
                    method: "post",
                    url: "https://flowfaceapi.cognitiveservices.azure.com/face/v1.0/detect",
                    headers: {
                        "Ocp-Apim-Subscription-Key": process.env.AZUREKEY,
                        "Content-Type": "application/octet-stream",
                    },
                    params: {
                        returnFaceID: true,
                        returnFaceLandmarks: false,
                        returnFaceAttributes: "age,gender,headPose,smile,facialHair,emotion",
                        recognitionModel: "recognition_03",
                        detectionModel: "detection_01",
                    },
                    data: data,
                };
                return axios(config);
            })
            .then((response) => {
                return this.handleAzureFaceAPIResponse(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.error) {
                    throw new Err.AzureFaceApiError(JSON.stringify(error.response.data.error));
                }
                throw error;
            });
    }

    /**
     * Handles response from AzureFaceAPI
     * @param response - emotion data from API response
     * @returns {*} - object with quantities per possible mood
     */
    handleAzureFaceAPIResponse(response) {
        if (!this.isResponseValid(response)) throw new Err.InvalidResponseError("Response from Azure Face API is invalid - null or not an array");
        if (response.data.length === 0) throw new Err.NoUserDetectedError();
        if (!this.isResponseDataValid(response.data)) throw new Err.InvalidResponseError("Response from Azure Face API is invalid - no faceAttributes or emotions");

        const emotionData = response.data[0]["faceAttributes"]["emotion"];
        console.log(JSON.stringify(response.data));
        return emotionData;
    }

    /**
     * Checks if response is valid
     * @param response - response from AzureFaceAPI
     * @returns boolean - returns true if response is not null/undefined and data is an array
     */
    isResponseValid(response) {
        return response && response.data && Array.isArray(response.data);
    }

    /**
     * Checks if response data is valid
     * @param responseData - responseData from AzureFaceAPI
     * @returns boolean - returns true if response contains info about faceAttributes and emotions
     */
    isResponseDataValid(responseData) {
        return responseData[0]["faceAttributes"] && responseData[0]["faceAttributes"]["emotion"];
    }

    /**
     * Converts the data URI image of the user to binary
     * @param dataURI - data URI image of the user
     * @returns {Promise<unknown>} - binary version of image
     */
    convertDataURIToBinary(dataURI) {
        return new Promise((resolve, reject) => {
            if (!dataURI || typeof dataURI !== "string") return reject(new Err.InvalidInputError("The dataURI is formatted improperly"));

            const BASE64_MARKER = ";base64,";
            const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
            const base64 = dataURI.substring(base64Index);
            const raw = Buffer.from(base64, "base64").toString("binary");
            const rawLength = raw.length;
            const array = new Uint8Array(new ArrayBuffer(rawLength));

            for (let i = 0; i < rawLength; i++) {
                array[i] = raw.charCodeAt(i);
            }
            return resolve(array);
        });
    }
}

module.exports.AzureFaceAPIService = AzureFaceAPIService;
