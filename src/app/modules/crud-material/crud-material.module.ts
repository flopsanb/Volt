import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Módulos de Angular Material utilizados en la aplicación
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

// Adaptador personalizado para establecer el lunes como primer día de la semana en los calendarios
import { CustomDateAdapter } from './custom.date.adapter';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    // Exporta todos los módulos de Angular Material y formularios
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatCardModule,
    MatSortModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatStepperModule,
    MatRadioModule,
    MatIconModule,
    FormsModule
  ],
  // Configuración de proveedores globales para los componentes de Angular Material
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter }, // Usa el adaptador personalizado para definir el inicio de semana
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },       // Establece el idioma local de los componentes de fecha
  ]
})

export class CrudMaterialModule { }
