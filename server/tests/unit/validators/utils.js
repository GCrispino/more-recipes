export function testValidator(validatorClass,validatorObj,validatorFunctionName, beforeAction = x => {}){
  const validator = new validatorClass(validatorObj);

  beforeAction(validator);

  const result = validator[validatorFunctionName]();

  const { errors } = validator;

  return [ validator, result, errors ];
}

export async function testValidatorAsync(validatorClass,validatorObj,validatorFunctionName, beforeAction = x => {}){
  const validator = new validatorClass(validatorObj);

  beforeAction(validator);

  const result = await validator[validatorFunctionName]();

  const { errors } = validator;

  return [ validator, result, errors ];
}