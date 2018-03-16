
angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
            
            })

.controller('LoginController', function ($rootScope, $scope, AuthenticationService, $location, REST_URL, $state, $ionicPopup,
                                         $ionicHistory, $timeout, $window) {
            'use strict';
            // console.log("i am here");
            
            $scope.user = {};
            $scope.user.rememberMe = 'NO';
            
            if($window.localStorage.getItem("loginEMail") !=""){
            $scope.user.email =$window.localStorage.getItem("loginEMail");
            }
            
            
            $scope.authError = null;
            $scope.processing = true;
            
            $scope.login = function () {
            
            $scope.user.username = $scope.user.email;
            $scope.user.password = $scope.user.password;
            
            /*alert(REST_URL+'/auth/login');
             $state.go('app.checkup',{ Opdid: "8565",OPDDate:  "2016-12-06 18:42:52" });
             var loginObj = {
             userId: "1",
             key: "$1$HDFwUwvK$TBfftR8jjrJySwXiuA5Rf/",
             userData: {id: "1", area_id: "1"}
             };
             $rootScope.globals = loginObj;
             console.log($rootScope.globals);
             localStorage.setItem('globals', JSON.stringify($rootScope.globals) );
             return;
             console.log("i am here");*/
            
            
            
            var authPromise = AuthenticationService.loginUser($scope.user, REST_URL);
            //id:
            authPromise.then(
                             function (response) {
                             
                             //  console.log(response);
                             
                             if (response.apistatus === 1) {
                             //   $rootScope.No = 1;
                             //console.log("User Logged in Successfully");
                             $window.localStorage.setItem("isLoginRemember", "" + $scope.user.rememberMe);
                             $window.localStorage.setItem("loginEMail", "" + $scope.user.username);
                             
                             $state.go('app.existing'); //$state.go('app.dashboard');
                             //alert("received isLoginRemember " + $scope.user.rememberMe);
                             
                             } else {
                             var alertPopup = $ionicPopup.alert({
                                                                title: 'Login failed!',
                                                                template: response.message
                                                                });
                             //  $scope.authError = response.message;
                             }
                             },
                             function (error) {
                             
                             //alert(error.message)
                             alert('The server could not be reached, please contact the administrator.');
                             },
                             function (progress) {
                             
                             // report progress
                             //$scope.message = "test";
                             });
            }; //login
            $scope.getMedTypes = function getMedTypes() {
            AuthenticationService.medType(REST_URL);
            };
            
            $scope.logoutFromApp = function logoutFromApp() {
            AuthenticationService.logoutFromApp(REST_URL);
            $timeout(function () {
                     $rootScope = $rootScope.$new(true);
                     $scope = $scope.$new(true);
                     $ionicHistory.clearCache();
                     $ionicHistory.clearHistory();
                     }, 0);
            $window.localStorage.setItem("isLoginRemember", 'NO');
            $state.go('login');
            };
            
            
            })


.controller('DashboardCtrl', function ($scope, $state) {
            
            $scope.NewPatient = function NewPatient() {
            $state.go('app.new');
            }
            $scope.ExistingPatient = function ExistingPatient() {
            $state.go('app.existing');
            }
            
            })
.controller('NewPatientCtrl', function ($scope, $state, $ionicHistory) {
            document.getElementById('txtName').focus();
            $scope.doSomething = function doSomething() {
            //  console.log('mybad');
            //$ionicHistory.goBack();
            $state.go('app.dashboard');
            }
            })

.controller('ExistingPatientCtrl', function ($rootScope, $scope, PatientService, $location, REST_URL, $state,$window) {
            // alert("hi");
            var getPatientlist = function getPatientlist() {
            PatientService.getPatientlist(REST_URL, $rootScope.globals.userData.id).then(function (result) {
                                                                                         
                                                                                         $scope.ExistingPatientlist = result.data;
                                                                                         });
            };
            
            $scope.ExistingPatient = function ExistingPatient(search) {
            if (search.length > 4) {
            PatientService.getPatientlistByPatName(REST_URL, $rootScope.globals.userData.id, search).then(function (result) {
                                                                                                          
                                                                                                          $scope.ExistingPatientlist = [];
                                                                                                          $scope.ExistingPatientlist = result.data;
                                                                                                          
                                                                                                          });
            } else {
            getPatientlist();
            }
            
            }
            
            $scope.ExistingPatientClicked = function ExistingPatientClicked(search) {
            console.log("ExistingPatientClicked:" + search.id);
            $window.localStorage.setItem("ExistingPatientClickedID",''+search.id);
            
            $location.path('app/ExistingPatientHistory/' + search.id);
            }
            
            $scope.addNewPatientFromExistingPatient = function addNewPatientFromExistingPatient() {
            $location.path('app/new');
            //  $state.go('app.new');
            }
            
            $scope.$on("$ionicView.beforeEnter", function (event) {
                       //activate(); shell.getLocation();
                       //  $scope.refresh();
                       console.log("beforeEnter ................................................................");
                       getPatientlist();
                       })
            
            
            
            $scope.doSomething = function doSomething() {
            $state.go('app.dashboard');
            }
            })

.controller('PatientCtrl', function ($rootScope, $scope, PatientService, $location, REST_URL, $state) {
            $scope.search = "";
            var getPatientlist = function getPatientlist() {
            PatientService.getPatientlist(REST_URL, $rootScope.globals.userData.id).then(function (result) {
                                                                                         $scope.patientlist = result.data;
                                                                                         });
            };
            getPatientlist();
            })


.controller('PatientController', function ($rootScope, $scope, PatientService, $location, REST_URL, $state, $ionicPopup, $timeout
                                           , $ionicHistory) {
            $scope.email = {
            text: 'me@example.com'
            };
            
            var getPatientlist = function getPatientlist() {
            PatientService.getPatientlist(REST_URL, $rootScope.globals.userData.id).then(function (result) {
                                                                                         $rootScope.list = result.data;
                                                                                         });
            };
            
            getPatientlist();
            
            $scope.showAlert = function (title, msg) {
            var alertPopup = $ionicPopup.alert({
                                               title: title,
                                               template: msg
                                               });
            };
            
            
            $scope.addPatientDetail = function addPatientDetail(patient) {
            for (var i = 0; i < $rootScope.list.length; i++) {
            if ($rootScope.list[i].patient_email == patient.patient_email && $rootScope.list[i].patient_name == patient.patient_name) {
            $scope.showAlert("record already exists");
            return;
            }
            }
            
            //  PatientService.addPatientDetail(REST_URL, patient, $rootScope.globals.userData.id).then(function (result) {
            //   console.log(JSON.stringify(result) + "........Add Patient.........");
            //   $scope.newPatientId = result;
            //  });
            //-----------------------------------------------------------
            var addPatientDetailService = PatientService.addPatientDetail(REST_URL, patient, $rootScope.globals.userData.id);
            addPatientDetailService.then(
                                         function (response) {
                                         // $state.go('app.dashboard');
                                         console.log("response.data.patientId "+response.data.patientId);
                                         if(response.data === ""){
                                         alert(""+response.error);
                                         
                                         }else{
                                         $location.path('app/ExistingPatientHistory/' + response.data.patientId);
                                         
                                         }
                                         
                                        // console.log(response);
                                         },
                                         function (error) {
                                         
                                         //alert(error.message)
                                         alert('The server could not be reached, please contact the administrator.');
                                         },
                                         function (progress) {
                                         });
            //-----------------------------------------------------------
            
            //=== $timeout(function () {
            //$scope.showAlert("Record Add Successfully");
            //$state.go('app.existing');
            //===     $state.transitionTo('app.existing', null, {reload: true, notify:true});
            /*$rootScope.PatientId = $scope.newPatientId;
             alert($scope.newPatientId);
             $state.go('app.ExistingPatientHistory', { id: $rootScope.PatientId });
             */
            //$rootScope.currentDate = moment(new Date()).format('DD/MM/YYYY');
            //$state.go('app.checkup', { OPDDate: $rootScope.currentDate });
            //$scope.selectPicture(Camera.PictureSourceType.CAMERA);
            
            //===}, 0);
            }
            
            $scope.Cancel = function Cancel(patient) {
            $scope.patient.patient_name = "";
            $scope.patient.patient_email = "";
            $scope.patient.patient_phon = "";
            $scope.patient.patient_alt_phon = "";
            }
            
            })

.controller('PatientDetailsCtrl', function ($scope, PatientService, $stateParams, REST_URL, $state, moment, $filter, $rootScope, $timeout, $ionicHistory, $window) {
            $rootScope.imageURLs = [];
            $rootScope.photoCount = 0;
            $rootScope.selectedImages = [];
            
            $scope.lines = [];
            $rootScope.PatientId = $stateParams.id;
            var todaydate = $filter('date')(new Date(), 'dd/MM/yyyy');
            var responseDate;
            
            PatientService.getPatientDetailById(REST_URL, $stateParams.id).then(function (result) {
                                                                                //---- Edited on 28 Feb 17----
                                                                                // $scope.patient_name = result.data[0].patient_name;
                                                                                // $scope.patient_city = result.data[0].patient_city;
                                                                                // $scope.patient_phon = result.data[0].patient_phon;
                                                                                // $scope.patient_email = result.data[0].patient_email;
                                                                                // $scope.patientId = result.data[0].id;
                                                                                //------------------
                                                                                console.log("RESPONSE:" + result.data.patient_details[0]);
                                                                                console.log("RESPONSE:patient_name" + result.data.patient_details[0].patient_name);
                                                                                console.log("RESPONSE:reference_id" + result.data.patient_details[0].reference_id);
                                                                                $scope.patient_name = result.data.patient_details[0].patient_name;
                                                                                $scope.patient_city = result.data.patient_details[0].patient_city;
                                                                                $scope.patient_phon = result.data.patient_details[0].patient_phon;
                                                                                $scope.patient_email = result.data.patient_details[0].patient_email;
                                                                                $scope.reference_id = result.data.patient_details[0].reference_id;
                                                                                $scope.patientId = result.data.patient_details[0].id;
                                                                                
                                                                                // $timeout(function() {
                                                                                //     $scope.getOpdDetailsForPatient($stateParams.id);
                                                                                // }, 0);
                                                                                
                                                                                });
            
            $scope.$on("$ionicView.beforeEnter", function (event) {
                       //activate(); shell.getLocation();
                       $scope.getOpdDetailsForPatient($stateParams.id);
                       })
            
            
            $scope.doSomething = function doSomething() {
            $state.go('app.existing');
            }
            
            // alert($rootScope.flag);
            
            
            // $rootScope.flag = $rootScope.flag +1;
            
            $scope.getOpdDetailsForPatient = function getOpdDetailsForPatient(patientId) {
            
            console.log("getOpdDetailsForPatient:" + patientId);
            
            PatientService.getOpdDetailsForPatient(REST_URL, patientId).then(function (result) {
                                                                             $scope.opds = result.data;
                                                                             
                                                                             // for(var i =0 ;i<$scope.opds.length;i++)
                                                                             // {
                                                                             
                                                                             //    var date = moment($scope.opds[i].OPDDate).format('DD/MM/YYYY');
                                                                             //    var id = $scope.opds[i].Opdid;
                                                                             //    var P_id = $scope.opds[i].PatientId;
                                                                             
                                                                             //     var ListObj = {
                                                                             //     OPDDate:date,
                                                                             //     Opdid:id ,
                                                                             //     oPId:P_id,
                                                                             //   }
                                                                             //    $scope.lines.push(ListObj);
                                                                             
                                                                             // }
                                                                             
                                                                             
                                                                             
                                                                             if (result.data.length == 0) {
                                                                             $rootScope.Opdid = "";
                                                                             $rootScope.currentDate = todaydate;
                                                                             }
                                                                             else {
                                                                             
                                                                             for (var i = 0; i < result.data.length; i++) {
                                                                             responseDate = moment(result.data[i].OPDDate).format('DD/MM/YYYY');
                                                                             if (todaydate == responseDate) {
                                                                             $rootScope.Opdid = result.data[i].Opdid;
                                                                             }
                                                                             else {
                                                                             //$rootScope.Opdid = "";
                                                                             $rootScope.currentDate = todaydate;
                                                                             }
                                                                             }
                                                                             }
                                                                             
                                                                             //var responseDate = moment(result.data[0].OPDDate).format('DD/MM/YYYY');
                                                                             });
            };
            
            
            /* $rootScope.$on('$stateChangeStart',
             function(event, toState, toParams, fromState, fromParams, $ionicHistory){
             // do something
             
             $ionicHistory.clearHistory();
             })*/
            
            
            
            $scope.checkup = function checkup() {
            $rootScope.currentDate = moment(new Date()).format('DD/MM/YYYY');;
            $state.go('app.checkup', { OPDDate: $rootScope.currentDate });
            }
            
            $scope.gotoFilesPage = function gotoFilesPage(Opdid, OPDDate) {
            console.log(Opdid, OPDDate);
            $state.go('app.checkup', { Opdid: Opdid, OPDDate: OPDDate });
            }
            
            $scope.onexistingPatientHistoryItemClicked = function onexistingPatientHistoryItemClicked(data) {
            console.log("onexistingPatientHistoryItemClicked" + JSON.stringify(data));
            $window.localStorage.setItem("PatientHistoryItemClicked_ID", "" + data.Opdid);
            $window.localStorage.setItem("PatientHistoryItemClicked_OPDDATE", "" + data.OPDDate);
            
            $state.go('app.checkup', { Opdid: data.Opdid, OPDDate: data.OPDDate });
            
            }
            
            })

.controller('PatientDetails', function ($scope, PatientService, $stateParams, REST_URL, $state, moment, $filter, $rootScope, $ionicHistory) {
            PatientService.getPatientDetailById(REST_URL, $stateParams.id).then(function (result) {
                                                                                $scope.patient_name = result.data[0].patient_name;
                                                                                $scope.patient_city = result.data[0].patient_city;
                                                                                $scope.patient_phon = result.data[0].patient_phon;
                                                                                $scope.patient_email = result.data[0].patient_email;
                                                                                $scope.patientId = result.data[0].id;
                                                                                });
            
            $scope.doSomething = function doSomething() {
            $ionicHistory.goBack();
            }
            
            })



.controller('CheckupCtrl',
            function ($scope, $stateParams, PatientService, $rootScope, REST_URL, $state,
                      $cordovaDevice, $cordovaFile, $ionicPlatform, $cordovaEmailComposer,
                      $cordovaCamera, $cordovaFileTransfer, $ionicPopup, $cordovaActionSheet, $cordovaImagePicker, Device, $timeout, $filter, $ionicHistory, $ionicLoading, $location,$window) {
            $scope.image = null;
            $scope.opdId = null;
            $rootScope.currentDate;
            $scope.images = [];
            $scope.uploadedFileItems = [];
            $scope.uploadDisabled = false;
            //$scope.selectedImgSourceType = null;
            var vm = this;
            // $rootScope.flag = 1;
            
            //$scope.sidebar = $rootScope.sidebar;
            
            $scope.checkFileStatus = function checkFileStatus(FileName) {
            if ((FileName.split('.')[1]) == 'pdf' || (FileName.split('.')[1]) == 'PDF') {
            return 0;
            } else {
            return 1;
            }
            }
            
            $scope.getFileName = function getFileName(fURL, fName) {
            var _type = "";
            $scope.pdfUrl = fURL;
            if (device.platform === "Android") {
            _type = "_blank";
            fURL = 'https://docs.google.com/viewer?url=' + fURL + '&embedded=true';
            //window.open(fURL,_type,'location=yes,toolbarposition=top');
            var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'yes',
            closebuttoncaption: 'DONE?'
            };
            
            //$cordovaInAppBrowser.open(fURL, _type, options)
            cordova.InAppBrowser.open(fURL, _type, options)
            .then(function (event) {
                  // success
                  })
            .catch(function (event) {
                   // error
                   });
            }
            else {
            //var invoice = fURL;
            _type = "_system";
            window.open(fURL, _type, 'location=no');
            }
            //$state.go('file-viewer', { fileUrl: fURL, fileName: fName });
            }
            
            $scope.getFileUrl = function getFileUrl(url,id) {
            //window.location =  url;
            
            //----- Option dialog for image : START
            
            //$state.go('app.browse');
            var options = {
            title: 'Please select',
            buttonLabels: ['View', 'Delete'],
            addCancelButtonWithLabel: 'Cancel',
            androidEnableCancelButton: true,
            };
            $cordovaActionSheet.show(options).then(function (btnIndex) {
                                                   var type = null;
                                                   if (btnIndex === 2) {
                                                   $scope.deleteDiagnosisFile(id);
                                                   } else if (btnIndex === 1) {
                                                    $state.go('previewpage', { imageUrl: url });
                                                   }
                                                   
                                                   });
            
            
            //----- Option dialog for image : END
            
            }
            
            
            // alert($stateParams.Opdid);
            
            // alert($rootScope.sidebar);
            $scope.showAlert = function (title, msg) {
            var alertPopup = $ionicPopup.alert({
                                               title: title,
                                               template: msg
                                               });
            };
            
            // alert($rootScope.sidebar);
            $scope.doSomething = function doSomething() {
            
            //if ($rootScope.flag == 0) {
            //  $state.go('app.ExistingPatientHistory', { id: $rootScope.PatientId }, { reload: true });
            //}
            //else {
            $state.go('app.ExistingPatientHistory', { id: $rootScope.PatientId }, { reload: false });
            // }
            
            }
            
            $scope.getOPDFiles = function () {
            PatientService.getOPDFiles(REST_URL, $rootScope.id).then(function (result) {
                                                                     console.log(result);
                                                                     $scope.uploadedFileItems = result.data;
                                                                     
                                                                     for (var i = 0; i < $scope.uploadedFileItems.length ; i++) {
                                                                     var ex = $scope.uploadedFileItems[i].filename.substr($scope.uploadedFileItems[i].filename.lastIndexOf('.') + 1);
                                                                     $scope.images.push({
                                                                                        id: i, src: REST_URL + '/assets/diagnosis/' + $scope.uploadedFileItems[i].filename,
                                                                                        filename: $scope.uploadedFileItems[i].filename, itemId: $scope.uploadedFileItems[i].id,
                                                                                        ext: ex
                                                                                        });
                                                                     }
                                                                     
                                                                     });
            };
            
            //alert($stateParams.Opdid);
            if ($rootScope.Opdid == undefined) {
            $rootScope.Opdid = "";
            }
            
            if ($stateParams.Opdid != "") { //alert("hi",$stateParams.Opdid);
            $rootScope.currentDate = moment($stateParams.OPDDate).format('DD/MM/YYYY');
            $rootScope.id = $stateParams.Opdid;
            $scope.getOPDFiles();
            }
            else {
            // alert("not id",$stateParams.Opdid);
            $scope.pid = PatientService.PatientId;
            var today = new Date();
            /*var dd = today.getDate();
             var mm = today.getMonth() + 1; //January is 0!
             
             var yyyy = today.getFullYear();
             if (dd < 10) {
             dd = '0' + dd;
             }
             if (mm < 10) {
             mm = '0' + mm;
             }*/
            $rootScope.currentDate = moment(today).format('DD/MM/YYYY'); //dd + '/' + mm + '/' + yyyy;
            
            var todaydate = $filter('date')(new Date(), 'dd/MM/yyyy');
            var tempTodaydate = $filter('date')(new Date(), 'yyyy-MM-dd');
            //alert(todaydate);
            //alert('currentDate2: ' + $rootScope.currentDate);
            //alert($stateParams.Opdid);
            if (todaydate == $rootScope.currentDate && $stateParams.Opdid == "") {
            //alert('generateOPDId');
            PatientService.generateOPDId(REST_URL, $scope.pid).then(function (result) {
                                                                    //$scope.opdId = result.data;
                                                                    $rootScope.id = result.data;
                                                                    // alert("new id",$rootScope.id);
                                                                    $rootScope.currentDate = todaydate;
                                                                    
                                                                    //--ritesh edited : START--
                              $window.localStorage.setItem("PatientHistoryItemClicked_ID",""+result.data);
                               $window.localStorage.setItem("PatientHistoryItemClicked_OPDDATE",tempTodaydate);
                                                                    //--ritesh edited : END--
                                                                    })
            }
            }
            //alert($rootScope.id);
            //alert('currentDate3: ' + $rootScope.currentDate);
            
            
            $scope.deleteDiagnosisFile = function deleteDiagnosisFile(itemId) {
            var confirmPopup = $ionicPopup.confirm({
                                                   title: '<b>Delete Image</b>',
                                                   template: 'Are you sure you want delete this image?',
                                                   cancelText: 'No',
                                                   okText: 'Yes'
                                                   });
            
            confirmPopup.then(function (res) {
                              if (res) {
                              
                              PatientService.deleteDiagnosisFile(REST_URL, itemId).then(function (result) {
                                                                                        // console.log("deleteDiagnosisFile",result);
                                                                                        });
                              
                              for (var i = 0; i < $scope.images.length; i++) {
                              if ($scope.images[i].itemId == itemId) {
                              $scope.images.splice(i, 1);
                              break;
                              }
                              }
                              }
                              else {
                              }
                              });
            
            //$scope.getOPDFiles();
            };
            
            $scope.gotoBrowse = function () {
            $state.go('app.browse');
            }
            
            $scope.showLoading = function () {
            $ionicLoading.show({
                               template: 'Please wait...',
                               duration: 5000
                               });
            };
            
            $scope.hideLoading = function () {
            $ionicLoading.hide();
            };
            
            $scope.loadImage = function () {
            //$state.go('app.browse');
            var options = {
            title: 'Select Image Source',
            buttonLabels: ['Take Picture', 'Select from Gallery'],
            addCancelButtonWithLabel: 'Cancel',
            androidEnableCancelButton: true,
            };
            $cordovaActionSheet.show(options).then(function (btnIndex) {
                                                   var type = null;
                                                   if (btnIndex === 2) {
                                                   type = Camera.PictureSourceType.PHOTOLIBRARY;
                                                   } else if (btnIndex === 1) {
                                                   type = Camera.PictureSourceType.CAMERA;
                                                   }
                                                   if (type !== null) {
                                                   //$scope.selectedImgSourceType = type;
                                                   
                                                   if(type === Camera.PictureSourceType.PHOTOLIBRARY){
                                                   $scope.selectMultipleImageFromGallery(type);
                                                   }else{
                                                   $scope.selectPicture(type);
                                                   }
                                                   }
                                                   });
            };
            
            
            //--Multiple image select--
            $scope.selectMultipleImageFromGallery = function(sourceType) {
            
            window.imagePicker.getPictures(
                                           function(results) {
                                           $scope.showLoading();
//                                           for (var i = 0; i < results.length; i++) {
                                          var recursiveCounter=0;
                                           moveSelectedImages();
                                           function moveSelectedImages(){
                                           
                                           console.log("results:"+recursiveCounter+"|DATA"+results[recursiveCounter]);
                                           
                                           
                                           //--------
                                         var  imagePath =results[recursiveCounter];
                                           // Grab the file name of the photo in the temporary directory
                                           var currentName = imagePath.replace(/^.*[\\\/]/, '');
                                           
                                           //Create a new name for the photo
                                           var d = new Date(),
                                           n = d.getMinutes() + "" + d.getSeconds()+"_"+d.getMilliseconds(),
                                           newFileName = n + ".jpg";

                                           var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                                           
                                           console.log("newFileName:"+newFileName);
                                           console.log("namePath:"+namePath);

                                           // Move the file to permanent storage
                                           $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function (success) {
                                                                                                                                      
                                      $scope.image = cordova.file.dataDirectory + newFileName;
                                    $rootScope.imageUrl = $scope.image;
                                  $rootScope.imageURLs.push({ imageName: newFileName, src: $scope.image });
                                $rootScope.imageName = newFileName;
                                     $rootScope.filePath = cordova.file.dataDirectory;
                                       
                               $rootScope.photoCount++;
                                if ($rootScope.photoCount < 6) {
                                //$scope.selectPicture(sourceType);
                               $rootScope.selectedImages.push($rootScope.photoCount - 1);
                             }
                             else {
                                   //$state.go('app.browse');
                                    }
                                    if(recursiveCounter< results.length){
                                               moveSelectedImages();
                                   }
                                    recursiveCounter +=1;
                                               
                               }, function (error) {
                                  // $scope.showAlert('Error', error.exception);
                                    if(recursiveCounter< results.length){
                                                   moveSelectedImages();
                                       }
                                      recursiveCounter +=1;
                              });
                                        
                                           //---------
                                           
                                           
                                           }
                                           
                                           $state.go('app.browse');
                                           //}
                                           $scope.hideLoading();
                                           
                                           if(!$scope.$$phase) {
                                           $scope.$apply();
                                           }
                                           }, function (error) {
                                           console.log(error);
                                           },{
                                           maximumImagesCount: 5,
                                           quality: 50
                                           }
                                           );
            };
            
            //----
            
            $scope.selectPicture = function (sourceType) {
            var options = {
            limit: 10,
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: sourceType,
            direction: Camera.Direction.BACK,
            
            //allowEdit: true,
            saveToPhotoAlbum: false,
            correctOrientation: true
            };
            
            $cordovaCamera.getPicture(options).then(function (imagePath) {
                                                    $scope.doOperationOnSelectedImages(sourceType,imagePath);
                                                    },
                                                    function (err) {
                                                    // Not always an error, maybe cancel was pressed...
                                                    })
            };
            
            $scope.doOperationOnSelectedImages = function (sourceType,imagePath) {
            $scope.showLoading();
            // Grab the file name of the photo in the temporary directory
            var currentName = imagePath.replace(/^.*[\\\/]/, '');
            
            //Create a new name for the photo
            var d = new Date(),
            n = d.getMinutes() + "" + d.getSeconds()+"_"+d.getMilliseconds(),
            newFileName = n + ".jpg";
            
            // If you are trying to load image from the gallery on Android we need special treatment!
            if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
            window.FilePath.resolveNativePath(imagePath, function (entry) {
                                              window.resolveLocalFileSystemURL(entry, success, fail);
                                              function fail(e) {
                                              console.error('Error: ', e);
                                              alert('Error: ', e);
                                              }
                                              
                                              function success(fileEntry) {
                                              var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
                                              // Only copy because of access rights
                                              $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function (success) {
                                                                                                                                            $scope.image = cordova.file.dataDirectory + newFileName;
                                                                                                                                            $rootScope.imageUrl = $scope.image;
                                                                                                                                            $rootScope.imageURLs.push({ imageName: newFileName, src: $scope.image });
                                                                                                                                            $rootScope.imageName = newFileName;
                                                                                                                                            $rootScope.filePath = cordova.file.dataDirectory;
                                                                                                                                            //  alert($rootScope.id);
                                                                                                                                            $rootScope.photoCount++;
                                                                                                                                            if ($rootScope.photoCount < 10) {
                                                                                                                                            //$scope.imageurls = $rootScope.imageURLs;
                                                                                                                                            $scope.selectPicture(sourceType); //$scope.loadImage(); //
                                                                                                                                            $rootScope.selectedImages.push($rootScope.photoCount - 1);
                                                                                                                                            //$state.go('app.browse');
                                                                                                                                            }
                                                                                                                                            else {
                                                                                                                                            //$state.go('app.browse');
                                                                                                                                            }
                                                                                                                                            }, function (error) {
                                                                                                                                            $scope.showAlert('Error', error.exception);
                                                                                                                                            });
                                              };
                                              }
                                              );
        } else {
        var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        // Move the file to permanent storage
        $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function (success) {
                           $scope.image = cordova.file.dataDirectory + newFileName;
                          $rootScope.imageUrl = $scope.image;
                         $rootScope.imageURLs.push({ imageName: newFileName, src: $scope.image });
                         $rootScope.imageName = newFileName;
                         $rootScope.filePath = cordova.file.dataDirectory;
                      //alert($rootScope.id);
                        $rootScope.photoCount++;
                          if ($rootScope.photoCount < 10) {
                            //$scope.imageurls = $rootScope.imageURLs;
                              $scope.selectPicture(sourceType);  //$scope.loadImage(); //
                              $rootScope.selectedImages.push($rootScope.photoCount - 1);
                                 //$state.go('app.browse');
                          }
                          else {
                              //$state.go('app.browse');
                               }
                        }, function (error) {
                                $scope.showAlert('Error', error.exception);
                   });
        }
            //if ($rootScope.photoCount > 0) {
            $state.go('app.browse');
            //}
            $scope.hideLoading();
            
            }
            
            })


.controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', 'filename', 'restUrl', function ($scope, $modalInstance, filename, restUrl) {
                                  $scope.filename = filename;
                                  $scope.restUrl = restUrl;
                                  
                                  $scope.ok = function () {
                                  $modalInstance.close($scope.filename);
                                  };
                                  
                                  $scope.cancel = function () {
                                  $modalInstance.dismiss('cancel');
                                  };
                                  }])

.controller('PreviewPageCtrl', function PreviewPageCtrl($scope, $timeout, $stateParams, $ionicHistory, $state, $window) {
            
            //get file url and directly load to images
            $scope.imageUrl = $stateParams.imageUrl;
            
            
            $scope.drawOnImage = function () {
            console.log("DATA:drawOnImage" + $window.localStorage.getItem('IMAGE_WIDTH'));
            
            $state.go('drawonimage', { imageUrl: $scope.imageUrl, width: $window.localStorage.getItem('IMAGE_WIDTH'), height: $window.localStorage.getItem("IMAGE_HEIGHT") });
            };
            
            // add new code
            
            
            $scope.closeModal = function () {
            $ionicHistory.backView().go();
            };
            })

.controller('DrawOnImageCtrl', function DrawOnImageCtrl($scope, $timeout, $stateParams, $ionicHistory) {
            //get file url and directly load to images
            $scope.imageUrlToDraw = $stateParams.imageUrl;
            $scope.imageWidth = $stateParams.width;
            $scope.imageHeight = $stateParams.height;
            console.log("DrawOnImageCtrl" + $scope.imageUrlToDraw + "|" + $scope.imageWidth + "|" + $scope.imageHeight);
            
            $scope.closeModal = function () {
            $ionicHistory.backView().go();
            };
            })


.controller('openfileCtrl', function openfileCtrl($scope, $sce, $stateParams, $ionicHistory) {
            
            $scope.fileurl = $sce.trustAsResourceUrl($stateParams.fileUrl);
            $scope.fileName = $stateParams.fileUrl;
            
            $scope.goBack = function goBack() {
            $ionicHistory.backView().go();
            };
            })

.controller('PlaylistCtrl', function ($scope, REST_URL, $stateParams, Device, $rootScope,
                                      $cordovaDevice, $cordovaFile, $ionicPlatform, $cordovaEmailComposer,
                                      $cordovaCamera, $cordovaFileTransfer, $ionicPopup, $state, $ionicLoading, $ionicModal,$location,$window,$cordovaActionSheet) {
            $scope.zoomMin = 1;
            
            $scope.showAlert = function (title, msg) {
            var alertPopup = $ionicPopup.alert({
                                               title: title,
                                               template: msg
                                               });
            }
            
            //$scope.imageurls = [{ src: 'img/10.jpg', imageName: "10.jpg" }];
            $scope.imageurls = $rootScope.imageURLs;
            
            //get file url and directly load to images
            var imageUrl = $rootScope.url;
            var oDate = $rootScope.currentDate;
            // alert(oDate);
            //alert($rootScope.id);
            //alert(" $rootScope.OpdId",$rootScope.id);
            
            // var id = $rootScope.id;
            // alert("id",id);
            
            var image_Name = $rootScope.imageName;
            // alert(image_Name);
            /*$scope.addImage = function(type) {
             $scope.hideSheet();
             ImageService.handleMediaDialog(type,$stateParams.Opdid,REST_URL).then(functionn() {
             $scope.$apply();
             });
             }*/
            
            /* $scope.uploadFiles = function () {
             //alert($rootScope.selectedImages.length);
             if ($rootScope.selectedImages.length == 0) {
             alert("Please select atleast one image.");
             }
             else {
             for (var i = 0; i < $rootScope.selectedImages.length; i++) {
             //var url = "http://localhost:8888/upload.php";
             var url = REST_URL + '/patient/diagnosis_image_fileupload/' + $rootScope.id;
             //  alert(url);
             // File for Upload
             var targetPath = $rootScope.filePath + $scope.imageurls[$rootScope.selectedImages[i]].imageName;
             //$scope.pathForImage($scope.image);
             //alert(targetPath);
             // File name only
             var filename = $scope.imageurls[$rootScope.selectedImages[i]].imageName;
             //alert(filename);
             
             var options = {
             fileKey: "file",
             fileName: filename,
             chunkedMode: false,
             mimeType: "multipart/form-data",
             params: { 'fileName': filename }
             };
             
             $ionicLoading.show({
             content: 'Loading',
             animation: 'fade-in',
             showBackdrop: true,
             maxWidth: 200,
             showDelay: 0
             });
             // $rootScope.flag = 1;
             // $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
             
             // });
             
             $cordovaFileTransfer.upload(url, targetPath, options)
             .then(function (result) {
             // Success!
             $scope.showAlert('Success', 'Image(s) upload finished.');
             }, function (err) {
             // Error
             }, function (progress) {
             $timeout(function () {
             $scope.downloadProgress = (progress.loaded / progress.total) * 100;
             });
             });
             }
             
             //    $scope.showAlert('Success', 'Image(s) upload finished.');
             //  $ionicLoading.hide();
             $rootScope.imageURLs = [];
             $rootScope.photoCount = 0;
             $rootScope.selectedImages = [];
             //alert($rootScope.id);
             //alert('currentDate1: ' + $rootScope.currentDate);
             //$state.go('app.checkup', { Opdid: $rootScope.id, OPDDate: $rootScope.currentDate }, { reload: true });
             //$state.transitionTo('app.existing', null, {reload: true, notify:true});
             }
             } */
            
            // aGanesh
            
            var i = 0;
            var url1 = REST_URL + '/patient/diagnosis_image_fileupload/' + $rootScope.id;
            
            $scope.uploadFiles = function () {
            
            if ($rootScope.selectedImages.length == 0) {
            alert("Please select atleast one image.");
            }
            else {
            
            // File for Upload
            var targetPath = $rootScope.filePath + $scope.imageurls[$rootScope.selectedImages[i]].imageName;
            
            // File name only
            var filename = $scope.imageurls[$rootScope.selectedImages[i]].imageName;
            
            var options = {
            fileKey: "file",
            fileName: filename,
            quality: 50,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: { 'fileName': filename }
            };
            
            $ionicLoading.show({
                               content: 'Loading',
                               animation: 'fade-in',
                               showBackdrop: true,
                               maxWidth: 200,
                               showDelay: 0
                               });
            
            $cordovaFileTransfer.upload(url1, targetPath, options)
            .then(function (result) {
                  // Success!
                  //$scope.showAlert('Success', JSON.stringify(result) + ' ' + targetPath + ' ' + url1);
                  i++;
                  
                  if (i == $rootScope.selectedImages.length) {
                  $rootScope.imageURLs = [];
                  $rootScope.photoCount = 0;
                  $rootScope.selectedImages = [];
                  $ionicLoading.hide();
                  $scope.showAlert('Success', 'Image(s) upload finished.');
                  // $state.transitionTo('app.existing', null, { reload: false, notify: true });
                 
                  
                  //--****** moved on ExistingPatientHistory : START ---
                     //var id =   $window.localStorage.getItem("ExistingPatientClickedID");
                     //console.log("$rootScope.id"+id);
                     //$location.path('app/ExistingPatientHistory/' + id);
                  
                  //--****** moved on ExistingPatientHistory : END ---
                  
                  //----****** moved on checkUp(image list) : START----
                 var Opdid= $window.localStorage.getItem("PatientHistoryItemClicked_ID");
                 var OPDDate= $window.localStorage.getItem("PatientHistoryItemClicked_OPDDATE");
                  
                  console.log("uploadFiles ERROR : Opdid-"+Opdid +"| OPDDate- "+OPDDate);
                  
                  $state.go('app.checkup', { Opdid: Opdid, OPDDate: OPDDate });
                  
                  //----****** moved on checkUp(image list) : END----
                  
                  } else {
                  
                  // File for Upload
                  targetPath = $rootScope.filePath + $scope.imageurls[$rootScope.selectedImages[i]].imageName;
                  
                  // File name only
                  filename = $scope.imageurls[$rootScope.selectedImages[i]].imageName;
                  
                  options = {
                  fileKey: "file",
                  fileName: filename,
                  chunkedMode: false,
                  quality: 50,
                  mimeType: "multipart/form-data",
                  params: { 'fileName': filename }
                  };
                  $scope.uploadFiles();
                  }
                  
                  }, function (err) {
                  i++;
                  // Error
                  if (i == $rootScope.selectedImages.length) {
                  $rootScope.imageURLs = [];
                  $rootScope.photoCount = 0;
                  $rootScope.selectedImages = [];
                  $ionicLoading.hide();
                  $scope.showAlert('Success', 'Image(s) upload finished.');
                  
                  // $state.transitionTo('app.existing', null, { reload: false, notify: true });
                  
                  //---$$$$$$$ DUPLICATE FROM ABOVE
                  //--****** moved on ExistingPatientHistory : START ---
                  //var id =   $window.localStorage.getItem("ExistingPatientClickedID");
                  //console.log("$rootScope.id"+id);
                  //$location.path('app/ExistingPatientHistory/' + id);
                  
                  //--****** moved on ExistingPatientHistory : END ---
                  
                  //----****** moved on checkUp(image list) : START----
                  var Opdid= $window.localStorage.getItem("PatientHistoryItemClicked_ID");
                  var OPDDate= $window.localStorage.getItem("PatientHistoryItemClicked_OPDDATE");
                  
                  console.log("uploadFiles ERROR : Opdid-"+Opdid +"| OPDDate- "+OPDDate);
                  
                  $state.go('app.checkup', { Opdid: Opdid, OPDDate: OPDDate });
                  
                  //----****** moved on checkUp(image list) : END----
                  
                  } else {
                  // File for Upload
                  targetPath = $rootScope.filePath + $scope.imageurls[$rootScope.selectedImages[i]].imageName;
                  
                  // File name only
                  filename = $scope.imageurls[$rootScope.selectedImages[i]].imageName;
                  
                  options = {
                  fileKey: "file",
                  fileName: filename,
                  chunkedMode: false,
                  quality: 50,
                  mimeType: "multipart/form-data",
                  params: { 'fileName': filename }
                  };
                  $scope.uploadFiles();
                  }
                  }, function (progress) {
                  $timeout(function () {
                           $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                           });
                  });
            }
            }
            
            $scope.chkClick = function (divObj, index) {
            var indx = $rootScope.selectedImages.indexOf(index);
            if (indx === -1) {
            $rootScope.selectedImages.push(index);
            document.getElementById("div" + index).style.borderColor = "blue";
            } else {
            $rootScope.selectedImages.splice(indx, 1);
            document.getElementById("div" + index).style.borderColor = "black";
            }
            //divObj.style.borderColor = "red";
            }
            
            $scope.cancelImage = function () {
            //alert($rootScope.id);
            //alert(oDate);
            
            $state.go('app.checkup', { Opdid: $rootScope.id, OPDDate: $rootScope.currentDate });
            //$ionicHistory.backView().go();
            }
            
            $scope.showImages = function (index) {
            
            //----- Option dialog for image : START
            
            //$state.go('app.browse');
            var options = {
            title: 'Please select',
            buttonLabels: ['View', 'Delete'],
            addCancelButtonWithLabel: 'Cancel',
            androidEnableCancelButton: true,
            };
            $cordovaActionSheet.show(options).then(function (btnIndex) {
                                                   var type = null;
                                                   if (btnIndex === 2) {
                                                   
                                                   var indx = $rootScope.selectedImages.indexOf(index);
                                                   $rootScope.selectedImages.splice(indx, 1);
                                                   $scope.imageurls.splice(indx, 1);
                                                   
                                                   //-- To reset array position in $rootScope.selectedImages
                                                   var size = $rootScope.selectedImages.length;
                                                   for(var i =0 ;i<size;i++){
                                                   $rootScope.selectedImages[i] = i;
                                                   }
                                                   //----------------

                                                   } else if (btnIndex === 1) {
                                                   $scope.activeSlide = index;
                                                   $scope.zoomimagesrc = $scope.imageurls[index].src;
                                                   $scope.showModal('templates/zoomview.html');
                                                   }
                                                   
                                                   });
            
            //----- Option dialog for image : END
            
            }
            
            $scope.showModal = function (templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                                        scope: $scope
                                        }).then(function (modal) {
                                                $scope.modal = modal;
                                                $scope.modal.show();
                                                });
            }
            
            $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.modal.remove()
            }
            
            $scope.scrollHandle = function (index) {
            
            }
            });
