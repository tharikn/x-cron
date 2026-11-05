import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import {
  isSafePlainText,
  isValidXcronEmail,
  isValidXcronPhone,
  isValidXcronPincode,
  isValidXcronSalary,
  isValidXcronUrl,
  MSG,
} from './patterns';

function optionalOk(value: unknown): boolean {
  return value === undefined || value === null || value === '';
}

@ValidatorConstraint({ name: 'isXcronEmail', async: false })
export class IsXcronEmailConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (optionalOk(value)) return true;
    return typeof value === 'string' && isValidXcronEmail(value);
  }
  defaultMessage(): string {
    return MSG.email;
  }
}

export function IsXcronEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsXcronEmailConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isXcronPhone', async: false })
export class IsXcronPhoneConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (optionalOk(value)) return true;
    return typeof value === 'string' && isValidXcronPhone(value);
  }
  defaultMessage(): string {
    return MSG.phone;
  }
}

export function IsXcronPhone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsXcronPhoneConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isXcronPincode', async: false })
export class IsXcronPincodeConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (optionalOk(value)) return true;
    return typeof value === 'string' && isValidXcronPincode(value);
  }
  defaultMessage(): string {
    return MSG.pincode;
  }
}

export function IsXcronPincode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsXcronPincodeConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isXcronSalaryText', async: false })
export class IsXcronSalaryTextConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (optionalOk(value)) return true;
    return typeof value === 'string' && isValidXcronSalary(value);
  }
  defaultMessage(): string {
    return MSG.salary;
  }
}

export function IsXcronSalaryText(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsXcronSalaryTextConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isXcronUrl', async: false })
export class IsXcronUrlConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (optionalOk(value)) return true;
    return typeof value === 'string' && isValidXcronUrl(value);
  }
  defaultMessage(): string {
    return MSG.url;
  }
}

export function IsXcronUrl(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsXcronUrlConstraint,
    });
  };
}

type SafeTextOpts = {
  max?: number;
  allowNewlines?: boolean;
};

@ValidatorConstraint({ name: 'isSafeText', async: false })
export class IsSafeTextConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    if (optionalOk(value)) return true;
    if (typeof value !== 'string') return false;
    const opts = (args.constraints[0] ?? {}) as SafeTextOpts;
    return isSafePlainText(value, {
      allowNewlines: opts.allowNewlines ?? false,
      max: opts.max,
    });
  }
  defaultMessage(): string {
    return MSG.safeText;
  }
}

export function IsSafeText(
  opts: SafeTextOpts = {},
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [opts],
      validator: IsSafeTextConstraint,
    });
  };
}
