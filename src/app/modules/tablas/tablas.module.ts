import { CategoriaCreateUpdateComponent } from './components/categorias/categoria-create-edit/categoria-create-update.component';
import { RouterModule } from '@angular/router';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { BlockTemplateComponent } from 'src/app/_layout/blockui/block-template.component';
import { BlockUIModule } from 'ng-block-ui';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { PartialsModule } from './../../content/partials/partials.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ClipboardModule } from 'ngx-clipboard';
import { NgbButtonsModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    CategoriasComponent,
    CategoriaCreateUpdateComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    BreadcrumbModule,
    NgxDatatableModule,
    PerfectScrollbarModule,
    PartialsModule,
    ReactiveFormsModule,
    ClipboardModule,
    NgbModule,
    NgbButtonsModule,
    NgSelectModule,
    UiSwitchModule,
    
    BlockUIModule.forRoot({
      template: BlockTemplateComponent
    }),

    RouterModule.forChild([
      {
        path: 'categorias', component: CategoriasComponent
      },
      {
        path: 'categorias-create-update/:id', component: CategoriaCreateUpdateComponent
      }
    ]),


  ],
  providers: [
    DatePipe
  ]
})
export class TablasModule { }
