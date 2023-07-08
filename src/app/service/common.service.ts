import { Injectable, LOCALE_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class DeactivationDto {
        id: any
        activationStatus: Boolean = false
}

var environment = {


        // URL: `http://15.207.62.200:9091`,  //prod url
        // LOGIN_SERVICE_URL: 'http://15.207.62.200:8064/bmcwastemanagement/auth/users/login'


           LOGIN_SERVICE_URL: 'http://43.204.240.44:8064/bmcwastemanagement/auth/users/login',
           URL: `http://43.204.240.44:9091`  //Absec ip 


        // LOGIN_SERVICE_URL: 'http://43.204.240.44:8064/bmcwastemanagement/auth/users/login',
        // URL: `http://192.168.29.128:9091`
}

@Injectable({
        providedIn: 'root'
})
export class CommonService {
        deactivationDto: DeactivationDto = new DeactivationDto
        constructor(private http: HttpClient) { }
        public dashboardDetailsV2:any
        get(path: string): any {
                return new Promise(async (resolve, reject) => {
                        try {
                                let url = environment.URL + path;
                                let callData = await this.http.get(url).toPromise();
                                resolve(callData);
                        } catch (error) {
                                reject(error);
                        }
                });
        }
        post(path: string, body: any): any {
                return new Promise(async (resolve, reject) => {
                        let url = environment.URL + path;
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
                                const url = environment.URL + path
                                console.log(url)
                                const res = await this.http.delete(url, { responseType: 'text' }).toPromise()
                                resolve(res);
                        } catch (error) {
                                reject(error);
                        }
                });
        }


        //manoj code
        addItemCategory(data: any) {
                return this.http.post(environment.URL + '/inventory/addItemCategory', data);
        }
        getAllItemCategory() {
                return this.http.get(environment.URL + '/inventory/getAllItemCategory/' + localStorage.getItem("wcId"))
        }
        getItemCategoryById() {
                return this.http.get(environment.URL + '/inventory/getAllItemCategory')
        }

        getItemNameyByCategoryId() {
                return this.http.get(environment.URL + '/inventory/getAllItemCategory')
        }

        getAllItemNameyByCategoryId(id: any) {
                return this.http.get(environment.URL + '/inventory/get/ItemName/by/ItemCategory/Id/{itemcategoryId}?itemcategoryId=' + id)
        }

        deactivateCategory(id: any) {
                return this.http.get(environment.URL + '/itemCategory/deactivate?id=' + id)
        }
        addZone(data: any) {
                return this.http.post(environment.URL + '/zone/addZone', data);
        }
        addDryingYard(data: any) {
                return this.http.post(environment.URL + '/inventory/addDryingyard', data);
        }
        getZoneAllData() {
                return this.http.get(environment.URL + '/zone/getAllZone')
        }
        getDryingYardAllData() {
                return this.http.get(environment.URL + '/inventory/getAllDryingyard/' + localStorage.getItem("wcId"))
        }
        deactivateDryingYard(id: any) {
                return this.http.get(environment.URL + '/dryingyard/deactivate?id=' + id)
        }
        deactivateZone(id: any) {
                return this.http.get(environment.URL + '/zone/deactivate?id=' + id)
        }
        deactivateWc(id: any) {
                return this.http.get(environment.URL + '/wc/deactivate?id=' + id)
        }
        deactivateItemName(id: any) {
                return this.http.get(environment.URL + '/itemName/deactivate?id=' + id)
        }
        getAllWcData() {
                return this.http.get(environment.URL + '/zone/getAllWc/' + localStorage.getItem("wcId"))
        }
        getAllItemNameData() {
                return this.http.get(environment.URL + '/inventory/getAllItemName')
        }
        deactivateWard(id: any) {
                return this.http.get(environment.URL + '/ward/deactivate?id=' + id)
        }
        getAllWardData() {
                return this.http.get(environment.URL + '/zone/getAllWard')
        }
        deactivateMcc(id: any) {
                return this.http.get(environment.URL + '/mcc/deactivate?id=' + id)
        }
        getAllMccData() {
                return this.http.get(environment.URL + '/zone/getAllMcc')
        }
        deactivatePit(id: any) {
                return this.http.get(environment.URL + '/pit/deactivate?id=' + id)
        }
        getAllPitData() {
                return this.http.get(environment.URL + '/zone/getAllPit')
        }
        deactivateRoute(id: any) {
                return this.http.get(environment.URL + '/route/deactivate?id=' + id)
        }
        getAllRouteData() {
                return this.http.get(environment.URL + '/zone/getAllRoute/' + localStorage.getItem("wcId"))
        }
        getWcListByZoneId(id: any) {
                return this.http.get(environment.URL + '/get/all/wcData/by/zoneId?zoneId=' + id)
        }
        getWcById(id: any) {
                return this.http.get(environment.URL + '/zone/getWcById/' + id)
        }
        getAllMccByWcId(id: any) {
                return this.http.get(environment.URL + '/get/all/mcc/by/wcId?wcId=' + id)
        }
        login(data: any) {
                //  return this.http.post('http://15.207.62.200:8064/bmcwastemanagement/auth/users/login' , data)
                return this.http.post(environment.LOGIN_SERVICE_URL, data)

        }
        getZoneById(id: any) {
                return this.http.get(environment.URL + '/zone/getZoneById/' + id)
        }
        updateZone(item: any) {
                return this.http.put(environment.URL + '/zone/updateZone', item)
        }
        updateDryingYard(item: any) {
                return this.http.put(environment.URL + '/inventory/updateDryingyard', item)
        }
        updateWc(item: any) {
                return this.http.put(environment.URL + '/zone/updateWc', item)
        }
        updateMcc(item: any) {
                return this.http.put(environment.URL + '/zone/updateMcc', item)
        }
        updateRoute(item: any) {
                return this.http.put(environment.URL + '/zone/updateRoute', item)
        }
        updateVehicle(item: any) {
                return this.http.put(environment.URL + '/zone/updateRoute', item)
        }
        updateWard(item: any) {
                return this.http.put(environment.URL + '/zone/updateWard', item)
        }
        updateGoods(item: any) {
                return this.http.put(environment.URL + '/zone/updateGoods', item)
        }
        updateSubGood(item: any, subGoodId: any) {
                return this.http.put(environment.URL + '/zone/updateGoodssub/', item)
        }
        updateDriver(item: any) {
                return this.http.put(environment.URL + '/zone/updateDriver', item)
        }
        updateHelper(item: any) {
                return this.http.put(environment.URL + '/zone/updateHelper', item)
        }
        updateItemCategory(item: any) {
                return this.http.put(environment.URL + '/inventory/updateItemCategory', item)
        }
        getAllGoods(wcId: any) {
                let wcId_ = localStorage.getItem('role') != 'bmcadmin' ? wcId : 0 
                return this.http.get(environment.URL + '/zone/getAllGoods/' + wcId_)
        }
        getWardsCount() {
                return this.http.get(environment.URL + '/get/all/wards/count')
        }
        getActiveTrip() {
                return this.http.get(environment.URL + '/get/active/trip/' + localStorage.getItem("wcId"))
        }
        getCompletedTrips() {
                return this.http.get(environment.URL + '/get/inActive/trip/' + localStorage.getItem("wcId"))
        }
        getAllItemPurchase() {
                return this.http.get(environment.URL + '/inventory/getAllItemPurchase/' + localStorage.getItem("wcId"))
        }
        getAllItemIssue() {
                return this.http.get(environment.URL + '/inventory/getAllItemIssuse/' + localStorage.getItem("wcId"))
        }
        getVehicleByVehicleNumber(vehicleNo: any) {
                return this.http.get(environment.URL + '/get/vehicle/by/vehicle/number?vehicleNumber=' + vehicleNo)
        }
        getTripByVehicleNumber(vehicleNo: any) {
                return this.http.get(environment.URL + '/get/trip/by/vehicle/number?vehicleNumber=' + vehicleNo)
        }
        createTrip(data: any) {
                return this.http.post(environment.URL + '/create/trip', data)
        }
        updateTrip(data: any) {
                return this.http.put(environment.URL + '/update/trip', data)
        }
        getAllSubGood(wcId: number) {
                return this.http.get(environment.URL + '/zone/getAllGoodssub/' + wcId)
        }
        getAllDryingYard() {
                return this.http.get(environment.URL + '/inventory/getAllDryingyard/'+ localStorage.getItem("wcId"))
        }
        saveCompostDrying(data: any) {
                return this.http.post(environment.URL + '/inventory/addDryingCompost', data)
        }
        saveMrfData(data: any) {
                return this.http.post(environment.URL + '/zone/addMrf', data)
        }
        updateMrf(data: any) {
                return this.http.post(environment.URL + '/zone/updateMrf', data)
        }
        getAllMrf(wcId: any) {
                return this.http.get(environment.URL + '/zone/getAllMrf/' + wcId)
        }
        deactivateVehicle(id: any) {
                return this.http.get(environment.URL + '/vehicle/deactivate?id=' + id)
        }
        getAllActiveVehicle() {
                return this.http.get(environment.URL + '/getAll/vehicle/')
        }
        getAllDriverList() {
                return this.http.get(environment.URL + '/zone/getAllDriver/' + localStorage.getItem("wcId"))
        }
        getAllDriverByVehicleId(id: any) {
                return this.http.get(environment.URL + '/get/Driver/by/' + id)
                // return  this.http.get(environment.URL+'/get/vehicle/by/driver/Id/{driverId}?driverId='+id)
        }
        getAllWcVehicle(id: any) {
                return this.http.get(environment.URL + '/get/vehicle/by/wc/Id/' + id)
        }
        getAllSubGoodByGoodId(id: any) {
                return this.http.get(environment.URL + '/zone/get/subgood/by/good/Id/goodId?goodId=' + id)
        }
        getAllDryingYardByWcId(id: any) {
                return this.http.get(environment.URL + '/zone/get/subgood/by/good/Id?goodId=' + id)
        }
        deactivateMrf(id: any) {
                return this.http.get(environment.URL + '/mrf/deactivate?id=' + id)
        }
        getAllHelper() {
                return this.http.get(environment.URL + '/zone/getAllHelper')
        }

        toggleDetailedSidebar() {
                const miniSidebarElement = document.querySelector('#mini-sidebar') as HTMLDivElement;
                if (miniSidebarElement.classList.contains('toggled')) {
                        const pageContentElement = document.querySelector('.page-content') as HTMLDivElement;
                        pageContentElement && pageContentElement.classList.toggle('toggled');
                        const sidebarParentElement = document.querySelector('.sidebar-parent') as HTMLDivElement;
                        sidebarParentElement && sidebarParentElement.classList.toggle('d-none');
                        const appContentElement = document.querySelector('.app-content') as HTMLDivElement;
                        appContentElement && appContentElement.classList.toggle('col-lg-9');
                        appContentElement && appContentElement.classList.toggle('col-12');
                }
        }
        updateDryingCompost(data: any) {
                return this.http.put(environment.URL + '/inventory/updatewetCompostWtInDryingYard', data)
        }
        saveComposeWeightmnent(data: any) {
                return this.http.post(environment.URL + '/inventory/addCompostWtmt', data)
        }
        getAllUnit() {
                return this.http.get(environment.URL + '/inventory/getAllUnit')
        }
        saveCompostPacking(data: any) {
                return this.http.post(environment.URL + '/inventory/addCompostPackaging', data)
        }
        getAllCompostPacking() {
                return this.http.get(environment.URL + '/inventory/getAllCompostPackaging')
        }
        addItemPurchase(data: any) {
                return this.http.post(environment.URL + '/inventory/addItemPurchase', data)
        }
        addItemIssue(data: any) {
                return this.http.post(environment.URL + '/inventory/addItemIssuse', data)
        }

        getAllCompletedTripInGraveYard() {
                return this.http.get(environment.URL + '/inventory/get/all/dryingyard/completed/trip/' + localStorage.getItem('wcId'))
        }

        getAllActiveTripInGraveYard() {
                return this.http.get(environment.URL + '/inventory/get/all/dryingyard/active/trip/' + localStorage.getItem('wcId'))
        }

        addItemName(data: any) {
                return this.http.post(environment.URL + '/inventory/addItemName', data)
        }
        getAllItemStockList() {
                return this.http.get(environment.URL + '/inventory/getAllItemStock/' + localStorage.getItem("wcId"))
        }
        updateTripForceFully(data: any) {
                return this.http.put(environment.URL + '/update/trip/forcefully', data)
        }
        uploadFile(data: any) {
                return this.http.post(environment.URL + '/v1/uploadFile', data)
        }
        getAllItemName() {
                return this.http.get(environment.URL + '/inventory/getAllItemName/' + localStorage.getItem("wcId"))
        }
        getVehicleListByWcId() {
                return this.http.get(environment.URL + '/getAll/vehicle/' + localStorage.getItem("wcId"))
        }
        getHelperByWcId() {
                return this.http.get(environment.URL + '/zone/get/Helper/by/' + localStorage.getItem("wcId"))
        }
        getDashboardDetails() {
                return this.http.get(environment.URL + '/get/dashboard/details/' + localStorage.getItem("wcId"))
        }
        getAllHelperByWcId() {
                return this.http.get(environment.URL + '/zone/get/all/helper/by/wcId/' + localStorage.getItem("wcId"))
        }
        addRoute(data: any) {
               return this.http.post(environment.URL + '/zone/addRoute', data)
        }
        getAllMrfReports(){
                return this.http.get(environment.URL+'/get/mrf/transaction/value/'+localStorage.getItem("wcId"))
        }
        getMrfReportByWc(wcId:any){
                return this.http.get(environment.URL+'/get/mrf/transaction/value/'+wcId)
        }
        getMrfReportForAdmin(){
                return this.http.get(environment.URL+'/get/all/mrf/report/for/admin')
        }

        getDashboardDetailsForAdmin(){
                return this.http.get(environment.URL+'/get/mrf/transaction/for/admin')
        }
        getDashboardDetailsV2(wcId:any){

                return this.http.get(environment.URL + '/get/dashboard/details/' + wcId)
        }
}