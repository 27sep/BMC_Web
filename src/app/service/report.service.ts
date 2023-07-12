import { Injectable, LOCALE_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReportGenerate } from '../model/pit.model';


export class DeactivationDto {
        id: any
        activationStatus: Boolean = false
}

const environment = {

     //     REPORT_SERVICE_URL: 'http://localhost:8065'// Prod IP

            REPORT_SERVICE_URL: 'http://localhost:8065'// Dev IP

    //      REPORT_SERVICE_URL: 'http://15.207.62.200:8065'// Local IP
}

@Injectable({
        providedIn: 'root'
})
export class ReportService {
        deactivationDto: DeactivationDto = new DeactivationDto
        constructor(private http: HttpClient) { }

        get(path: string): any {
                return new Promise(async (resolve, reject) => {
                        try {
                                let url = environment.REPORT_SERVICE_URL + path;
                                let callData = await this.http.get(url).toPromise();
                                resolve(callData);
                        } catch (error) {
                                reject(error);
                        }
                });
        }
        post(path: string, body: any): any {
                return new Promise(async (resolve, reject) => {
                        let url = environment.REPORT_SERVICE_URL + path;
                        this.http.post(url, body)
                                .subscribe((callData: any) => {
                                        resolve(callData);
                                }, (error: any) => {
                                        reject(error);
                                });
                });
        }
        delete(path: string): any {
                return new Promise(async (resolve, reject) => {
                        try {
                                const url = environment.REPORT_SERVICE_URL + path
                                console.log(url)
                                const res = await this.http.delete(url, { responseType: 'text' }).toPromise()
                                resolve(res);
                        } catch (error) {
                                reject(error);
                        }
                });
        }


        //Arbind code
        getInventoryReport(payload : ReportGenerate) {
             return this.http.post<any>(environment.REPORT_SERVICE_URL + '/generate-report-inventory', payload);      
        }

        getGarbageReport(payload : ReportGenerate) {
                return this.http.post<any>(environment.REPORT_SERVICE_URL + '/generate-report-garbage', payload);      
        }
        
}