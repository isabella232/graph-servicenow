require('dotenv').config();

const fs = require('fs');
const path = require('path');
import { ServiceNowClient } from '../src/client';
import { loadConfigFromEnvironmentVariables } from '@jupiterone/integration-sdk-runtime';
import instanceConfigFields from '../src/instanceConfigFields';
import { IntegrationConfig } from '../src/types';
import { IntegrationLogger } from '@jupiterone/integration-sdk-core';

const config = loadConfigFromEnvironmentVariables<IntegrationConfig>(
  instanceConfigFields,
);

const client = new ServiceNowClient(
  config,
  (undefined as unknown) as IntegrationLogger,
);

const filename = path.join(__dirname, '__data__', 'tables.txt');

console.log('Fetching table names from Service Now...');
client
  .listTableNames('')
  .then((tableNames) =>
    fs.writeFile(filename, tableNames.sort().join('\n'), (err) => {
      if (err) throw err;
      console.log(`Successfully wrote ServiceNow table names to ${filename}`);
    }),
  )
  .catch((err) => {
    throw Error('Error executing listRemoteTables.');
  });
