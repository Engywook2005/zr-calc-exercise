class Ajax {
  static doAjaxQuery(url, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      const xhttp = new XMLHttpRequest();

      xhttp.onloadend = function () {
        if (this.status === 200 || this.status === 304) {
          resolve(this.responseText);
        } else {
          reject(new Error(this.status));
        }
      };

      xhttp.open(method, url, true);
      xhttp.send(new URLSearchParams(body));
    });
  }
}
export default Ajax;
