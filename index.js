// Dependencies
const request = require('request');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const qs = require('querystring');

class GFormRESTAPI {
  constructor(API_BASE_URL, API_KEY, API_SECRET_KEY) {
    this.API_BASE_URL = `${API_BASE_URL}wp-json/gf/v2/`;
    this.API_KEY = API_KEY;
    this.API_SECRET_KEY = API_SECRET_KEY;

    this.authentication();
  }

  /**
   * Authentications
   */
  authentication() {
    // Initialize
    this.oauth = OAuth({
      consumer: {
        key: this.API_KEY,
        secret: this.API_SECRET_KEY,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
      },
    });
  }

  /**
   * Get entries
   *
   * @param {number} form_ids
   * @param {number} entry_id
   */
  getEntries(form_ids, entry_id, callback = null) {
    form_ids = form_ids ? form_ids : '';
    entry_id = entry_id ? entry_id : '';
    let opt = {
      url: `${this.API_BASE_URL}entries/${entry_id}`,
      qs: {
        form_ids: form_ids,
      },
      json: true,
    };
    this.get(opt, callback);
  }

  /**
   * Add form entry
   *
   * @param {object} entry_fields
   */
  addEntry(entry_fields, callback) {
    const opt = {
      url: `${this.API_BASE_URL}entries`,
      form: entry_fields,
      json: true,
    };

    this.post(opt, callback);
  }

  /**
   * Update entry
   *
   * @param {*} entry_id
   * @param {*} entry_fields
   * @param {*} callback
   */
  updateEntry(entry_id, entry_fields, callback) {
    const opt = {
      url: `${this.API_BASE_URL}entries/${entry_id}`,
      form: entry_fields,
      json: true,
    };

    this.put(opt, callback);
  }

  /**
   * Delete entry
   *
   * @param {*} entry_id
   * @param {*} callback
   */
  deleteEntry(entry_id, callback) {
    if (!entry_id) {
      console.error('No entry id found.');
      return;
    }

    const opt = {
      url: `${this.API_BASE_URL}entries/${entry_id}`,
      json: true,
    };

    this.delete(opt, callback);
  }

  /**
   * Send entry notifications
   *
   * @param {*} entry_id
   * @param {*} callback
   */
  sendNotifications(entry_id, callback) {
    const opt = {
      url: `${this.API_BASE_URL}entries/${entry_id}/notifications`,
      json: true,
    };
    this.post(opt, callback);
  }

  /**
   * GET Request
   *
   * @param {object} opt
   */
  get(opt, callback) {
    var request_data = {
      url: opt.url,
      method: 'GET',
      data: opt.qs,
    };

    opt.qs = this.oauth.authorize(request_data);
    opt.method = request_data.method;

    this.request(opt, callback);
  }

  /**
   * POST Request
   *
   * @param {*} opt
   */
  post(opt, callback) {
    opt = this.preprareRequest(opt, 'POST');

    return this.request(opt, callback);
  }

  /**
   * PUT Request
   * @param {*} opt
   */
  put(opt, callback) {
    opt = this.preprareRequest(opt, 'PUT');
    return this.request(opt, callback);
  }

  /**
   * PUT Request
   *
   * @param {*} opt
   */
  delete(opt, callback) {
    opt = this.preprareRequest(opt, 'DELETE');
    return this.request(opt, callback);
  }

  /**
   * Prepare Request
   *
   * @param {*} opt
   */
  preprareRequest(opt, method = 'POST') {
    var request_data = {
      url: opt.url,
      method: method,
      //   data: opt.form Non lo voleva qui perchè se no sbagliava la signature
    };

    const authorize = this.oauth.authorize(request_data);

    if (opt.form) opt.body = opt.form; // FIXED Non lo voleva searializzato

    const authorizeClean = {
      oauth_consumer_key: authorize.oauth_consumer_key,
      oauth_nonce: authorize.oauth_nonce,
      oauth_signature_method: authorize.oauth_signature_method,
      oauth_timestamp: authorize.oauth_timestamp,
      oauth_version: authorize.oauth_version,
      oauth_signature: authorize.oauth_signature,
    };

    const authorizeCleanSerialized = qs.stringify(authorizeClean);

    opt.url += `?${authorizeCleanSerialized}`;

    if (opt.headers) {
      opt.headers['Content-Type'] = 'application/json';
    } else {
      opt.headers = {
        'Content-Type': 'application/json',
      };
    }

    opt.method = request_data.method;

    //delete
    delete opt.form;
    delete opt.oauth;

    return opt;
  }

  /**
   * Request
   *
   * @param {*} opt
   * @param {*} callback
   */
  request(opt, callback = null) {
    if (callback !== null) {
      return request(opt, callback);
    }

    return request(opt);
  }
}

module.exports = GFormRESTAPI;
