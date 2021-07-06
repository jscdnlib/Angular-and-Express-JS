import { Component, OnInit } from '@angular/core';
import { KaryawanService } from 'src/app/services/karyawan.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './karyawan-list.component.html',
  styleUrls: ['./karyawan-list.component.css']
})

export class KaryawanListComponent implements OnInit {
  semuakaryawan: any;
  submitted = false;

  karyawan = {
    nama: '',
    alamat: '',
    tgllahir: '',
    divisi: '',
    status:''
  };

  edit = {
    nik:'',
    nama: '',
    alamat: '',
    divisi:'',
    tgllahir: '',
    status:'',
  };

  ngbDate:any; 

  closeResult = '';
  modalReference: any;
  constructor(
    private karyawanService: KaryawanService,
    private modalService: NgbModal,
    private ngbDateParserFormatter: NgbDateParserFormatter
    ) { }

  ngOnInit(): void {
    this.tampilkanSemuaKaryawan();
  }

  tampilkanSemuaKaryawan(): void {
    this.karyawanService.getAll()
      .subscribe(
        data => {
          this.semuakaryawan = data;
          console.log("data is ", data);
        },
        error => {
          console.log(error);
        });
  }

  simpanKaryawan():void {
    let myDate = this.ngbDateParserFormatter.format(this.ngbDate);
    const data = {
      nama: this.karyawan.nama,
      alamat: this.karyawan.alamat,
      tgllahir: myDate,
      divisi: this.karyawan.divisi,
      status: this.karyawan.status,
    };

    this.karyawanService.create(data)
      .subscribe(
        response => {
          console.log(response);
          this.ngOnInit();
          this.modalService.dismissAll();
        },
        error => {
          console.log(error);
        });    
  }


  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = 'Dismissed';
    });
  }

  editKaryawan(content:any, data:any) {
    const activeModal = this.modalService.open(content, { size: 'lg' });
    this.edit.nik = data.nik; 
    this.edit.nama = data.nama; 
    this.edit.alamat = data.alamat; 
    this.edit.tgllahir = data.tgllahir; 
    this.edit.status = data.status; 
    this.edit.divisi = data.nik.substring(0,2);
  }


  updateKaryawan():void {
    let myDate = this.ngbDateParserFormatter.format(this.ngbDate);
    const updatedata = {
      nama: this.edit.nama,
      alamat: this.edit.alamat,
      tgllahir: myDate,
      status: this.edit.status,
      nik:this.edit.nik
    };

    console.log("updatedata ", updatedata); 

    this.karyawanService.update(updatedata)
      .subscribe(
        response => {
          console.log(response);
          this.modalService.dismissAll();
          this.ngOnInit();
        },
        error => {
          console.log(error);
        });    
  }


  deleteKaryawan(nik:any):void {
    if(confirm("Anda ingin menghapus karyawan dengan NIK "+nik)) {
      this.karyawanService.delete({nik:nik})
        .subscribe(
          response => {
            console.log(response);
            this.ngOnInit();
          },
          error => {
            console.log(error);
          });    
    }
  }

}
