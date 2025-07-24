class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.message = message || "An error occurred";
    this.success = false; // Indicates that the operation was not successful
    this.errors = errors
    if(stack){
        this.stack = stack; // Capture the stack trace if provided
    }else{
        Error.captureStackTrace(this, this.constructor);
    }
  }
}
export { ApiError };