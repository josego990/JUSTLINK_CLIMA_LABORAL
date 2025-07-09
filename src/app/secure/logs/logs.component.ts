import { Component, OnInit, ViewChild } from '@angular/core';
import {
  DatatableComponent,
  SortType,
  NgxDatatableModule,
} from '@swimlane/ngx-datatable';

import { NgxDatableLogs } from './ngx-datatablelogs.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule, DatePipe, formatDate, NgClass } from '@angular/common';
import { rowsAnimation, TableExportUtil } from '@shared';
@Component({
    selector: 'app-ngx-logs',
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.scss'],
    imports: [
        BreadcrumbComponent,
        MatButtonModule,
        MatIconModule,
        NgxDatatableModule,
        MatFormFieldModule,
        MatInputModule,MatTableModule,
        CommonModule
    ]
})
export class LogsComponent implements OnInit {

  data = new MatTableDataSource<NgxDatableLogs>([]);

  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;
  rows = [];
  selectedRowData?: selectRowInterface;
  newUserImg = 'assets/images/user/user1.jpg';
  //data: NgxDatableLogs[] = [];
  dataSource = new MatTableDataSource<NgxDatableLogs>([]);
  filteredData: NgxDatableLogs[] = [];

  selectedOption?: string;
  SortType = SortType;
 

  columnDefinitions = [
    { def: 'Id',            label: 'ID',             type: 'number',   visible: true },
    { def: 'Canal',         label: 'Canal',          type: 'text',     visible: true },
    { def: 'DatosEnviados', label: 'Datos enviados', type: 'text',     visible: true },
    { def: 'DetalleError',  label: 'Detalle error',  type: 'text',     visible: true },
    { def: 'Exitoso',       label: 'Exitoso',        type: 'boolean',  visible: true },
    { def: 'FechaIntento',  label: 'Fecha intento',  type: 'datetime', visible: true },
    { def: 'NombreFlujo',   label: 'Nombre flujo',   type: 'text',     visible: true },
    { def: 'Resultado',     label: 'Resultado',      type: 'text',     visible: true },
  ];

  constructor(
    
  ) {
  
  }
  ngOnInit() {

    this.fetch((data) => {
      this.dataSource.data = data;
    });
   
  }

  fetch(cb: (i: NgxDatableLogs[]) => void) {

    const req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:3030/get-logs');
    req.onload = () => {
      const data = JSON.parse(req.response);
      console.log('LOGS:: ', data);
      cb(data.data);
    };
    req.send();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  getLabel(def: string): string {
    return this.columnDefinitions.find(c => c.def === def)?.label ?? def;
  }

   exportExcel() {
    const exportData = this.dataSource.data.map((x: any) => ({
      Id:         x.Id,
      Canal:       x.Canal,
      DatosEnviados:        x.DatosEnviados,
      DetalleError:           x.DetalleError,
      Exitoso:     x.Exitoso ? 'Yes' : 'No',
      FechaIntento:    formatDate(x.FechaIntento, 'yyyy-MM-dd HH:mm:ss', 'en'),
      
      NombreFlujo:       x.NombreFlujo,
      Resultado:        x.Resultado
     
    }));
    TableExportUtil.exportToExcel(exportData, 'Logs');
   }

   
    editCall(row: any) {
       console.log('ROW::', row);
       //this.openDialog('edit', row);
     }

 


 
}
export interface selectRowInterface {
  img: string;
  firstName: string;
  lastName: string;
}
