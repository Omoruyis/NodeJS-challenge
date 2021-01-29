const throwError = (message, status, data, statusCode) => {
    throw { message, status, data, statusCode }
}

const checkUnavailableField = (body) => {
    let unavalible = []

    !body.hasOwnProperty('rule') && (unavalible.push('rule')) 
    !body.hasOwnProperty('data') && (unavalible.push('data'))

    if (body.rule && Object.prototype.toString.call(body.rule) === '[object Object]') {
        !body.rule.hasOwnProperty('field') && (unavalible.push('field')) 
        !body.rule.hasOwnProperty('condition') && (unavalible.push('condition'))
        !body.rule.hasOwnProperty('condition_value') && (unavalible.push('condition_value'))
    }
    
    if (unavalible.length) {
        var text = unavalible.reduce((a, b, i) => {
            return `${a}${i === (unavalible.length - 1) ? ' and' : ','} ${b}`
        })
        throwError(`${text} ${unavalible.length == 1 ? 'is' : 'are'} required.`, 'error', null, 400)
    }
}

const checkWrongFieldType = (body) => {
    if (Object.prototype.toString.call(body.rule) !== '[object Object]') {
        throwError('rule should be an object.', 'error', null, 400)
    }

    if (Object.prototype.toString.call(body.data) !== '[object Object]' && typeof body.data !== 'string' && !Array.isArray(body.data)) {
        throwError('data should be an object, an array, or a string.', 'error', null, 400)
    }
}

const checkMissingDataField = (data, field) => {
    !data[field] && throwError(`field ${field} is missing from data.`, 'error', null, 400)
}

module.exports = {
    throwError,
    checkUnavailableField,
    checkWrongFieldType,
    checkMissingDataField
}