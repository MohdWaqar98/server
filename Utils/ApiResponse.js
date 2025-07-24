class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode; // HTTP status code for the response
        this.success = true; // Indicates that the operation was successful
        this.data = data; // Placeholder for the response data
        this.message = message; // Default success message
    }
}
export { ApiResponse };