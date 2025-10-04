interface CommonResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}
export default CommonResponse;