export class HttpError extends Error {
  code: number;
  status: number;

  constructor(code: number, status: number, message: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}
