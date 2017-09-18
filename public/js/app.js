
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
  self.gear = [];
  self.showQuotes = false;
  self.showPhotos = false;
  self.showGear = false;

  this.toggleQuotes = function(){
    self.showQuotes = true;
    self.showPhotos = false;
    self.showGear = false;
  }
  this.togglePhotos = function(){
    self.showQuotes = false;
    self.showPhotos = true;
    self.showGear = false;
  }
  this.toggleGear = function(){
    self.showQuotes = false;
    self.showPhotos = false;
    self.showGear = true;
  }

  // Get routes for quotes, gear and photos
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
    url: self.url + '/gears'
  }).then(response=>{
    console.log(response);
    self.gear = response.data;
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

  // Post routes for quotes, gear reviews, and photos
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
  this.postGearReview = function(newGear) {
    $http({
      method: 'POST',
      url: self.url + '/gears',
      data: { gear: { name: newGear.name, brand: newGear.brand, sport: newGear.sport, review: newGear.review, user_id: self.user.id, image_url: newGear.image_url }}
    }).then(response=>{
      self.gear.unshift(response.data);
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

  // Delete routes for quotes, gears, photos



  // Login function

  this.login = function(userPass){
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
  this.register = function(userReg){
    $http({
      method: 'POST',
      url: self.url + '/users/',
      data: { user: {username: userReg.username, password: userReg.password }},
    }).then(function(result){
      self.login(userReg);
    })
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
