const { Router } = require('express')
const { throwError, checkUnavailableField, checkWrongFieldType, checkMissingRuleFields, checkMissingDataField } = require('../helper')
const _ = require('lodash')

const router = Router()

router.get('/', (req, res, next) => {
    try {
        const data = {
            message: "My Rule-Validation API",
            status: "success",
            data: {
              name: "Omoruyi Isaac",
              github: "@Omoruyis",
              email: "omoruyi.isaac97@gmail.com",
              mobile: "09064659247",
              twitter: "@omoruyi_"
            }
        }

        res.status(200).send(data)
    } catch (e) {
        next({ statusCode: 400, message: e.message, data: null, status: 'error' })
    }
})

router.post('/validate-rule', (req, res, next) => {

    try {
        const body = _.pick(req.body, ['rule', 'data'])

         // check if a required field isn't passed
        checkUnavailableField(body)
        
        // check if a field is of the wrong type
        checkWrongFieldType(body)

        // check if field(s) in the rule field is/are missing
        checkMissingRuleFields(body.rule)

        // check if field specified in the rule object is missing from the data passed
        checkMissingDataField(body.data, body.rule.field)

        // check validation
        let result

        if (body.rule.condition == 'eq') {
            result = body.data[body.rule.field] === body.rule.condition_value
        } else if(body.rule.condition == 'neq') {
            result = body.data[body.rule.field] !== body.rule.condition_value
        } else if(body.rule.condition == 'gt') {
            result = body.data[body.rule.field] > body.rule.condition_value
        } else if(body.rule.condition == 'gte') {
            result = body.data[body.rule.field] >= body.rule.condition_value
        } else if(body.rule.condition == 'contains') { 
            result = (typeof body.data[body.rule.field]) == 'number' ? body.data[body.rule.field].toString().includes(body.rule.condition_value) : body.data[body.rule.field].includes(body.rule.condition_value) 
        } else {
            result = null
        }

        if (result == null) {
            throwError('please put a valid condition.', 'error', null, 400)
        }

        const response = {
            message: `field ${body.rule.field} ${result ? 'successfully validated' : 'failed validation'}.`,
            status: result ? 'success' : 'error',
            data: {
                validation: {
                    error: !result,
                    field: body.rule.field,
                    field_value: body.data[body.rule.field],
                    condition: body.rule.condition,
                    condition_value: body.rule.condition_value
                }
            }
        }


        res.status(result ? 200 : 400).send(response)

    } catch(e) {
        next(e)
    }
})


module.exports = {
    router
}