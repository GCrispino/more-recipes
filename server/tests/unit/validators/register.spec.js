import validators from '../../../validators'
import { User } from '../../../database/models'

const { RegisterUserValidator } = validators;


describe('The RegisterUserValidator class',() => {
  describe('The validateName function', () => {

    test('The validateName function adds a required error to the errors array if name is not provided', () => {

      const validator = new RegisterUserValidator({});

      validator.validateName();

      const { errors } = validator;

      expect(errors).toEqual(['The name is required.'])
    });

    test('Adds an error if name is less than 5 characters', () => {
      const validator = new RegisterUserValidator({
        name: 'test'
      });
      validator.validateName();

      const { errors } = validator;

      expect(errors).toEqual(['The name must be longer than 5 characters.'])

    });
  });

  describe('The validatePassword function', () => {

    test('The validatePassword function adds a required error to the errors array if password is not provided', () => {

      const validator = new RegisterUserValidator({});

      validator.validatePassword();

      const { errors } = validator;

      expect(errors).toEqual(['The password is required.'])
    });

    test('Adds an error if password is less than 5 characters', () => {
      const validator = new RegisterUserValidator({
        password: 'test'
      });
      validator.validatePassword();

      const { errors } = validator;

      expect(errors).toEqual(['The password must be longer than 5 characters.'])

    });
  });


  describe('The validateEmail function',() => {

    test('Adds a required error to the errors array if email is not provided',async () => {
      const validator = new RegisterUserValidator({
        name: 'test'
      });

      await validator.validateEmail();

      const { errors } = validator;

      expect(errors).toEqual(['The email is required.'])
      
    });

    test('Adds an error if email is invalid', async () => {
      const validator = new RegisterUserValidator({
        name: 'test',
        email: 'testing'
      });

      await validator.validateEmail();

      const { errors } = validator;

      expect(errors).toEqual(['The email must be a valid email address.'])
    });

    test('Adds an email taken error if user already exists with that email', async () => {
      await User.destroy({ where: {} });

      await User.create({
        name: 'bahdcoder',
        email: 'bahdcoder@gmail.com',
        password: 'password'
      });

      const validator = new RegisterUserValidator({
        email: 'bahdcoder@gmail.com'
      })

      const { errors } = validator;

      await validator.validateEmail();
      
      expect(errors).toEqual(['A user with this email already exists.']);

    })

  });

  describe('The isValid function', () => {

    test('Returns true if validation passes', async () => {

      await User.destroy({ where: {} });

      const validator = new RegisterUserValidator({
        name: 'bahdcoder',
        email: 'bahdcoder@gmail.com',
        password: 'password'
      });

      const result = await validator.isValid();

      expect(result).toBe(true);
      
    });

    test('Returns false if validation passes', async () => {

      await User.destroy({ where: {} });

      const validator = new RegisterUserValidator({
        name: 'bahd',
        email: 'bahdcoder@gmail.com',
        password: 'password'
      });

      const result = await validator.isValid();

      expect(result).toBe(false);
      
    });

    test('The validateName, validateEmail and validatePassword functions are called in the isValid function', async () => {
      const validator = new RegisterUserValidator({
        name: 'test',
        password: 'pass',
        email: 'bahdcoder@gmail'
      });

      jest.spyOn(validator,'validateName');
      jest.spyOn(validator,'validateEmail');
      jest.spyOn(validator,'validatePassword');

      await validator.isValid();

      expect(validator.validateName).toHaveBeenCalled();
      expect(validator.validateEmail).toHaveBeenCalled();
      expect(validator.validatePassword).toHaveBeenCalled();
    });

  });

});