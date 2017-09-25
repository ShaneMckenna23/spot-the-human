  
  // Listen for form submit
  document.getElementById('login-form').addEventListener('submit', findGame);
  
  // Submit form
  function findGame(e){
    e.preventDefault();
  
    // Get values
    var username = getInputVal('username');

    localStorage.setItem("user", username);

    window.location.replace("http://localhost:8080/game");
  }
  
  // Function to get get form values
  function getInputVal(id){
    return document.getElementById(id).value;
  }