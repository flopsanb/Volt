import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { AllEnterprisesRoutingModule } from './all-enterprises-routing.module';
import { CrudMaterialModule } from 'src/app/modules/crud-material/crud-material.module';
import { AddEnterpriseComponent } from './add-enterprise/add-enterprise.component';
import { EnterprisesDetailsModule } from './enterprises-details/enterprises-details.module';
import { DeleteEnterpriseComponent } from './delete-enterprise/delete-enterprise.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { AllEnterprisesComponent } from './all-enterprises.component';

@NgModule({
  declarations: [
    AddEnterpriseComponent, 
    DeleteEnterpriseComponent,
    AllEnterprisesComponent,
],imports: 
  [
    CommonModule,
    AllEnterprisesRoutingModule,
    CrudMaterialModule,
    ReactiveFormsModule,
    EnterprisesDetailsModule,
    MaterialModule,
    FormsModule
  ],
  exports: [
    EnterprisesDetailsModule
  ]
})
export class AllEnterprisesModule { }