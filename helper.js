const throwError = (message, status, data, statusCode) => {
    throw { message, status, data, statusCode }
}

const checkUnavailableField = (body) => {
    let unavalible = []

    !body.hasOwnProperty('rule') && (unavalible.push('rule')) 
    !body.hasOwnProperty('data') && (unavalible.push('data'))
    
    if (unavalible.length) {
        throwError(`${unavalible.join(', ')} ${unavalible.length == 1 ? 'is' : 'are'} required.`, 'error', null, 400)
    }
}

const checkWrongFieldType = (body) => {
    if (Object.prototype.toString.call(body.rule) !== '[object Object]') {
        throwError('rule should be an object.', 'error', null, 400)
    }

    if (Object.prototype.toString.call(body.data) !== '[object Object]' && typeof body.data !== 'string' && !Array.isArray(body.data)) {
        throwError('data should be an object, a string, or an array.', 'error', null, 400)
    }
}

const checkMissingRuleFields = (data) => {
    let missingRuleFields = []

    !data.hasOwnProperty('field') && (missingRuleFields.push('field')) 
    !data.hasOwnProperty('condition') && (missingRuleFields.push('condition'))
    !data.hasOwnProperty('condition_value') && (missingRuleFields.push('condition_value'))

    if (missingRuleFields.length) {
        throwError(`${missingRuleFields.join(', ')} ${missingRuleFields.length == 1 ? 'is' : 'are'} missing from the rule field.`, 'error', null, 400)
    }
}

const checkMissingDataField = (data, field) => {
    !data[field] && throwError(`field ${field} is missing from data.`, 'error', null, 400)
}

module.exports = {
    throwError,
    checkUnavailableField,
    checkWrongFieldType,
    checkMissingRuleFields,
    checkMissingDataField
}