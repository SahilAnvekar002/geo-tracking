import { IResponse } from "./types";

// Re-export the interface so it can be imported directly
export type { IResponse } from "./types";

// Create a concrete Response class that implements the interface
export class Response<T=undefined> implements IResponse<T> {
  status: "OK" | "ERROR";
  message?: string;
  data?: T;

  constructor(status: "OK" | "ERROR", data?: T, message?: string) {
    this.status = status;
    this.data = data;
    this.message = message;
  }

  // Helper factory methods
  static success<T>(data?: T, message?: string): IResponse<T> {
    const response = new Response<T>("OK", data, message);
    return {
      status: response.status,
      message: response.message,
      data: response.data,
    };
  }

  static error<T>(message?: string, data?: T): IResponse<T> {
    const response = new Response<T>("ERROR", data, message);
    return {
      status: response.status,
      message: response.message,
      data: response.data,
    };
  }
}
