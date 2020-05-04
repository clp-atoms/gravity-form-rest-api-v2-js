require('dotenv').config();
const GFormAPI = require('gravity-form-rest-api');

const GForm = new GFormAPI(process.env.API_BASE_URL, process.env.API_KEY, process.env.API_SECRET_KEY);

const action = process.argv[2];

if (!action) {
  console.error('Action not found. Available actions:', {
    'Add new entry': 'node index.js add-entry',
    'Get all entries': 'node index.js get-entries',
    'Get single entry': 'node index.js get-entries ENTRY_ID',
    'Send entry notifications': 'node index.js send-notifications ENTRY_ID',
  });
  return;
}

switch (action) {
  case 'get-entries': {
    // Get all entries
    const form_id = process.argv[3] ? process.argv[3] : null;
    const entry_id = process.argv[4] ? process.argv[4] : null;
    GForm.getEntries(form_id, entry_id, callback);
    break;
  }
  case 'add-entry': {
    // Add new entry
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
    break;
  }
  case 'update-entry': {
    // Update entry
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
    break;
  }
  case 'delete-entry': {
    // Delete entry
    const entry_id = process.argv[3] ? process.argv[3] : null;
    GForm.deleteEntry(entry_id, callback);
    break;
  }
  case 'send-notifications': {
    // Send entry notify
    const entry_id = process.argv[3] ? process.argv[3] : '';
    if (!entry_id) {
      console.error('No entry_id found.');
    }
    GForm.sendNotifications(entry_id, callback);
    break;
  }
}

function callback(err, res, body) {
  if (err) throw new Error(err);
  console.log(body);
}
