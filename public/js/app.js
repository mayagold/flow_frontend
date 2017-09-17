
var app = angular.module('flow-app', []);




// AngularJS Controller

app.controller('appController', ['$http', '$scope', '$filter', function($http, $scope, $filter){

  console.log('hi');


  this.url = 'http://localhost:3000';
  var self = this;
  this.user = {};
  this.users = [];
  self.quotes = [];
  self.photos = [];

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

  // Post routes for quotes and photos
  this.postQuote = function(newQuote) {
    $http({
      method: 'POST',
      url: self.url + '/quotes',
      data: { quote: { author: newQuote.author, content: newQuote.content, user_id: self.user.id }}
    }).then(response=>{
      self.quotes.unshift(response.data);
      console.log(response);
    }).catch(err=>console.log(err))
  }

  this.postPhoto = function(newPhoto) {
    $http({
      method: 'POST',
      url: self.url + '/photos',
      data: { photo: { url: newPhoto.url, title: newPhoto.title, subject: newPhoto.subject, caption: newPhoto.caption, user_id: self.user.id }}
    }).then(response=>{
      self.photos.unshift(response.data);
      console.log(response);
    }).catch(err=>console.log(err))
  }

  // Delete routes for quotes and photos



  // Login function

  this.login = function(userPass) {
    $http({
      method: 'POST',
      url: this.url + '/users/login',
      data: { user: { username: userPass.username, password: userPass.password }}
    }).then(function(response){
      console.log(response);
      self.user = response.data.user;
      localStorage.setItem('token', JSON.stringify(response.data.token));
    }.bind(this));
  }
  //
  this.getUsers = function(){
    $http({
      url: self.url + '/users',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response){
      console.log(response);
      if (response.data.status==401){
        this.error = "Unauthorized";
      } else {
        this.users = response.data;
      }
    }.bind(this));
  }

  this.logout = function(){
    localStorage.clear('token');
    location.reload();
  }

}])
