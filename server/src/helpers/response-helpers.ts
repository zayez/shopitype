import { ValidationErrorItem } from 'joi'

/**
 * Formats joi validation error details into a Problem Details JSON response.
 * See: https://www.rfc-editor.org/rfc/rfc7807#section-3
 * @param {array} details joi error details
 * @returns problem json details object
 */
const formatValidations = (
  errorsDetails: ValidationErrorItem[],
): { [key: string]: unknown } => {
  return {
    'invalid-params': errorsDetails.map((item) => ({
      name: item.path[0],
      reason: item.message.replace('/', ''),
    })),
  }
}

export { formatValidations }
