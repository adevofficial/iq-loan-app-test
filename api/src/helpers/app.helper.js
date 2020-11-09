import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';
import merge from 'lodash/merge';
import assign from 'lodash/assign';
import { isFunction } from 'lodash';
import { logger } from './../bootstrap/logger';
import createError from 'http-errors';

export function execute(controller, validator) {
  return async function (req, res, next) {
    try {
      let data = {};
      if (validator) {
        data = await validator.validate(req.body, { stripUnknown: true });
      }

      const response = controller(data);

      res.send({ success: true, data: response });
    } catch (error) {
      res.send({ success: false, error: { message: error.message } });
    }
  };
}

export function executeAsync(controller, validator) {
  return async function (req, res, next) {
    try {
      let data = { ...req.body, ...req.params, ...req.query };

      if (!isEmpty(req.files)) data['files'] = req.files;
      if (!isEmpty(req.file)) data['file'] = req.file;

      try {
        if (!isEmpty(validator)) {
          if (isArray(validator)) {
            data = await Promise.all(
              validator.map((single) =>
                single.validate(data, { stripUnknown: true })
              )
            );
            data = merge.apply(this, flatten(data));
          } else {
            data = await validator.validate(data, { stripUnknown: true });
          }
        }
      } catch (error) {
        throw createError(400, error);
      }

      const response = await controller(data, req, res);

      if (isFunction(response)) {
        res.send({ success: true, ...response() });
      } else {
        res.send({ success: true, data: response });
      }
    } catch (error) {
      next(error);
    }
  };
}
