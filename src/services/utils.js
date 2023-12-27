export default class Utils {
  static async handleResponseError(response) {
    let data;

    if (response && response.headers && response.headers['content-type'] && response.headers['content-type'].indexOf('text/plain') > -1) {
      data = response.data;
    } else {
      data = response.data;
    }

    if (response.status >= 400 && response.status <= 500) {
      throw new Error(data.message);
    }

    if (data === null) {
      return data;
    }

    if (!data || (response.status >= 400 && response.status <= 500)) {
      throw Error((typeof data.error) === 'object' ? (data.error.message || JSON.stringify(data.error)) : data.error);
    }

    if (data && data.type === 'error') {
      throw Error(data.message);
    }

    return data;
  }

  static sleep = (millis) => {
    return new Promise(resolve => setTimeout(resolve, millis));
  };
}
