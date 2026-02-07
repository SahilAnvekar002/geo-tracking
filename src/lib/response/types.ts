export interface IResponse<T> {
  status: "OK" | "ERROR";
  message?: string;
  data?: T;
}
