import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  // Usuario: mínimo 4 letras
  static username(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value || value.trim().length < 4) {
      return { usernameInvalid: true };
    }
    return null;
  }

  // Email: Debe de poseer string + @ + string + . + extension
  static strictEmail(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!value || !emailRegex.test(value)) {
      return { emailInvalid: true };
    }
    return null;
  }

  // Contraseña: mínimo 6 caracteres, 1 mayus, 1 minus, 1 especial
  static strongPassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    if (!value || !pattern.test(value)) {
      return { passwordWeak: true };
    }
    return null;
  }

  // Nombre público: mínimo 4 caracteres
  static publicName(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value || value.trim().length < 4) {
      return { publicNameTooShort: true };
    }
    return null;
  }
}
