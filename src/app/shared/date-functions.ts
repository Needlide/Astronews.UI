// check if the input is an ISO8601 date format (yyyy-MM-dd)
export function isISO8601Date(dateString: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

// transform Date object to an ISO8601 format (yyyy-MM-dd)
export function convertDateToString(givenDate: Date): string {
  let year = givenDate.getFullYear().toString();
  let month = String(givenDate.getMonth() + 1).padStart(2, '0');
  let day = String(givenDate.getDate()).padStart(2, '0');

  let yearString = `${year}-${month}-${day}`;

  return yearString;
}

/**
 * Subtracts one day from the provided Date object and returns the modified date.
 *
 * This function creates a new Date object from the input, subtracts one day, and returns the modified Date object.
 *
 * @param {Date} date - The Date object from which one day will be subtracted.
 * @returns {Date} A new Date object representing the date one day earlier than the input.
 */
export function subtractDayFromDate(date: Date): Date {
  let dateLocal = new Date(date);
  dateLocal.setDate(dateLocal.getDate() - 1);
  return dateLocal;
}

/**
 * Subtracts one month from the provided Date object and returns the modified date.
 *
 * This function creates a new Date object from the input, subtracts one month, and returns the modified Date object.
 *
 * @param {Date} date - The Date object from which one month will be subtracted.
 * @returns {Date} A new Date object representing the date one month earlier than the input.
 */
export function subtractMonthFromDate(date: Date): Date {
  let dateLocal = new Date(date);
  dateLocal.setMonth(dateLocal.getMonth() - 1);
  return dateLocal;
}

/**
 * Adds one month to the provided Date object and returns the modified date.
 *
 * This function creates a new Date object from the input, adds one month, and returns the modified Date object.
 *
 * @param {Date} date - The Date object to which one month will be added.
 * @returns {Date} A new Date object representing the date one month later than the input.
 */
export function addMonthToDate(date: Date): Date {
  let dateLocal = new Date(date);
  dateLocal.setMonth(dateLocal.getMonth() + 1);
  return dateLocal;
}
