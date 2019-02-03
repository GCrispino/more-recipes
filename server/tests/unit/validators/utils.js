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

export const testValidatorFactory = validatorClass => (validatorObj,validatorFunctionName,beforeAction) => 
  testValidator(validatorClass,validatorObj,validatorFunctionName,beforeAction);

export const testValidatorFactoryAsync = validatorClass => (validatorObj,validatorFunctionName,beforeAction) => 
  testValidatorAsync(validatorClass,validatorObj,validatorFunctionName,beforeAction);
