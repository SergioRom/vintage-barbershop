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

  // Referencias a la base de datos
  var db = firebase.database();
  var dbAp = db.ref().child('appointments');
  var user;
  var dbUsers = db.ref().child('users');
  var userName;

  // Verificación de estado de sesión y redireccionamientos
  firebase.auth().onAuthStateChanged((firebaseUser) => {
    user = firebase.auth().currentUser;
    if (firebaseUser) {
      if (user.uid == 'oHmFXjHaJlNCh4SAJMJsgHCJzVI3') {
        window.location.replace('worker.html');
      } else {
        dbUsers.child(user.uid).once('value', function (snapshot3) {
          userName = snapshot3.val().name;
        });
      }
    } else {
      window.location.replace('index.html');
      console.log('No hay inicio de sesion');
    }
  });

  // Cerrar sesión
  var loBtn = document.getElementById('loBtn');
  loBtn.addEventListener('click', (e) => {
    firebase.auth().signOut();
  });

  // Mostrar citas agendadas
  firebase.auth().onAuthStateChanged((firebaseUser) => {
    // Ocultar animación loader
    var loader = document.getElementsByClassName('loader')[0];
    loader.style.display = 'none';
    user = firebase.auth().currentUser;
    var search = false;
    var i = 0;
    var ap = [];
    var snapshot1 = dbAp
      .orderByChild('userID')
      .equalTo(user.uid)
      .once('value', function (snapshot1) {
        snapshot1.forEach(function (childSnapshot) {
          search = true;
          ap[i] = childSnapshot.val();
          i++;
        });
        if (search == true) {
          // Ordenar citas por orden cronológico
          ap.sort(function (a, b) {
            var keyA = new Date(a.datetime);
            var keyB = new Date(b.datetime);
            // Comparar 2 fechas
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });

          // Imprimir citas en la pantalla
          var count = 1;
          for (i = 0; i < ap.length; i++) {
            if (count > 3 || count == 1) {
              var row = document.createElement('div');
              row.classList.add('row');
              count = 1;
            }
            var col = document.createElement('div');
            col.classList.add('col-sm-4');
            col.style.paddingBottom = '15px';
            var card = document.createElement('div');
            card.classList.add('card');
            var cardBody = document.createElement('ul');
            cardBody.classList.add('card-body');
            var li1 = document.createElement('li');
            var li2 = document.createElement('li');
            var li3 = document.createElement('li');
            // Formateo de fecha y hora
            var time = ap[i].datetime.split('T')[1];
            var year = ap[i].datetime.split('T')[0].split('-')[0];
            var month = ap[i].datetime.split('T')[0].split('-')[1];
            var day = ap[i].datetime.split('T')[0].split('-')[2];
            var date = day + '-' + month + '-' + year;
            var datetime = document.createTextNode(
              'Fecha y hora: ' + date + ' a las ' + time
            );
            li1.appendChild(datetime);
            var service = document.createTextNode('Servicio: ' + ap[i].service);
            li2.appendChild(service);
            var barber = document.createTextNode('Barbero: ' + ap[i].barber);
            li3.appendChild(barber);
            cardBody.appendChild(li1);
            cardBody.appendChild(li2);
            cardBody.appendChild(li3);
            card.appendChild(cardBody);
            col.appendChild(card);
            row.appendChild(col);
            var apCards = document.getElementById('apCards');
            apCards.appendChild(row);
            count++;
          }
        } else {
          var p = document.createElement('p');
          var pTxt = document.createTextNode('No tiene citas agendadas.');
          p.appendChild(pTxt);
          p.style.textAlign = 'center';
          p.style.marginTop = '150px';
          p.style.fontSize = '20px';
          var apCards = document.getElementById('apCards');
          apCards.appendChild(p);
        }
      });
  });

  // Creación de cita
  var service = document.getElementsByName('service');
  var barber = document.getElementsByName('barber');
  var selBarberId;
  var datetime = document.getElementById('datetime');
  var apBtn = document.getElementById('apBtn');
  apBtn.addEventListener('click', (e) => {
    var validation = true;
    var user = firebase.auth().currentUser;
    // Obtener servicio seleccionado
    for (var i = 0; i < service.length; i++) {
      if (service[i].checked) {
        var selServiceTxt = service[i].value;
      }
    }
    // Obtener barbero seleccionado
    for (var i = 0; i < barber.length; i++) {
      if (barber[i].checked) {
        var selBarberId = barber[i].id;
      }
    }
    selBarberTxt = $("label[for='" + selBarberId + "']").text();
    var datetimeTxt = datetime.value;
    // Validación de llenado de campos
    if (datetimeTxt === '' || selServiceTxt === '' || selBarberTxt === '') {
      alert('Complete todos los campos.');
      validation = false;
      // Validación de min y max en calendario
    } else if (datetime.checkValidity() == false) {
      alert('Fecha u hora inválida.');
      validation = false;
      // Validación de horario válido
    } else if (
      datetimeTxt.split('T')[1].split(':')[0] < 12 ||
      datetimeTxt.split('T')[1].split(':')[0] > 21
    ) {
      alert('La hora seleccionada está fuera del horario disponible.');
      validation = false;
    }
    // Bùsqueda en la base de datos de cita existente
    var search = false;
    var alertMessage;
    var snapshot2 = dbAp
      .orderByChild('barber')
      .equalTo(selBarberTxt)
      .once('value', function (snapshot2) {
        snapshot2.forEach(function (childSnapshot) {
          if (
            childSnapshot.val().datetime.split('T')[0] ==
              datetimeTxt.split('T')[0] &&
            childSnapshot.val().datetime.split('T')[1].split(':')[0] ==
              datetimeTxt.split('T')[1].split(':')[0]
          ) {
            search = true;
            alertMessage =
              'Hora ocupada en el día y con el barbero seleccionados.';
          }
        });
        var snapshot3 = dbAp
          .orderByChild('userID')
          .equalTo(user.uid)
          .once('value', function (snapshot3) {
            snapshot3.forEach(function (childSnapshot) {
              if (
                childSnapshot.val().datetime.split('T')[0] ==
                  datetimeTxt.split('T')[0] &&
                childSnapshot.val().datetime.split('T')[1].split(':')[0] ==
                  datetimeTxt.split('T')[1].split(':')[0]
              ) {
                search = true;
                alertMessage =
                  'Ya tiene una cita agendada en el día y hora seleccionados.';
              }
            });
            if (validation == true) {
              if (search == false) {
                var apData = {
                  userName: userName,
                  service: selServiceTxt,
                  barber: selBarberTxt,
                  datetime: datetimeTxt,
                  userID: user.uid,
                };
                dbAp.push(apData);
                alert('Su cita se agendó.');
                window.location.replace('client.html');
              } else {
                alert(alertMessage);
              }
            }
          });
      });
  });

  // Asignación de min y max en el calendario
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; // Febrero es 0
  var mm_m; //Mes máximo
  var yyyy = today.getFullYear();
  var hour = today.getHours();
  var time = hour + ':00';
  // Formateo de día y mes
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  // Mes max y formateo
  if (mm == 12) {
    mm_m = 1;
  } else {
    mm_m = parseInt(mm) + 1;
  }
  if (mm_m < 10) {
    mm_m = '0' + mm_m;
  }
  today = yyyy + '-' + mm + '-' + dd + 'T' + time;
  var max = yyyy + '-' + mm_m + '-' + dd + 'T' + '21:00';
  document.getElementById('datetime').setAttribute('min', today);
  document.getElementById('datetime').setAttribute('max', max);

  // Ocultar y mostrar secciones
  // Secciones
  var appoinmentsSection = document.getElementById('appoinmentsSection');
  var serviceSection = document.getElementById('serviceSection');
  var barberSection = document.getElementById('barberSection');
  var datetimeSection = document.getElementById('datetimeSection');
  var ApCBtn = document.getElementById('ApCBtn');

  // Click en Agendar Cita
  ApCBtn.addEventListener('click', (e) => {
    appoinmentsSection.style.display = 'none';
    barberSection.style.display = 'none';
    datetimeSection.style.display = 'none';
    serviceSection.style.display = '';
  });

  //Click en botón cancelar de la sección servicio
  var btnCancel = document.getElementById('btnCancel');
  btnCancel.addEventListener('click', (e) => {
    window.location.replace('client.html');
  });

  // Click en botón siguiente de la sección servicio
  var btnNextS = document.getElementById('btnNextS');
  btnNextS.addEventListener('click', (e) => {
    serviceSection.style.display = 'none';
    barberSection.style.display = '';
  });

  // Click en botón siguiente de la sección barber
  var btnNextB = document.getElementById('btnNextB');
  btnNextB.addEventListener('click', (e) => {
    barberSection.style.display = 'none';
    datetimeSection.style.display = '';
  });

  // Click en botón atrás de la sección barber
  var btnBackB = document.getElementById('btnBackB');
  btnBackB.addEventListener('click', (e) => {
    barberSection.style.display = 'none';
    serviceSection.style.display = '';
  });

  //Click en botón atrás de la sección fecha
  var btnBackD = document.getElementById('btnBackD');
  btnBackD.addEventListener('click', (e) => {
    datetimeSection.style.display = 'none';
    barberSection.style.display = '';
  });
})();
