(function () {
  // Configuración de base de datos
  const firebaseConfig = {
    apiKey: 'AIzaSyBgNmCHmSrPoUOre6PPF8NczNBHX-nPR60',
    authDomain: 'vintage-barbershop.firebaseapp.com',
    databaseURL: 'https://vintage-barbershop.firebaseio.com',
    projectId: 'vintage-barbershop',
    storageBucket: 'vintage-barbershop.appspot.com',
    messagingSenderId: '445346562435',
    appId: '1:445346562435:web:5982c738bde72e6c',
  };
  // Inicializar base de datos
  firebase.initializeApp(firebaseConfig);

  // Referencia a la base de datos
  var db = firebase.database();

  // Inicio de sesión
  var liEmail = document.getElementById('liEmail');
  var liPass = document.getElementById('liPass');
  var liBtn = document.getElementById('liBtn');
  liBtn.addEventListener('click', (e) => {
    var validation = true;
    var email = liEmail.value;
    var pass = liPass.value;
    var auth = firebase.auth();
    //Validación
    if (email == '' || pass == '') {
      alert('Complete todos los campos.');
      validation = false;
    }
    if (validation == true) {
      var promise = auth.signInWithEmailAndPassword(email, pass);
      promise.catch((e) =>
        alert('Correo electrónico y/o contraseña incorrectos.')
      );
    }
  });

  // Registro
  var dbUsers = db.ref().child('users');
  var name = document.getElementById('name');
  var sex = document.getElementsByName('sex');
  var age = document.getElementById('age');
  var suEmail = document.getElementById('suEmail');
  var suPass = document.getElementById('suPass');
  var suBtn = document.getElementById('suBtn');
  suBtn.addEventListener('click', (e) => {
    validation = true;
    // Obtener sexo seleccionado
    for (var i = 0; i < sex.length; i++) {
      if (sex[i].checked) var selSex = sex[i].value;
    }
    var email = suEmail.value;
    var pass = suPass.value;
    var auth = firebase.auth();
    // Validación
    if (
      name.value == '' ||
      selSex == null ||
      age.value == '' ||
      email == '' ||
      pass == ''
    ) {
      validation = false;
      alert('Complete todos los campos.');
    } else if (/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g.test(name.value) == false) {
      validation = false;
      alert('Nombre completo inválido.');
    } else if (
      age.value < 12 ||
      age.value > 150 ||
      /-/.test(age.value) ||
      /e/.test(age.value) ||
      /\./.test(age.value)
    ) {
      validation = false;
      alert('Edad inválida.');
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) == false) {
      validation = false;
      alert('Formato de correo electrónico inválido.');
    } else if (pass.length < 6) {
      validation = false;
      alert('La contraseña debe tener por lo menos 6 caracteres.');
    }
    if (validation == true) {
      var promise = auth.createUserWithEmailAndPassword(email, pass);
      promise.catch((e) => console.log(e.message));
      promise.then(function () {
        var userData = {
          name: name.value,
          sex: selSex,
          age: age.value,
          email: suEmail.value,
        };
        var uid = firebase.auth().currentUser.uid;
        dbUsers.child(uid).set(userData);
      });
    }
  });

  // Persistencia de sesión
  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function () {
      return firebase.auth().signInWithEmailAndPassword(email, password);
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
    });

  // Verificación de estado de sesión y redireccionamientos
  firebase.auth().onAuthStateChanged((firebaseUser) => {
    var user = firebase.auth().currentUser;

    if (firebaseUser) {
      if (user.uid == 'oHmFXjHaJlNCh4SAJMJsgHCJzVI3') {
        window.location.replace('worker.html');
      } else {
        window.location.replace('client.html');
      }
    }
  });
})();
