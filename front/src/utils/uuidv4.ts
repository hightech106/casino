/**
 * UUID v4 generator using random hexadecimal values.
 * Generates RFC4122-compliant UUIDs for unique identifier creation.
 * Note: Uses Math.random() for randomness, which is sufficient for non-cryptographic use cases.
 */
/* eslint-disable */
// ----------------------------------------------------------------------

export default function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
