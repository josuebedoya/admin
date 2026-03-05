type Params = {
  data: any;
  success: boolean;
  message: string;
  error: any;
  status: number;
}

export default function ResApi({data, success, message, error, status}: Params) {
  return {
    data,
    success,
    message,
    error,
    status
  }
}