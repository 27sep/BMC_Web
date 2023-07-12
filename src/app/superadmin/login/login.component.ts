import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginReq } from 'src/app/model/pit.model';
import { LoginModel, UserInfo } from 'src/app/model/user.model';
import { CommonService } from 'src/app/service/common.service';
import { ToastService } from 'src/app/service/toast.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public showPassword: Boolean= false;
  checkagreeterms: any;
    
    constructor(private toastr: ToastrService, private service: CommonService,private route:Router, private toastService: ToastService) {}
  loginResponse:any
  form = new FormGroup({
    emailId: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  public logindata:any;

  public loginPayload: LoginReq = {
    email: '',
    password: '',
    hasTermsChecked: true
  };
  

  ngOnInit(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    localStorage.removeItem('logindetails');
    localStorage.clear();
  }

  validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
 /**
   * Function used to call Bakend Login service
   */
 public doLogin(): void {

  const email: any = this.form.value.emailId?.trim();
  const password: any = this.form.value.password?.trim();

  if (this.form.status === 'INVALID') {
    if (!email) {
      this.toastService.showWarning('Email is required.');
      return;
    }
    if (!this.validateEmail(email)) {
      this.toastService.showWarning('Email is not valid.');
      return;
    }
    if (!password) {
      this.toastService.showWarning('Password is required.');
      return;
    }
    return;
  }

   this.loginPayload.email = email;
   this.loginPayload.password = password;
   this.loginPayload.hasTermsChecked = true;
   let rolePermission : boolean = false;
   let roleSuperadminPermission : boolean = false;

   this.service.login(this.loginPayload).subscribe(data => {
    this.logindata = data;
    if(this.logindata.userdetails.length > 0  && this.logindata.userentity.length > 0 
            && (this.logindata.userdetails[0].attributes.role == 'mccuser' || this.logindata.userdetails[0].attributes.role == 'wcuser') ){
          rolePermission = true;
    }else{
         if( this.logindata.userdetails[0].attributes.role == 'bmcadmin'){
          roleSuperadminPermission = true; 
         }else{
          this.toastService.showError('No Wealth Center Assigned to this User.');
         }
    }

    if(rolePermission == true || roleSuperadminPermission == true){
      localStorage.setItem('access_token', this.logindata.access_token);
      this.logindata.userdetails[0] != undefined ? localStorage.setItem('role', this.logindata.userdetails[0].attributes.role) : localStorage.setItem('role', '');
      localStorage.setItem('logindetails', JSON.stringify(this.logindata));
      localStorage.setItem('name', this.logindata.userdetails[0].firstName + "  " +this.logindata.userdetails[0].lastName);
      localStorage.setItem('email', this.logindata.userdetails[0].email);
      if(roleSuperadminPermission == true){
        localStorage.setItem('userInfo', '');
        localStorage.setItem('wcId',  '0');
        localStorage.setItem('zoneId','0');
      }else{
        this.logindata.userentity.length > 0 && this.logindata.userentity[0].mccEntity != undefined ? localStorage.setItem('userInfo', this.logindata.userentity[0].mccEntity) : localStorage.setItem('userInfo', '');
        localStorage.setItem('wcId', this.logindata.userentity.length > 0 && this.logindata.userentity[0] != undefined ? this.logindata.userentity[0].wcEntity?.wcId : 0);
        localStorage.setItem('zoneId', this.logindata.userentity.length > 0 && this.logindata.userentity[0] != undefined && this.logindata.userentity[0].mccEntity != undefined ? this.logindata.userentity[0].mccEntity?.zoneId?.zoneId : 0);   
      }
      //this.logindata.userentity.length > 0 && this.logindata.userentity[0].mccEntity != undefined ? localStorage.setItem('userInfo', this.logindata.userentity[0].mccEntity) : localStorage.setItem('userInfo', '');
      //localStorage.setItem('wcId', this.logindata.userentity.length > 0 && this.logindata.userentity[0] != undefined ? this.logindata.userentity[0].wcEntity?.wcId : 0);
      this.route.navigate(['/superadmin/home'])
    }

  }, err => {
    this.toastService.showError(err.error.error);
  });
}



}
