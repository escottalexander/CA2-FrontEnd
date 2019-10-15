import 'bootstrap/dist/css/bootstrap.css'

const url = 'https://maltemagnussen.com/CA2/api/search/';
const testurl = 'http://localhost:8080/CA2/api/search/';

function handleHttpErrors(res) {
    if (!res.ok) {
        return Promise.reject({ status: res.status, fullError: res.json() })
    }
    return res.json();
}

/*---------------------------------------------*/
/*---------- Begin Add Person Simple ----------*/
/*---------------------------------------------*/

var output = document.getElementById("output");

var buttonAddSimple = document.getElementById("createSimplePerson");

buttonAddSimple.addEventListener("click", function () {
    fetch(url + "create/person", createPersonOptions())
        .then(res => handleHttpErrors(res))
        .then(function (data) {
            console.log(data);
            output.innerHTML = "<p>Person created:</p><br>"
                + "<p>ID: " + data.id + "<br>"
                + "<p>First name: " + data.firstName + "<br>"
                + "<p>Last name: " + data.lastName + "<br>"
                + "<p>email: " + data.email + "<br>";
        })
        .catch(err => {
            if (err.status) {
                err.fullError.then(e => output.innerHTML = "Error:<br><br>")
            }
            else { console.log("Network error"); }
        });
})

function createPersonOptions() {
    var FirstName = document.getElementById("inputFirstName").value;
    var LastName = document.getElementById("inputLastName").value;
    var Email = document.getElementById("inputEmail").value;
    var Method = "POST";
    var data = {
        firstName: FirstName,
        lastName: LastName,
        email: Email
    }

    let options = {
        method: Method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    console.log(options);
    return options;
}

/*---------------------------------------------*/
/*----------- End Add Person Simple -----------*/
/*---------------------------------------------*/

/*---------------------------------------------*/
/*----------- Begin Get All Persons -----------*/
/*---------------------------------------------*/

// TO DELETE WHEN MERGE WITH MASTER - IS CPOPY OF EXISTING METHOD ON MASTER BRANCH
function emptyViewPersonWithDataDiv() {
    let div = document.getElementById("viewPersonWithData");
    div.innerHTML = "";
}

function fillViewAllPersonsWithDataDiv() {

    let ptag = document.createElement('p');
    ptag.setAttribute('id', 'viewAllPersonsWithDataPTAG');

    let buttontag = document.createElement('button');
    buttontag.innerHTML = 'Get All Users';
    buttontag.setAttribute('id', 'viewAllPersonsWithDataTAG');

    let div = document.getElementById("viewPersonWithData");
    div.appendChild(buttontag);
    div.appendChild(ptag);
}

function allUsers() {
    let urlAll = url + '/allpersons';
    fetch(urlAll)
        .then(handleHttpErrors)
        .then(jsondata => {
            let person = jsondata[0];
            let hobbies = '';
            person['hobbies'].forEach(element => {
                hobbies = hobbies + '<br>' + element.name + ' - ' + element.description;
            });
            let phones = '';
            person['phones'].forEach(element => {
                phones = phones + '<br>' + element.description + ': ' + element.number;
            });

            document.getElementById('viewPersonWithDataPTAG').innerHTML =
                "<br>Firstname: " + person['firstName'] + ' ' + person['lastName']
                + "<br>e-mail: " + person['email']
                + "<br>Address: " + person['address']['street'] + ', '
                + person['address']['additionalInfo'] + ', ' + person['address']['cityInfo']['zipCode']
                + ' ' + person['address']['cityInfo']['city']
                + "<br>Hobbies: " + hobbies
                + "<br>Phones: " + phones;
        })
        .catch(err => {
            if (err.status) {
                err.fullError.then(e => console.log(e.detail))
            }
            else { console.log("Network error"); }
        });

}