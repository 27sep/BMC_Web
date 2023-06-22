import { Component } from '@angular/core';
import { ReactiveFormsModule,FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-driver-master',
  templateUrl: './driver-master.component.html',
  styleUrls: ['../../common.css','./driver-master.component.css']
})
export class DriverMasterComponent {
        isAdd: boolean = true
        isUpdate: boolean = false
        driverId:any
        wcId: any
        constructor(private service: CommonService, private formBuilder: FormBuilder, private toastService: ToastService) {
                this.getList()
                this.getWCList()
        }

        form = new FormGroup({
                driverId: new FormControl,
                driverName: new FormControl('', [Validators.required]),
                driverPhoto: new FormControl('', [Validators.required]),
                phoneNo: new FormControl('', [Validators.required]),
                dlNo: new FormControl('', [Validators.required]),
                dlExpiry: new FormControl('', [Validators.required]),
                dlPhoto: new FormControl('', [Validators.required]),
                address: new FormControl('', [Validators.required]),
                dlDesc: new FormControl
              });
        editForm =new FormGroup({
                driverId: new FormControl(''),
                driverName: new FormControl(''),
                driverPhoto: new FormControl(''),
                phoneNo: new FormControl(''),
                dlNo: new FormControl(''),
                dlExpiry: new FormControl(''),
                dlPhoto: new FormControl(''),
                address: new FormControl(''),
                dlDesc: new FormControl('')
              });
        list: any = []
        wcList: any = []

        async getWCList() {
                try {
                        this.wcList = await this.service.get(`/zone/getAllWc`)
                        this.wcList = this.wcList.sort((a: any, b: any) => a.wcName - b.wcName)
                } catch (e) {
                        console.error(e)
                }
        }
        async getList() {
                try {
                        this.list = await this.service.get(`/zone/getAllDriver`)
                        this.list = this.list.sort((a: any, b: any) => a.driverName - b.driverName)
                } catch (e) {
                        console.error(e)
                }
        }

        driverPhoto: any = null;
        dlPhoto: any = null;

        handleFileSelectDriverPhoto(event: any): void {
                const selectedFiles: any = event.target.files[0];
                this.driverPhoto = selectedFiles;
        }

        handleFileSelectDrivingLicencePhoto(event: any): void {
                const selectedFiles: any = event.target.files[0];
                this.dlPhoto = selectedFiles;
        }

        async addNew() {
                if (this.form.status === 'INVALID') {
                        const driverName = this.form.value.driverName?.trim();
                        if (!driverName) {
                                this.toastService.showWarning('Driver name is required.');
                                return;
                        }
                        const dlNumber = this.form.value.dlNo?.trim();
                        if (!dlNumber) {
                                this.toastService.showWarning('DL number is required.');
                                return;
                        }
                        if (!this.driverPhoto) {
                                this.toastService.showWarning('Driver photo is required.');
                                return;
                        }
                        if (!this.dlPhoto) {
                                this.toastService.showWarning('DL photo is required.');
                                return;
                        }
                        const phoneNo = this.form.value.phoneNo?.toString().trim();
                        if (!phoneNo) {
                                this.toastService.showWarning('Phone number is required.');
                                return;
                        }
                        const dlExpiry = this.form.value.dlExpiry?.trim();
                        if (!dlExpiry) {
                                this.toastService.showWarning('DL expiry date is required.');
                                return;
                        }
                        const address = this.form.value.address?.trim();
                        if (!address) {
                                this.toastService.showWarning('Address is required.');
                                return;
                        }
                        return;
                }
                try {
                        const data = {
                                ...this.form.value,
                                "status": true
                        }
                        console.log(data)
                        await this.service.post(`/zone/addDriver`, data)
                        this.form.reset()
                        this.getList()
                } catch (e) {
                        console.error(e)
                }
        }
        async remove(id: string) {
                try {
                        const res = await this.service.delete(`/zone/deleteDriver/${id}`)
                        this.getList()
                } catch (e) {
                        console.error(e)
                }
        }
        updateData(item: any) {
                this.isUpdate = true
                this.isAdd = false
                console.log(item)
                this.driverId = item.driverId
                this.form.patchValue({
                        driverId: item.driverId,
                        driverName: item.driverName,
                        driverPhoto: item.driverPhoto,
                        phoneNo: item.phoneNo,
                        dlNo: item.dlNo,
                        dlExpiry: item.dlExpiry,
                        dlPhoto: item.dlPhoto,
                        address: item.address,
                        dlDesc: item.dlDesc
                })
                this.wcId=this.wcList.wcId
                // this.service.getZoneAllData().subscribe(
                //         async data => {
                //                 this.goodsList = await this.service.get(`/zone/getAllGoods`)
                //         }
                // );

        }
        cancel() {
                this.isAdd = true
                this.isUpdate = false
                this.form.reset()
        }

        updateDriver() {
                if (this.form.status === 'INVALID') {
                        const driverName = this.form.value.driverName?.trim();
                        if (!driverName) {
                                this.toastService.showWarning('Driver name is required.');
                                return;
                        }
                        const dlNumber = this.form.value.dlNo?.trim();
                        if (!dlNumber) {
                                this.toastService.showWarning('DL number is required.');
                                return;
                        }
                        if (!this.driverPhoto) {
                                this.toastService.showWarning('Driver photo is required.');
                                return;
                        }
                        if (!this.dlPhoto) {
                                this.toastService.showWarning('DL photo is required.');
                                return;
                        }
                        const phoneNo = this.form.value.phoneNo?.toString().trim();
                        if (!phoneNo) {
                                this.toastService.showWarning('Phone number is required.');
                                return;
                        }
                        const dlExpiry = this.form.value.dlExpiry?.trim();
                        if (!dlExpiry) {
                                this.toastService.showWarning('DL expiry date is required.');
                                return;
                        }
                        const address = this.form.value.address?.trim();
                        if (!address) {
                                this.toastService.showWarning('Address is required.');
                                return;
                        }
                        return;
                }
                this.service.updateDriver(this.form.value).subscribe(
                        data => {
                                this.toastService.showSuccess("SubGood data updated successfully!!")
                                this.isAdd = true
                                this.isUpdate = false
                                this.getList()
                                this.form.reset()
                        },
                        error => {
                                this.toastService.showError("something went wrong")
                        }
                );

        }
}
