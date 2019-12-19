import ApiService from "../api.service";

class UpdateError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errorCode = errorCode;
  }
}

const FileService = {
  Get: async function (url) {
    try {
      const response = await ApiService.get(url);
      return response;
    } catch (error) {
      if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
      else throw new UpdateError(error.response.status, error.response.data.message);
    }
  }
};

export default FileService;
export { FileService, UpdateError };
