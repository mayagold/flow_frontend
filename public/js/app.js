var app = angular.module('flow-app', []);

////////////////////////////////////////////////
// JQUERY
////////////////////////////////////////////////

(function($) {
  $(function() { // DOM ready

    // slideshow
    // src: https://css-tricks.com/snippets/jquery/simple-auto-playing-slideshow/

    let slideshow = () => {
      $("#slideshow > div:gt(0)").hide()
      setInterval(function() {
        $('#slideshow > div:first')
        .fadeOut(3000)
        .next()
        .fadeIn(3000)
        .end()
        .appendTo('#slideshow');
      },  6000);
    }
      slideshow();

    // mobile-responsive nav bar
    // src: https://codepen.io/taniarascia/pen/dYvvYv

    $('nav ul li a:not(:only-child)').click(function(e) {
      $(this).siblings('.nav-dropdown').toggle();
      $('.nav-dropdown').not($(this).siblings()).hide();
      e.stopPropagation();
    });
    $('html').click(function() {
      $('.nav-dropdown').hide();
    });
    $('#nav-toggle').click(function() {
      $('nav ul').slideToggle();
    });
    $('#nav-toggle').on('click', function() {
      this.classList.toggle('active');
    });
  }); // end DOM ready
})(jQuery); // end jQuery

////////////////////////////////////////////////
// AngularJS Controller
////////////////////////////////////////////////

app.controller('appController', ['$http', '$scope', '$filter', function($http, $scope, $filter){

  var self       = this;

  this.url       = 'https://noedits-api.herokuapp.com';
  this.user      = {};
  this.users     = [];
  this.quotes    = [];
  this.photos    = [];
  this.members   = [];
  this.gear      = [];

  this.homepage     = true;
  this.showQuotes   = false;
  this.showPhotos   = false;
  this.showGear     = false;
  this.showMembers  = false;
  this.register     = false;

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
  ////////////////

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
      data: { gear: { name: newGear.name, brand: newGear.brand, sport: newGear.sport, review: newGear.review, image_url: newGear.image_url, user_id: self.user.id,}}
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
  $scope.deleteProfile = function(member){
    $scope.currentMember = member;
    let id = $scope.currentMember.id;
    let index = self.gear.indexOf($scope.currentMember);
    $http({
      method: 'DELETE',
      url: self.url + '/members/' + id,
    }).then(response=>{
      self.members.splice(index,1);
    }).catch(err=>console.log(err))
  }

  ////////////////
  // Edit routes
  ////////////////
    //quotes
    $scope.editQuote = function(quote){
      $scope.editingQuote = quote;
      self.showEditQuoteForm = true;
      console.log(quote, ' this is quote');
    }
    $scope.submitEditQuote = function(){
      console.log('calling edit function');
      console.log($scope.editingQuote);
      let id = $scope.editingQuote.id;
      let index = self.quotes.indexOf($scope.editingQuote);
      $http({
        method: 'PUT',
        url: self.url + '/quotes/' + id,
        data: { quote: {
          author: self.editedQuote.author,
          content: self.editedQuote.content,
          user_id: self.user.id }}
      }).then(response=>{
        console.log(response);
        self.quotes.splice(index,1);
        self.quotes.unshift(response.data);
      }).catch(err=>console.log(err));
    }
    // photos
    $scope.editPhoto = function(photo){
      $scope.editingPhoto = photo;
      self.showEditPhotoForm = true;
      console.log(photo, ' this is photo');
    }
    $scope.submitEditPhoto = function(){
      console.log('calling edit function');
      console.log($scope.editingPhoto);
      let id = $scope.editingPhoto.id;
      let index = self.photos.indexOf($scope.editingPhoto);
      $http({
        method: 'PUT',
        url: self.url + '/photos/' + id,
        data: { photo: {
          url: self.editedPhoto.url,
          title: self.editedPhoto.title,
          subject: self.editedPhoto.subject,
          caption: self.editedPhoto.caption,
          user_id: self.user.id }}
      }).then(response=>{
        console.log(response);
        self.photos.splice(index,1);
        self.photos.unshift(response.data);
      }).catch(err=>console.log(err));
    }
    // gear
    $scope.editGear = function(gear){
      $scope.editingGear = gear;
      self.showEditGearForm = true;
      console.log(gear, ' this is gear');
    }
    $scope.submitEditGear = function(){
      console.log('calling edit function');
      console.log($scope.editingGear);
      let id = $scope.editingGear.id;
      let index = self.gear.indexOf($scope.editingGear);
      $http({
        method: 'PUT',
        url: self.url + '/gears/' + id,
        data: { gear: {
          name: self.editedGear.name,
          image_url: self.editedGear.image_url,
          brand: self.editedGear.brand,
          sport: self.editedGear.sport,
          review: self.editedGear.review,
          user_id: self.user.id }}
      }).then(response=>{
        console.log(response);
        self.gear.splice(index,1);
        self.gear.unshift(response.data);
      }).catch(err=>console.log(err));
    }
    




  ////////////////
  // User Auth
  ////////////////

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
