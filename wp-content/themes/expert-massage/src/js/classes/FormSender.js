import { GLOBAL_VARS } from '../utils/constants/globalVars';
import { MESSAGES } from '../utils/constants/messages';
import isEmptyObject from '../utils/functions/isEmptyObject';

export default class FormSender {
  constructor({ form, url, method, dataCollector, beforeSubmit, afterSubmit, requestFormat, responseFormat, responseHandler, responseDataHandler, errorHandler }) {
    this.form = form;
    this.url = url || this.form.action;
    this.method = method || this.form.method;
    this.dataCollector = dataCollector;
    this.beforeSubmit = beforeSubmit;
    this.afterSubmit = afterSubmit;
    this.requestFormat = requestFormat || `json`;
    this.responseFormat = responseFormat || `json`;
    this.responseHandler = responseHandler || this._responseHandler.bind(this);
    this.responseDataHandler = responseDataHandler;
    this.errorHandler = errorHandler;
    this.additionalErrorMessageText = `Попробуйте снова или позвоните нам на <a class='link' href='tel:+74993977181'>+7(499)397-71-81</a>. Мы вам поможем!`
  }

  send(evt) {
    evt?.preventDefault();
    if (GLOBAL_VARS.isRequestSended) {
      return;
    }

    let data = this.dataCollector && this.dataCollector();
    if ((!data || (isEmptyObject(data) && !(data instanceof FormData))) && this.method !== `get`) {
      return;
    }

    const headers = {
      // 'X-CSRF-TOKEN': document.querySelector(`meta[name=csrf-token]`).content
    };

    if (this.requestFormat === `json`) {
      headers[`Content-Type`] = `application/json;charset=utf-8`;
      data = JSON.stringify(data);
    }

    this._beforeSubmit();

    const fetchPromise = fetch(this.url, {
      method: this.method,
      headers: headers,
      body: this.method === `post` ? data : null
    })
      .then(this.responseHandler)
      .then(response => this._responseDataHandler(response))
      .catch(error => this._errorHandler(error))
      .finally(() => {
        GLOBAL_VARS.isRequestSended = false;
      });

    this._afterSubmit();
    return fetchPromise;
  }

  _beforeSubmit() {
    if (this.beforeSubmit) {
      this.beforeSubmit();
    }

    GLOBAL_VARS.isRequestSended = true;
  }

  _afterSubmit() {
    if (this.afterSubmit) {
      this.afterSubmit();
    }
  }

  _responseHandler(response) {
    if (response?.status < 500) {
      return new Promise((resolve, reject) => response[this.responseFormat]()
        .then(data => resolve({
          status: response.status,
          data
        }))
        .catch(error => reject(error)));
    }

    throw new Error(`Ошибка сервера (код ${response.status}). ${this.additionalErrorMessageText}`);
  }

  _responseDataHandler(response) {
    if (!response.data) {
      throw new Error(`Данные не получены. ${this.additionalErrorMessageText}`);
    }

    if (response.status > 400) {
      throw new Error(`Ошибка ${response.status}. ${this.additionalErrorMessageText}`);
    }

    if (response.status === 400) {
      const receivedError = response.data;

      if (receivedError.code && MESSAGES.ERROR[receivedError.code]) {
        throw new Error(MESSAGES.ERROR[receivedError.code]);
      }
      if (receivedError.error) {
        throw new Error(receivedError.error);
      }
      throw new Error(`Неизвестная ошибка. ${this.additionalErrorMessageText}`);
    }

    if (this.responseDataHandler) {
      this.responseDataHandler(response.data);
    }
  }

  _errorHandler(error) {
    if (this.errorHandler) {
      this.errorHandler(error);
    }
  }
}
