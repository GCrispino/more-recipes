//@ts-check
import validators from '../../../validators'
const { SignInUserValidator } = validators;


describe('The SignInUserValidator class', () => {

  describe('The validateEmail function',() => {

    test('Should return invalid email error if email is invalid', async () => {

      const validator = new SignInUserValidator({
        email: 'bademail@gmail'
      });

      await validator.validateEmail();

      const { errors } = validator;

      expect(errors).toEqual(['The email must be a valid email address.']);
    });

    test('Should return required error if email is empty', async () => {
      const validator = new SignInUserValidator({});

      await validator.validateEmail();

      const { errors } = validator;

      expect(errors).toEqual(['The email is required.']);
    });
    
  });

  describe('The validatePassword function',() => {
    test('Should return required error if password is empty',() => {
      const validator = new SignInUserValidator({});
  
      validator.validatePassword();
  
      const { errors } = validator;
  
      expect(errors).toEqual(['The password is required.']);
    });
  });

  describe('The isValid function',() => {

    test('Should fail when empty user is passed', async () => {
      const validator = new SignInUserValidator({});
  
      const result = await validator.isValid();
  
      expect(result).toBe(false);
    });
    
    test('Should fail when user with invalid email is passed', async () => {
      const validator = new SignInUserValidator({
        email: 'test@test',
        password: '1234567'
      });
  
      const result = await validator.isValid();
  
  
      expect(result).toBe(false);
    });

    test('Should fail when user with no email is passed', async () => {
      const validator = new SignInUserValidator({
        password: '1234567'
      });
  
      const result = await validator.isValid();
  
  
      expect(result).toBe(false);
    });

    test('Should fail when user with no password is passed', async () => {
      const validator = new SignInUserValidator({
        email: 'test@test.com'
      });
  
      const result = await validator.isValid();
  
  
      expect(result).toBe(false);
    });

    test('Should be successful when user passes valid email and password', async () => {
      const validator = new SignInUserValidator({
        email: 'test@test.com',
        password: '1234567'
      });
  
      const result = await validator.isValid();
  
  
      expect(result).toBe(true);
    });

  });


});