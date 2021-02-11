import {
  setupRecording,
  Recording,
  SetupRecordingInput,
  RecordingEntry,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export function setupServiceNowRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    mutateEntry: mutateServiceNowEntry,
    options: {
      ...input.options,
      matchRequestsBy: {
        // hostname for developer instances include random numbers, e.g.
        // dev99999.service-now.com
        // We want requests to match even when devs use different hosts.
        url: {
          hostname: false,
        },
        // Ideally we would use { headers: { exclude: ['host'] } }, but
        // was not working during tests. So we opt for the broader { headers: false }
        headers: false,
      },
    },
  });
}

interface NestedReplaceOptions {
  testFunction: (key: string, value: any) => boolean;
  replacement: any;
}

const nestedReplacements: NestedReplaceOptions[] = [
  {
    testFunction: (key: string, value: any) => key === 'user_password',
    replacement: '[REDACTED]',
  },
];

function mutateServiceNowEntry(entry: RecordingEntry): void {
  const responseText = entry.response.content.text;
  if (!responseText) {
    return;
  }

  let responseJson = JSON.parse(responseText);

  nestedReplacements.forEach((nestedReplacement) => {
    const redactedJson = nestedReplace(responseJson, nestedReplacement);
    responseJson = redactedJson;
  });

  entry.response.content.text = JSON.stringify(responseJson);
}

function isObject(input: any): boolean {
  return typeof input === 'object' && input !== null;
}

function nestedReplace(
  parsedJson: object,
  options: NestedReplaceOptions,
): object {
  for (const key of Object.keys(parsedJson)) {
    const originalValue = parsedJson[key];
    if (options.testFunction(key, originalValue)) {
      parsedJson[key] = options.replacement;
    } else if (isObject(originalValue)) {
      parsedJson[key] = nestedReplace(originalValue, options);
    }
  }
  return parsedJson;
}
