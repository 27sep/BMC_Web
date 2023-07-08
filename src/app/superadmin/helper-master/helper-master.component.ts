import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-helper-master',
  templateUrl: './helper-master.component.html',
  styleUrls: ['../../common.css','./helper-master.component.css']
})
export class HelperMasterComponent implements OnInit{
        isAdd: boolean = true
        isUpdate: boolean = false
        helperId:any
        helperIdProof:any
        wcId: any
        isActive: boolean = false
        constructor(private service: CommonService, private formBuilder: FormBuilder, private toastService: ToastService) {
                // this.getList()
                //this.getWCList()
        }
        ngOnInit(){
               this.service.getHelperByWcId().subscribe(
                data=>{
                        this.list=data
                }
               );
        }

        form = new FormGroup({
                helperId:new FormControl,
                helperName: new FormControl('', [Validators.required]),
                helperIdProof: new FormControl('', [Validators.required]),
                helperPhoto: new FormControl('', [Validators.required]),
                phoneNo: new FormControl('', [Validators.required]),
                address: new FormControl('', [Validators.required]),
                helperDesc: new FormControl,
                isActive: new  FormControl
              });
        editForm =new FormGroup({
                helperId:new FormControl,
                helperName: new FormControl,
                helperIdProof: new FormControl,
                helperPhoto: new FormControl,
                phoneNo: new FormControl,
                address: new FormControl,
                helperDesc: new FormControl,
                isActive: new FormControl
              });
        list: any = []
        //wcList: any = []

        // async getWCList() {
        //         try {
        //                 this.wcList = await this.service.get(`/zone/getAllWc`)
        //                 this.wcList = this.wcList.sort((a: any, b: any) => a.wcName - b.wcName)
        //         } catch (e) {
        //                 console.error(e)
        //         }
        // }
        // async getList() {
        //         try {
        //                 this.list = await this.service.get(`/zone/getAllHelper`)
        //                 this.list = this.list.sort((a: any, b: any) => a.helperName - b.helperName)
        //         } catch (e) {
        //                 console.error(e)
        //         }
        // }

        helperPhoto: any = null;

        handleFileSelectHelperPhoto(event: any) {
                const selectedFiles: any = event.target.files[0];
                this.helperPhoto = selectedFiles;
        }

        async addNew() {
                if (this.form.status === 'INVALID') {
                        const helperName = this.form.value.helperName?.trim();
                        if (!helperName) {
                                this.toastService.showWarning('Helper name is required.');
                                return;
                        }
                        const helperIDProof = this.form.value.helperIdProof?.trim();
                        if (!helperIDProof) {
                                this.toastService.showWarning('Helper ID Proof is required.');
                                return;
                        }
                        if (!this.helperPhoto) {
                                this.toastService.showWarning('Helper photo is required.');
                                return;
                        }
                        const phoneNo = this.form.value.phoneNo?.toString().trim();
                        if (!phoneNo) {
                                this.toastService.showWarning('Phone number is required.');
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
                                "wc":{"wcId":localStorage.getItem("wcId")},
                                "isActive": true
                        }
                        console.log(data)
                        await this.service.post(`/zone/addHelper`, data)
                        this.form.reset()
                        // this.getList()
                        this.service.getHelperByWcId().subscribe(
                                data=>{
                                        this.list=data
                                }
                               );
                } catch (e) {
                        console.error(e)
                }
        }
        async remove(id: string) {
                try {
                        const res = await this.service.get(`/helper/deactivate/${id}`)
                        //this.form.reset()
                        // this.getList()
                        this.service.getHelperByWcId().subscribe(
                                data=>{
                                        this.list=data
                                }
                               );
                } catch (e) {
                        console.error(e)
                }
        }
        updateData(item: any) {
                this.isUpdate = true
                this.isAdd = false
                console.log(item)
                this.helperId = item.helperId
                this.form.patchValue({
                        helperId:item.helperId,
                        helperName: item.helperName,
                        helperIdProof: item.helperIdProof,
                        // helperPhoto: item.helperPhoto,
                        phoneNo: item.phoneNo,
                        address: item.address,
                        helperDesc: item.helperDesc,
                        isActive: false
                })
               

        }
        cancel() {
                this.isAdd = true
                this.isUpdate = false
                this.form.reset()
        }

        updateHelper() {
                if (this.form.status === 'INVALID') {
                        const helperName = this.form.value.helperName?.trim();
                        if (!helperName) {
                                this.toastService.showWarning('Helper name is required.');
                                return;
                        }
                        const helperIDProof = this.form.value.helperIdProof?.trim();
                        if (!helperIDProof) {
                                this.toastService.showWarning('Helper ID Proof is required.');
                                return;
                        }
                        if (!this.helperPhoto) {
                                this.toastService.showWarning('Helper photo is required.');
                                return;
                        }
                        const phoneNo = this.form.value.phoneNo?.toString().trim();
                        if (!phoneNo) {
                                this.toastService.showWarning('Phone number is required.');
                                return;
                        }
                        const address = this.form.value.address?.trim();
                        if (!address) {
                                this.toastService.showWarning('Address is required.');
                                return;
                        }
                        return;
                }
                this.service.updateHelper(this.form.value).subscribe(
                        data => {
                                this.toastService.showSuccess("Helper data updated successfully!!")
                                this.isAdd = true
                                this.isUpdate = false
                                // this.getList()
                                this.service.getHelperByWcId().subscribe(
                                        data=>{
                                                this.list=data
                                        }
                                       );
                                this.form.reset()
                        },
                        error => {
                                this.toastService.showError("something went wrong")
                        }
                );

        }
}
