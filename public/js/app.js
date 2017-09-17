
var app = angular.module('flow-app', []);




// AngularJS Controller

app.controller('appController', ['$http', '$scope', '$filter', function($http, $scope, $filter){

  console.log('hi');


  this.url = 'http://localhost:3000';
  var self = this;
  this.user = {};

  $http({
    method: 'GET',
    url: self.url + '/quotes'
  }).then(response=>{
    console.log(response);
    self.quotes = response.data;
  }).catch(err=>{
    console.log(err);
  })

  $http({
    method: 'GET',
    url: self.url + '/photos'
  }).then(response=>{
    console.log(response);
    self.photos = response.data;
  }).catch(err=>{
    console.log(err);
  })

  // Login function

  this.login = function(userPass) {
    console.log(userPass);
    $http({
      method: 'POST',
      url: this.url + '/users/login',
      data: { user: { username: userPass.username, password: userPass.password }}
    }).then(function(response){
      self.user = response.data.user;
      localStorage.setItem('token', JSON.stringify(response.data.token));
      console.log(localStorage.token);
    }.bind(this));
  }

}])
