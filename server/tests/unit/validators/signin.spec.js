//@ts-check
import { testValidator,testValidatorAsync } from './utils';
import validators from '../../../validators'
const { SignInUserValidator } = validators;

const testSignInUserValidator = (validatorObj,validatorFunctionName,beforeAction) => 
  testValidator(SignInUserValidator,validatorObj,validatorFunctionName,beforeAction);

const testSignInUserValidatorAsync = (validatorObj,validatorFunctionName,beforeAction) => 
  testValidatorAsync(SignInUserValidator,validatorObj,validatorFunctionName,beforeAction);

describe('The SignInUserValidator class', () => {

  describe('The validateEmail function',() => {

    test('Should return invalid email error if email is invalid', async () => {
      const [ _,__,errors ] = await testSignInUserValidatorAsync({
        email: 'bademail@gmail'
      },'validateEmail');

      expect(errors).toEqual(['The email must be a valid email address.']);
    });

    test('Should return required error if email is empty', async () => {
      const [ _,__,errors ] = await testSignInUserValidatorAsync({},'validateEmail');

      expect(errors).toEqual(['The email is required.']);
    });
    
  });

  describe('The validatePassword function',() => {
    test('Should return required error if password is empty',() => {
      const [ _,__,errors ] = testSignInUserValidator({},'validatePassword');
  
      expect(errors).toEqual(['The password is required.']);
    });
  });

  describe('The isValid function',() => {

    test('Should fail when empty user is passed', async () => {
      const [ _,result ] = testSignInUserValidator({},'isValid');
  
      expect(result).toBe(false);
    });
    
    test('Should fail when user with invalid email is passed', async () => {
      const [ _,result ] = await testSignInUserValidatorAsync({
        email: 'test@test',
        password: '1234567'
      },'isValid');
  
      expect(result).toBe(false);
    });

    test('Should fail when user with no email is passed', async () => {
      const [ _,result ] = await testSignInUserValidatorAsync({
        password: '1234567'
      },'isValid');
  
      expect(result).toBe(false);
    });

    test('Should fail when user with no password is passed', async () => {
      const [ _,result ] = await testSignInUserValidatorAsync({
        email: 'test@test.com'
      },'isValid');
  
      expect(result).toBe(false);
    });

    test('Should be successful when user passes valid email and password', async () => {
      const [ _,result ] = await testSignInUserValidatorAsync({
        email: 'test@test.com',
        password: '1234567'
      },'isValid');
  
      expect(result).toBe(true);
    });

  });


});