/**
 * Generic store for creation of API calls stores with loading states
 *
 */

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

import { decorate, action, observable } from 'mobx';

import log from 'utils/logging';

// -----------------------------------------------------------------------------
// Code
// -----------------------------------------------------------------------------

const fetchData = (url, options) =>
  fetch(url, options)
    .then(res => res.json())
    .catch(error => {
      log.error(error);
      return {
        error: { message: 'Error occuried during data fetching', code: error.code || '500000000' },
      };
    });

const localstorageWrapper = {
  get(name) {
    try {
      return JSON.parse(localStorage.getItem(name));
    } catch (error) {
      log.error(`Unable to read ${name} from local storage (${error.message})`);
      return undefined;
    }
  },
  set(name, data) {
    try {
      localStorage.setItem(name, JSON.stringify(data));
    } catch (error) {
      log.error(`Unable to save auth data to local storage (${error.message})`);
    }
  },
};

const GenericApiStore = {
  fetchOptions: { url: '/api' },

  fetch: fetchData,

  parseData: data => data,

  sideEffect: () => {},

  loading: undefined,

  startedAt: undefined,

  finishedAt: undefined,

  data: undefined,

  dataCache: undefined,

  error: undefined,

  loadingStart() {
    this.loading = true;
    this.startedAt = new Date().getTime();
  },

  loadingFinish() {
    this.loading = false;
    this.finishedAt = new Date().getTime();
  },

  updateData(data) {
    if (!this.data || !data) {
      this.data = data;
    } else {
      Object.assign(this.data, data);
    }
  },

  updateError(error) {
    if (!this.error || !error) {
      this.error = error;
    } else {
      Object.assign(this.error, error);
    }
  },

  cleanup() {
    this.updateData(undefined);
    this.updateError(undefined);
  },

  async run() {
    return this.startFetching();
  },

  async startFetching(options = {}) {
    if (this.loading) {
      log.debug(`${this.name} is already loading`);
      return { loading: true };
    }
    const parsedOptions = {
      ...this.fetchOptions,
      ...options,
    };
    if (parsedOptions.body && typeof options.body !== 'string') {
      try {
        parsedOptions.body = JSON.stringify(parsedOptions.body);
      } catch (err) {
        log.error(err);
        const error = { message: `Failed to stringify request body, ${options.body}`, code: 500 };
        this.updateError(error);
        return error;
      }
      if (!parsedOptions.headers) parsedOptions.headers = {};
      parsedOptions.headers['Content-Type'] = 'application/json; charset=utf-8';
    }
    this.loadingStart();
    const response = await this.fetch(parsedOptions.url, parsedOptions);
    let dataParsed = response.data;
    if (dataParsed) {
      dataParsed = await this.parseData(response.data, options);
      this.sideEffect(dataParsed);
    }
    this.updateData(dataParsed);
    this.updateError(response.error);
    this.loadingFinish();
    return response;
  },
};

export function createNewStore(store) {
  const newStore = Object.defineProperties(
    { ...GenericApiStore },
    Object.getOwnPropertyDescriptors(store),
  );
  decorate(newStore, {
    loading: observable,
    error: observable,
    data: observable,
    loadingStart: action(`Loading started (${newStore.name})`),
    loadingFinish: action(`Loading finished (${newStore.name})`),
    updateError: action(`Error updated (${newStore.name})`),
    updateData: action(`Data updated (${newStore.name})`),
  });
  return newStore;
}

export default createNewStore;
