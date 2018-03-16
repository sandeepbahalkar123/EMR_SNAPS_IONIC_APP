angular.module('starter.services', [])
 
.factory('Device', function Device() {

    var imageurl = ""
    var imageUrls = [];
    var opdId = ""
    return {
        getDeviceType: function () {

            // console.log("Now we are checking device");
            // console.log(navigator.userAgent);
            if ((navigator.userAgent.match(/iPhone/)) || (navigator.userAgent.match(/iPad/)) || (navigator.userAgent.match(/Macintosh/)) || (navigator.userAgent.match(/iPod/))) {

                return "apple";
            } else if (navigator.userAgent.match(/Android/)) {

                return "android"
            }

        },
        setImageURL: function (img) {
            imageurl = img;
        },
        getImageURL: function () {
            return imageurl;
        },
        setImageURLs: function (img) {
            imageurls.push(img);
        },
        getImageURLs: function () {
            return imageurls;
        },
        setOpdId: function (id) {
            opdId = id;
        },


    }

})//

   .factory('Alert', function Alert() {

       return {
           networkError: function () {
               return { header: "No Connectivity", msg: "Please check your network connection and try again." }
           },
           credentialsError: function () {
               return { header: "Authentication failed", msg: "Please provide valid credentials." }
           },
           reloginError: function () {
               return { header: "Authentication failed", msg: "Relogin needed." }
           },
           uploadError: function () {
               return { header: "Error", msg: "Please select a file to upload" }
           }
       }

   })// end of 'Alert' factory

    /**
     * It handles Network for the device
     **/

     .factory('Network', function Network() {

         return {
             isOnline: function () {

                 if (navigator.connection.type != "none")
                     return true;
                 else
                     return false;

             }
         }

     })
.factory('AuthenticationService', function ($rootScope, $location, $http, REST_URL, $q, $ionicLoading) {
    'use strict';
    var myObject = {
        loginUser: function (user, REST_URL) {
            console.log(user);
            var deferred = $q.defer();
            var input = {};
            input.username = user.email;
            input.password = user.password;
            try {

                // Setup the loader
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });

                $http({
                    method: 'POST',
                    url: REST_URL + '/auth/login',
                    data: input,
                    headers: {
                        'Content-Type': 'application/json',
                        'Client-Service': 'frontend-client',
                        'Auth-Key': 'simplerestapi'
                    }
                }).success(function (response) {

                    $ionicLoading.hide();
                    console.log(response);
                    if (response.id) {
                        var loginObj = {
                            userId: response.id,
                            key: response.token,
                            userData: response.userData
                        };
                        $rootScope.globals = loginObj;
                        //console.log($rootScope.globals);
                        localStorage.setItem('globals', JSON.stringify($rootScope.globals));
                    }
                    deferred.resolve(response);

                }).error(function () {

                    $ionicLoading.hide();


                    //alert(response.status);
                    return deferred.reject(new Error('Server Down'));
                });
            } catch (e) {
                $ionicLoading.hide();
                //alert(e.description);
                deferred.reject(e);
            }
            return deferred.promise;
        },
        logoutFromApp: function (REST_URL) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: REST_URL + '/auth/logout',
                headers: {
                    'Content-Type': 'application/json',
                    'Client-Service': 'frontend-client',
                    'Auth-Key': 'simplerestapi',
                    'Authorization': $rootScope.globals.key,
                    'User-ID': $rootScope.globals.userId
                }
            }).success(function (response) {
                console.log(response);
                if (response.apistatus === 1) {
                    $rootScope.globals = {};
                    localStorage.removeItem('globals');
                    $http.defaults.headers.common.Authorization = 'none';
                    return response;
                }
            }).error(function () {
                return deferred.reject(new Error('Server Down'));
            });

        }, //logout
        //@todo - Amit  - Delete me later from here
        medType: function (REST_URL) {
            var deferred = $q.defer();
            var input = {};
            $http({
                method: 'GET',
                url: REST_URL + '/medicine/get_medicine_types',
                headers: {
                    'Content-Type': 'application/json',
                    'Client-Service': 'frontend-client',
                    'Auth-Key': 'simplerestapi',
                    'Authorization': $rootScope.globals.key,
                    'User-ID': $rootScope.globals.userId
                }
            }).success(function (response) {
                console.log(response);
            }).error(function () {
                return deferred.reject(new Error('Server Down'));
            });
        }
    }; // myObject
    return myObject;
}) // Authentication


.factory('InvoiceService', function ($q) {
    function createPdf(invoice) {
        return $q(function (resolve, reject) {
            // var dd = createDocumentDefinition(invoice);
            var pdf = pdfMake.createPdf(invoice);

            pdf.getBase64(function (output) {
                resolve(base64ToUint8Array(output));
            });
        });
    }

    return {
        createPdf: createPdf
    };

    function createDocumentDefinition(invoice) {

        var items = invoice.Items.map(function (item) {
            return [item.Description, item.Quantity, item.Price];
        });

        var dd = {
            content: [
                { text: 'INVOICE', style: 'header' },
                { text: invoice.Date, alignment: 'right' },

                { text: 'From', style: 'subheader' },
                invoice.AddressFrom.Name,
                invoice.AddressFrom.Address,
                invoice.AddressFrom.Country,

                { text: 'To', style: 'subheader' },
                invoice.AddressTo.Name,
                invoice.AddressTo.Address,
                invoice.AddressTo.Country,

                { text: 'Items', style: 'subheader' },
                {
                    style: 'itemsTable',
                    table: {
                        widths: ['*', 75, 75],
                        body: [
                            [
                                { text: 'Description', style: 'itemsTableHeader' },
                                { text: 'Quantity', style: 'itemsTableHeader' },
                                { text: 'Price', style: 'itemsTableHeader' },
                            ]
                        ].concat(items)
                    }
                },
                {
                    style: 'totalsTable',
                    table: {
                        widths: ['*', 75, 75],
                        body: [
                            [
                                '',
                                'Subtotal',
                                invoice.Subtotal,
                            ],
                            [
                                '',
                                'Shipping',
                                invoice.Shipping,
                            ],
                            [
                                '',
                                'Total',
                                invoice.Total,
                            ]
                        ]
                    },
                    layout: 'noBorders'
                },
            ],
            styles: {
                header: {
                    fontSize: 20,
                    bold: true,
                    margin: [0, 0, 0, 10],
                    alignment: 'right'
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 20, 0, 5]
                },
                itemsTable: {
                    margin: [0, 5, 0, 15]
                },
                itemsTableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                },
                totalsTable: {
                    bold: true,
                    margin: [0, 30, 0, 0]
                }
            },
            defaultStyle: {
            }
        }

        return dd;
    }

    function base64ToUint8Array(base64) {
        var raw = atob(base64);
        var uint8Array = new Uint8Array(raw.length);
        for (var i = 0; i < raw.length; i++) {
            uint8Array[i] = raw.charCodeAt(i);
        }
        return uint8Array;
    }
})


.factory('FileService', function () {
    var images;
    var IMAGE_STORAGE_KEY = 'images';

    function getImages() {
        var img = window.localStorage.getItem(IMAGE_STORAGE_KEY);
        if (img) {
            images = JSON.parse(img);
        } else {
            images = [];
        }
        return images;
    };

    function addImage(img, REST_URL, $stateParams) {
        images.push(img);
        PatientService.getOPDFiles(REST_URL, $stateParams.Opdid);
        //  window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
    };

    return {
        storeImage: addImage,
        images: getImages
    }
})
.factory('ImageService', function ($cordovaCamera, FileService, $q, $cordovaFile) {

    function makeid() {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    function optionsForType(type) {
        var source;
        switch (type) {
            case 0:
                source = Camera.PictureSourceType.CAMERA;
                break;
            case 1:
                source = Camera.PictureSourceType.PHOTOLIBRARY;
                break;
        }
        return {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: source,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
    }

    function saveMedia(type, $stateParams, REST_URL) {
        return $q(function (resolve, reject) {
            var options = optionsForType(type);

            $cordovaCamera.getPicture(options).then(function (imageUrl) {
                var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
                var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
                var newName = makeid() + name;
                $cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, newName)
                  .then(function (info) {
                      FileService.storeImage(newName, $stateParams.Opdid, REST_URL);
                      resolve();
                  }, function (e) {
                      reject();
                  });
            });
        })
    }
    return {
        handleMediaDialog: saveMedia
    }
})


.service('HttpService', ['$http', '$q', '$ionicLoading', function ($http, $q, $ionicLoading) {
    this.httpRequest = function (method, url, parameters, success, failureCallback) {
        if (typeof success !== "function") {
            success = function (response) {

                console.log("HttpService" + JSON.stringify(response));

                $ionicLoading.hide();
                if (typeof response.data === 'object') {
                    if (typeof response.data === 'object' && response.data.apistatus != 1) {
                        // invalid response
                        return $q.reject(response.data);
                    }
                    return response.data;
                } else {
                    // invalid response
                    return $q.reject(response.data);
                }
            };
        }

        var failure = function (response) {
            $ionicLoading.hide();
            if (typeof failureCallback === "function") {
                failureCallback(response);
            }
            // something went wrong
            if (typeof response.data === 'object') {
                if (response.data === null || response.data.message === null) {
                    throw new Error("Error: Unknown response error");
                } else {
                    throw new Error("Error: " + angular.toJson(response.data.message));
                }
            }
            else {
                throw new Error("Error: " + angular.toJson(response));
            }
            return $q.reject(response.data);
        }


        var postData = {};
        var getParams = {};
        if (method == "POST") {
            postData = parameters;
        }
        else if (method == "GET") {
            getParams = parameters;
        }
        else if (method == "PUT") {
            postData = parameters;
        }
        else if (method == "DELETE") {
            getParams = parameters;
        }
        else {
            throw new Error("Error: method not supported at this time => " + method);
        }


        return $http({
            url: url,
            cache: false,
            params: getParams,
            method: method,
            data: postData
        }).then(success, failure);
    };

    this.enterprisePost = function (url, parameters, success, failureCallback) {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        return this.httpRequest('POST', url, parameters, success, failureCallback);
    };

    this.enterpriseGet = function (url, parameters, success, failureCallback) {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        return this.httpRequest('GET', url, parameters, success, failureCallback);
    };

}])

.factory('PatientService', function ($rootScope, $location, HttpService, $http, $q, $ionicLoading) {
    'use strict';

    var myObject = {

        getPatientlist: function (REST_URL, docId) {
            //var tempDate = new Date();
            //var tempTime = tempDate.getTime();
         var url = REST_URL + '/patient/getAllPatientList/' + docId;//+'/'+tempTime;
        console.log("getPatientlist" + url);
        return HttpService.enterpriseGet(url, null);
    },

     getPatientlistByPatName : function (REST_URL, docId, search) {
        var url = REST_URL + '/patient/getAllPatientList/' + docId + '/' + search;
        return HttpService.enterpriseGet(url, null);
    },

    getPatientDetailById :function (REST_URL, patientId) {
        this.PatientId = patientId
        var url = REST_URL + '/patient/getPatientDetailById/' + patientId;
        return HttpService.enterpriseGet(url, null);
    },

    getOpdDetailsForPatient: function (REST_URL, patientId) {
        var tempDate = new Date();
        var tempTime = tempDate.getTime();
        var url = REST_URL + '/patient/patient_opd_details/' + patientId+'/'+tempTime;
        console.log("SERVICE : getOpdDetailsForPatient:" + url);

        return HttpService.enterpriseGet(url, null);
    },

      getOPDFiles : function  (REST_URL, opdId){
        var tempDate = new Date();
        var tempTime = tempDate.getTime();
        var url = REST_URL + '/patient/get_opd_files/' + opdId + '/' + tempTime;
        console.log("getOPDFiles" + url);
        return HttpService.enterpriseGet(url, null);
    },

    generateOPDId : function (REST_URL, patientId) {
        var url = REST_URL + '/patient/generate_opd_id';
        var params = {
            patientId: patientId
        };
        return HttpService.enterprisePost(url, params);
    },

    //-----------------------------
    addPatientDetail : function (REST_URL, PatientDetail, DocId) {

       //  var url = REST_URL + '/patient/addPatientDetail/' + DocId; // THIS IS COMMENTED, REQUIRED ONLY NAME, OTHER FIELDS ARE OPTIONAL, HENCE CREATED NEW API.
         
         var url = REST_URL + '/patient/addPatientDetailMobile/' + DocId;
        var params = {
            newPatientDetail: PatientDetail
        };
        //        console.log($http.enterpriseGet(url, params));
        //----- 24FEB 2017-----
        //return HttpService.enterpriseGet(url, params);
        //   return HttpService.enterprisePost(url, params, onSuccess, onFailure);
        //----------

        //--- Ritesh Edited code : START 

        // Setup the loader
        //  $ionicLoading.show({
        //    content: 'Loading',
        //  animation: 'fade-in',
        //showBackdrop: true,
        //maxWidth: 200,
        //showDelay: 0
        //});

        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: url,
            params: params,
            data: params
        }).success(function (response) {
            console.log("addPatientDetail " + JSON.stringify(response));
            deferred.resolve(response);
            //  $ionicLoading.hide();
        }).error(function () {
            deferred.reject(new Error('Server Down'));
            //   $ionicLoading.hide();
        });
        return deferred.promise;
        //-- Ritesh Edited Code : END

    },

    //------------------------------

    deleteDiagnosisFile : function (REST_URL, itemId) {
        var url = REST_URL + '/patient/delete_attachments_file_data/' + itemId;
        return HttpService.enterprisePost(url, itemId);
    }

    }
   
    return myObject;
});
