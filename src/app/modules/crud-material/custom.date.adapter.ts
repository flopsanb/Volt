import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

/**
 * Adaptador personalizado para el selector de fechas de Angular Material.
 * Establece el lunes como primer día de la semana.
 * Se proporciona en el módulo correspondiente.
 */

@Injectable()

export class CustomDateAdapter extends NativeDateAdapter {
    override getFirstDayOfWeek(): number {
        return 1;
    }
}
