# Gravity Form REST API v2

The Gravity Form REST API v2 for JavaScript, available for Node.js backends

## Installing

The preferred way to install the Gravity Form REST API v2 for Node.js is to use the npm package manager for Node.js. Simply type the following into a terminal window:

```sh
npm install gravity-form-rest-api-v2-js
```

Then within your application, you can reference to the SDK with the following:

```javascript
require('gravity-form-rest-api-v2-js');
```

## Usage and Getting Started

```javascript
const GFormAPI = require('gravity-form-rest-api');
const GForm = new GFormAPI(API_BASE_URL, API_KEY, API_SECRET_KEY);

function callback(err, res, body) {
  if (err) throw new Error(err);
  console.log(body);
});
```

### Get all form entries

```javascript
GForm.getEntries(YOUR_FORM_ID, null, callback);
```

### Get single form entry

```javascript
GForm.getEntries(YOUR_FORM_ID, YOUR_ENTRY_ID, callback);
```

### Add new entry

```javascript
const example_entry_fields = {
  form_id: YOUR_FORM_ID,
  date_created: '2020-04-30 12:08:23',
  source_url: 'https://domain.local',
  '1': '',
  '2': 'Foo',
  '3': 'Bar',
  '4': '1234567890',
  '5': 'user@email.local',
};
GForm.addEntry(example_entry_fields, callback);
```

### Update entry

```javascript
const example_entry_fields = {
  form_id: YOUR_FORM_ID,
  date_created: '2020-04-30 12:08:23',
  source_url: 'https://domain.local',
  '1': '',
  '2': 'Foo',
  '3': 'Bar',
  '4': '1234567890',
  '5': 'user@email.local',
};
GForm.updateEntry(YOUR_ENTRY_ID, example_entry_fields, callback);
```

### Delete entry

```javascript
GForm.deleteEntry(YOUR_ENTRY_ID, callback);
```

### Send notifications

```javascript
GForm.sendNotifications(YOUR_ENTRY_ID, callback);
```
