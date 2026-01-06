import { Parser } from '@json2csv/plainjs';

export function toCsv(data, fields) {
  try {
    const parser = new Parser({ fields });
    return parser.parse(data);
  } catch (error) {
    console.error('CSV conversion error:', error);
    throw new Error('Failed to convert data to CSV');
  }
}