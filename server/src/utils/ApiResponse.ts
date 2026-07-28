// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ApiResponse<T = any> {
  public statusCode: number;
  public success: boolean;
  public message: string;
  public data: T;

  constructor(statusCode: number, messageOrData: string | T = 'Success', dataOrMessage?: T | string) {
    this.statusCode = statusCode;
    this.success = true;
    if (typeof messageOrData === 'string') {
      this.message = messageOrData;
      this.data = (dataOrMessage !== undefined ? dataOrMessage : null) as T;
    } else {
      this.data = messageOrData as T;
      this.message = typeof dataOrMessage === 'string' ? dataOrMessage : 'Success';
    }
  }
}
