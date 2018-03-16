// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'angularMoment', 'pdf', 'signature', 'ngImageDimensions'])

//--- Change URL  START: 24 FEB 2017 
//.constant('REST_URL','http://backend.medsonit.com') //'http://backend.medsonit.com' //http://localhost:10001
.constant('REST_URL', 'http://myrescribe.com/medsonit-be') // // 'http://ec2-35-154-104-187.ap-south-1.compute.amazonaws.com/medsonit-be' 'http://bemr.medsonit.com'  //'http://backend.medsonit.com' //http://localhost:10001

//--- Change URL  START: 24 FEB 2017 

.run(function($ionicPlatform,$rootScope, $location, $http,$state,$cordovaNetwork,Device,$ionicPopup,$window) 
{
  
  $rootScope.online = navigator.onLine;
  $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
          //$rootScope.online = false;
           window.alert("There is no internet connection available");
        });
      }, false);

      $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
         // $rootScope.online = true;
        });
  }, false);
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
   
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

        $rootScope.globals = JSON.parse(localStorage.getItem('globals')) || {};
        $http.defaults.headers.common['Auth-Key'] = 'simplerestapi'; // jshint ignore:line
        $http.defaults.headers.common['Client-Service'] = 'frontend-client'; // jshint ignore:line
        if ($rootScope.globals.key) {
            $http.defaults.headers.common['Authorization-Token'] = $rootScope.globals.key;
            $http.defaults.headers.common['User-ID'] = $rootScope.globals.userId;
        }

               
                 
      /*  if ((Object.keys($rootScope.globals).length === 0) && toState.name!='access.login') {
            event.preventDefault();
            return $state.go('access.login');
        }*/
    });


  $rootScope.flag = 0;
  $rootScope.flag1 = 0;
  $rootScope.previousState;
  $rootScope.currentState;
$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
    $rootScope.previousState = from.name;
    $rootScope.currentState = to.name;
    $rootScope.previousStateParams = fromParams;
  
});
})

.filter('dateFormat1', function($filter)
{
 return function(input)
 {
  if(input == null){ return ""; } 
    if(input == "") {return;}
  var _date = ""+$filter('date')(new Date(input), 'dd/MM/yyyy');
 
  return _date.toUpperCase();

 };
})

.directive("limitTo", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
    }
}])

.directive('onlyLettersInput',function onlyLettersInput() {
      return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
          function fromUser(text) {
            var transformedInput = text.replace(/[^a-zA-Z]/, ' ');
            //console.log(transformedInput);
            if (transformedInput !== text) {
              ngModelCtrl.$setViewValue(transformedInput);
              ngModelCtrl.$render();
            }
            return transformedInput;
          }
          ngModelCtrl.$parsers.push(fromUser);
        }
      };
    })

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.platform.android.views.maxCache(5);
    $ionicConfigProvider.platform.ios.views.maxCache(5);
    $ionicConfigProvider.views.maxCache(0);
  $ionicConfigProvider.backButton.previousTitleText(false).text('');
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

// Left side menu display existing patient list
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'PatientCtrl',
        cache: false
      }
    }
  })

  .state('app.PatientDetailsList', {
      url: '/PatientDetailsList/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/patientlist.html',
          controller: 'PatientDetails',
          cache: false
        }
      }
    })

 .state('previewpage', {
    url: '/previewpage/:imageUrl',
    templateUrl: 'templates/image-popover.html',
    controller: 'PreviewPageCtrl',
    cache: false
 })
 .state('drawonimage', {
     url: '/drawonimage/:imageUrl/:width/:height',
    templateUrl: 'templates/draw_on_image.html',
    controller: 'DrawOnImageCtrl',
    cache: false
  })

  .state('file-viewer',{
    url: '/file-viewer/:fileUrl/:fileName',
    templateUrl: 'templates/file-viewer.html',
    controller: 'openfileCtrl',
    cache: false

  })
  .state('open',{
    url: '/open/:imageUrl',
    templateUrl: 'templates/Viewer.html',
    controller: 'openpdfCtrl',
    cache: false
  })
  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'PlaylistCtrl',
          cache: false
        }
      }
    })
    // .state('app.playlists', {
    //   url: '/playlists',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/playlists.html',
    //       controller: 'PlaylistsCtrl'
    //     }
    //   }
    // })

    .state('app.ExistingPatientHistory', {
        url: '/ExistingPatientHistory/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/ExistingPatientHistory.html',
          controller: 'PatientDetailsCtrl',
          cache:false
        }
      }
    })

    .state('app.checkup',{
        url: '/checkup/:Opdid/date/:OPDDate',
        views: {
        'menuContent': {
          templateUrl: 'templates/checkup.html',
          controller: 'CheckupCtrl',
          cache: false
     
        }
      }
    })

  // .state('app.single', {
  //   url: '/playlists/:playlistId',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/playlist.html',
  //       controller: 'PlaylistCtrl'
  //     }
  //   }
  // })

  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardCtrl',
          cache: false
      }
    }
  })

  // new button click patient
  
  .state('app.new',{
    url:'/new',
    views:{
      'menuContent':{
        templateUrl:'templates/new.html',
        controller: 'NewPatientCtrl',
        cache: false
      }
    }
  })

// existing button click  
   .state('app.existing',{
    url:'/existing',
     views:{
      'menuContent':{
        templateUrl:'templates/ExistingPatientlist.html',
        controller:'ExistingPatientCtrl',
        cache: false
      }
    }
  })

// login page 

  .state('login',{
      url:'/login',
      templateUrl:'templates/login.html',
      controller:'LoginController'
    });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise(function($injector, $location){
                                    var status = localStorage.getItem("isLoginRemember");
                                   // alert("window app.js" +status);
                                  
                                     if (status === 'YES') {
                                     
                                      $location.path('app/existing');
                                     
                                     } else {
                                     
                                      $location.path('/login');
                                                                          
                                     }
                                     
                                     return true;
                                     });
        
       
});
