import { get, isNil, pick } from 'lodash';

export const toPaginatedResponse = (result) => () => {
  return { data: result.docs, meta: pick(result, ['total', 'pages']) };
};

export const toPickerResponse = (result, picker) => () => {
  if (!isNil(picker)) {
    const pickerObj = JSON.parse(picker);

    const data = result.docs.map((item) => ({
      label: get(item, pickerObj['label']),
      value: get(item, pickerObj['value']),
    }));

    return { data, meta: pick(result, ['total', 'pages']) };
  } else {
    return { data: [], meta: { total: 0, pages: 0 } };
  }
};
