import { Component, OnInit } from '@angular/core';
import { CobrosService } from 'src/app/servicesComponents/cobros.service';
import { MatDialog } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { FormcobrosComponent } from '../../form/formcobros/formcobros.component';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const swal: any;
declare const $: any;

@Component({
  selector: 'app-cobros',
  templateUrl: './cobros.component.html',
  styleUrls: ['./cobros.component.scss']
})
export class CobrosComponent implements OnInit {

  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {};
  Header:any = [ 'Acciones','Monto','Método de pago','Fecha Cobro','Cédula','Celular','Cuenta Bancaria','Fecha Pago','Estado' ];
  $:any;
  public datoBusqueda = '';

  constructor(
    private _cobros: CobrosService,
    public dialog: MatDialog,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.cargarTodos();
  }

  crear(obj:any){
    const dialogRef = this.dialog.open(FormcobrosComponent,{
      width: '461px',
      data: {datos: obj || {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  delete(obj:any, idx:any){
    this._cobros.delete(obj).subscribe((res:any)=>{
      this.dataTable.dataRows.splice(idx, 1);
      this._tools.presentToast("Eliminado")
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor") })
  }




  cargarTodos() {
    this._cobros.get(this.query)
    .subscribe(
      (response: any) => {
        console.log(response);
        this.dataTable = {
          headerRow: this.Header,
          footerRow: this.Header,
          dataRows: []
        };
        this.dataTable.headerRow = this.dataTable.headerRow;
        this.dataTable.footerRow = this.dataTable.footerRow;
        this.dataTable.dataRows = response.data;
        this.paginas = Math.ceil(response.count/10);
        this.loader = false;
        setTimeout(() => {
          this.config();
          console.log("se cumplio el intervalo");
        }, 500);
      },
      error => {
        console.log('Error', error);
      });
  }
  config() {
    if(!this.$)return false;
    $('#datatables').DataTable({
      "pagingType": "full_numbers",
      "lengthMenu": [
        [10, 25, 50, -1],
        [10, 25, 50, "All"]
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Buscar",
      }

    });

    const table = $('#datatables').DataTable();

    /* // Edit record
    table.on('click', '.edit', function (e) {
      let $tr = $(this).closest('tr');
      if ($($tr).hasClass('child')) {
        $tr = $tr.prev('.parent');
      }

      var data = table.row($tr).data();
      alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
      e.preventDefault();
    }); */

    /* // Delete a record
    table.on('click', '.remove', function (e) {
      const $tr = $(this).closest('tr');
      table.row($tr).remove().draw();
      e.preventDefault();
    }); */

    //Like record
    table.on('click', '.like', function (e) {
      alert('You clicked on Like button');
      e.preventDefault();
    });

    $('.card .material-datatables label').addClass('form-group');
  }
  buscar() {
    this.loader = true;
    //console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    if (this.datoBusqueda === '') {
      this.cargarTodos();
    } else {
      this.query.where.or = [
        {
          cat_nombre: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          cat_descripcion: {
            contains: this.datoBusqueda|| ''
          }
        },
      ];
      this.cargarTodos();
    }
  }

}