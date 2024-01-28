export default class API {
  static POST(
    url: string,
    data?: { [key: string]: string }
  ): Promise<Response> {
    const options: RequestInit = {
      method: "POST",
      mode: "same-origin",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: data ? this.xWwwFormUrlEncoded(data) : "",
    };

    return fetch(url, options);
  }

  static GET(url: string): Promise<Response> {
    const options: RequestInit = {
      method: "GET",
      mode: "same-origin",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json", // Adjust content type if needed
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    };

    return fetch(url, options);
  }

  private static xWwwFormUrlEncoded(data: { [key: string]: string }) {
    let formBody: string[] = [];
    for (const property in data) {
      if (Object.prototype.hasOwnProperty.call(data, property)) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
    }
    return formBody.join("&");
  }
}
