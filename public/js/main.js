// Initialize Firebase
var config = {
    apiKey: "AIzaSyDJhFgFb2cMRO6RddCibBOXToa0OaFoLf8",
    authDomain: "spot-the-human.firebaseapp.com",
    databaseURL: "https://spot-the-human.firebaseio.com",
    projectId: "spot-the-human",
    storageBucket: "spot-the-human.appspot.com",
    messagingSenderId: "185370764051"
  };
  firebase.initializeApp(config);
  
  // Reference messages collection
  var userRef = firebase.database().ref('user');
  
  // Listen for form submit
  document.getElementById('login-form').addEventListener('submit', findGame);
  
  // Submit form
  function findGame(e){
    e.preventDefault();
  
    // Get values
    var username = getInputVal('username');

    // Save message
    loginUser(username);


    window.location.replace("http://localhost:8080/game");
  }
  
  // Function to get get form values
  function getInputVal(id){
    return document.getElementById(id).value;
  }
  
  // Save message to firebase
  function loginUser(username){
    var newUserRef = userRef.push();
    newUserRef.set({
        username: username
    });
  }