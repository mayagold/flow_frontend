var app = angular.module('flow-app', []);


////////////////////////////////////////////////
// JQUERY
////////////////////////////////////////////////

(function($) { // Begin jQuery
  // slideshow
  let slideshow = () => {
    setInterval(function() {
      $("#slideshow > div:gt(0)").hide()
      $('#slideshow > div:first')
      .fadeOut(3000)
      .next()
      .fadeIn(3000)
      .end()
      .appendTo('#slideshow');
    },  6000);
  }
    slideshow();
  // nav toggle
  $(function() { // DOM ready
    // If a link has a dropdown, add sub menu toggle.
    $('nav ul li a:not(:only-child)').click(function(e) {
      $(this).siblings('.nav-dropdown').toggle();
      // Close one dropdown when selecting another
      $('.nav-dropdown').not($(this).siblings()).hide();
      e.stopPropagation();
    });
    // Clicking away from dropdown will remove the dropdown class
    $('html').click(function() {
      $('.nav-dropdown').hide();
    });
    // Toggle open and close nav styles on click
    $('#nav-toggle').click(function() {
      $('nav ul').slideToggle();
    });
    // Hamburger to X toggle
    $('#nav-toggle').on('click', function() {
      this.classList.toggle('active');
    });
  }); // end DOM ready
})(jQuery); // end jQuery

////////////////////////////////////////////////
// AngularJS Controller
////////////////////////////////////////////////

app.controller('appController', ['$http', '$scope', '$filter', function($http, $scope, $filter){

  console.log('hi');

  this.url = 'http://localhost:3000';
  var self = this;
  this.user = {};
  this.users = [];
  self.quotes = [];
  self.photos = [];
  self.members = [];
  self.gear = [];
  self.showQuotes = false;
  self.showPhotos = false;
  self.showGear = false;
  self.showMembers = false;
  self.homepage = true;
  self.register = false;

  // Page toggle -- very not DRY
  this.toggleRegister = function(){
    self.register = true;
    self.showQuotes = false;
    self.showPhotos = false;
    self.showGear = false;
    self.showMembers = false;
    self.homepage = false;
  }

  this.toggleQuotes = function(){
    self.showQuotes = true;
    self.showPhotos = false;
    self.showGear = false;
    self.showMembers = false;
    self.homepage = false;
    self.register = false;

  }
  this.togglePhotos = function(){
    self.showQuotes = false;
    self.showPhotos = true;
    self.showGear = false;
    self.showMembers = false;
    self.homepage = false;
    self.register = false;

  }
  this.toggleGear = function(){
    self.showQuotes = false;
    self.showPhotos = false;
    self.showGear = true;
    self.showMembers = false;
    self.homepage = false;
    self.register = false;

  }
  this.toggleLineup = function(){
    self.showQuotes = false;
    self.showPhotos = false;
    self.showGear = false;
    self.showMembers = true;
    self.homepage = false;
    self.register = false;

  }
  this.toggleHomepage = function(){
    self.showQuotes = false;
    self.showPhotos = false;
    self.showGear = false;
    self.showMembers = false;
    self.homepage = true;
    self.register = false;

  }
  ////////////////
  // Get routes
  ////////////////
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
    url: self.url + '/members'
  }).then(response=>{
    console.log(response);
    self.members = response.data;
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
  ////////////////
  // Post routes
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
  this.postToLineup = function(newProfile){
    $http({
      method: 'POST',
      url: self.url + '/members',
      data: { member: { name: newProfile.name, location: newProfile.location, sports: newProfile.sports, goals: newProfile.goals, user_id: self.user.id, photo: newProfile.photo }}
    }).then(response=>{
      self.members.unshift(response.data);
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
  ////////////////
  // Delete routes
  ////////////////
  $scope.deleteQuote = function(quote){
    $scope.currentQuote = quote;
    let id = $scope.currentQuote.id;
    let index = self.quotes.indexOf($scope.currentQuote);
    $http({
      method: 'DELETE',
      url: self.url + '/quotes/' + id,
    }).then(response=>{
      self.quotes.splice(index,1);
    }).catch(err=>console.log(err))
  }
  $scope.deletePhoto = function(photo){
    $scope.currentPhoto = photo;
    let id = $scope.currentPhoto.id;
    let index = self.photos.indexOf($scope.currentPhoto);
    $http({
      method: 'DELETE',
      url: self.url + '/photos/' + id,
    }).then(response=>{
      self.photos.splice(index,1);
    }).catch(err=>console.log(err))
  }
  $scope.deleteGear = function(gear){
    $scope.currentGear = gear;
    let id = $scope.currentGear.id;
    let index = self.gear.indexOf($scope.currentGear);
    $http({
      method: 'DELETE',
      url: self.url + '/gears/' + id,
    }).then(response=>{
      self.gear.splice(index,1);
    }).catch(err=>console.log(err))
  }


  ////////////////
  // Edit routes
  ////////////////

  // User Auth functions
  this.login = function(userPass){
    $http({
      method: 'POST',
      url: this.url + '/users/login',
      data: { user: { username: userPass.username, password: userPass.password }}
    }).then(function(response){
      console.log(response);
      self.user = response.data.user;
      console.log(response.data.user);
      localStorage.setItem('token', JSON.stringify(response.data.token));
    }.bind(this));
  }
  this.registerUser = function(userReg){
    $http({
      method: 'POST',
      url: this.url + '/users/',
      data: { user: {username: userReg.username, password: userReg.password }},
    }).then(function(result){
      console.log(userReg);
      console.log(result);
      self.login(userReg);
    })
  }
  //
  // this.getUsers = function(){
  //   $http({
  //     url: self.url + '/users',
  //     method: 'GET',
  //     headers: {
  //       Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
  //     }
  //   }).then(function(response){
  //     console.log(response);
  //     if (response.data.status==401){
  //       this.error = "Unauthorized";
  //     } else {
  //       this.users = response.data;
  //     }
  //   }.bind(this));
  // }
  this.logout = function(){
    localStorage.clear('token');
    location.reload();
  }
}])
