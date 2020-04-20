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
  var dbUsers = db.ref().child('users');

  // Cerrar sesión
  var loBtn = document.getElementById('loBtn');
  loBtn.addEventListener('click', (e) => {
    firebase.auth().signOut();
  });

  // Verificación de estado de sesión y redireccionamientos
  firebase.auth().onAuthStateChanged((firebaseUser) => {
    var user = firebase.auth().currentUser;
    if (firebaseUser) {
      if (user.uid == 'oHmFXjHaJlNCh4SAJMJsgHCJzVI3') {
        // Mostrar citas agendadas
        var snapshot1 = dbAp
          .orderByChild('barber')
          .on('value', function (snapshot1) {
            var search = false;
            var i = 0;
            var ap = [];
            var div = document.getElementById('apCards');
            while (div.firstChild) {
              div.removeChild(div.firstChild);
            }
            snapshot1.forEach(function (childSnapshot) {
              search = true;
              ap[i] = childSnapshot.val();
              i++;
            });
            if (search == true) {
              // Orden cronológico
              ap.sort(function (a, b) {
                var keyA = new Date(a.datetime);
                var keyB = new Date(b.datetime);
                // Comparar 2 fechas
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
              });
              // Imprimir citas en pantalla
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
                var li4 = document.createElement('li');
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
                var barber = document.createTextNode(
                  'Barbero: ' + ap[i].barber
                );
                li2.appendChild(barber);
                var service = document.createTextNode(
                  'Servicio: ' + ap[i].service
                );
                li3.appendChild(service);
                var client = document.createTextNode(
                  'Cliente: ' + ap[i].userName
                );
                li4.appendChild(client);
                cardBody.appendChild(li1);
                cardBody.appendChild(li2);
                cardBody.appendChild(li3);
                cardBody.appendChild(li4);
                card.appendChild(cardBody);
                col.appendChild(card);
                row.appendChild(col);
                var apCards = document.getElementById('apCards');
                apCards.appendChild(row);
                count++;
              }
            } else {
              var p = document.createElement('p');
              var pTxt = document.createTextNode('No hay citas agendadas.');
              p.appendChild(pTxt);
              p.style.textAlign = 'center';
              p.style.marginTop = '150px';
              var apCards = document.getElementById('apCards');
              apCards.appendChild(p);
            }
          });
      } else {
        window.location.replace('client.html');
      }
    } else {
      window.location.replace('index.html');
    }
  });
})();
