class ApiCustomError extends Error {
    status: number;
    details: unknown;

    constructor(message: string, status: number, details: unknown = {}) {
      super(message);
      this.message = message;
      this.status = status;
      this.details = details;
    }
  }

  export default ApiCustomError;
