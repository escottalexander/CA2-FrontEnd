import 'bootstrap/dist/css/bootstrap.css'
import { isNullOrUndefined } from 'util';
document.addEventListener("DOMContentLoaded", function () {
    /*---------- Begin Get Person By Name ---------*/
    /*----- Should be moved to NavBar function ----*/
    fillViewPersonWithDataDiv();
    fillViewAllPersonsWithDataDiv()
    document.getElementById("viewPersonWithDataButtonTAG").addEventListener('click', function (event) {
        event.preventDefault();
        singleuser();
    });
    document.getElementById("viewAllPersonsWithDataButtonTAG").addEventListener('click', function (event) {
        event.preventDefault();
        allUsersToPtag();
    });
});

const url = 'https://maltemagnussen.com/CA2/api/search/';
const testurl = 'http://localhost:8080/CA2/api/search/';

function handleHttpErrors(res) {
    if (!res.ok) {
        return Promise.reject({ status: res.status, fullError: res.json() })
    }
    return res.json();
}

/*---------------------------------------------*/
/*---------- Begin Get Person By Name ---------*/
/*---------------------------------------------*/

function fillViewPersonWithDataDiv() {
    emptyDiv('viewPersonWithData');
    let ptag = document.createElement('p');
    ptag.setAttribute('id', 'viewPersonWithDataPTAG');

    let inputtag = document.createElement('input');
    inputtag.setAttribute('id', 'viewPersonWithDataInputTAG');
    inputtag.setAttribute('type', 'text');
    inputtag.setAttribute('placeholder', 'UserName');

    let buttontag = document.createElement('button');
    buttontag.innerHTML = 'Get User';
    buttontag.setAttribute('id', 'viewPersonWithDataButtonTAG');

    let div = document.getElementById('viewPersonWithData');
    div.appendChild(inputtag);
    div.appendChild(buttontag);
    div.appendChild(ptag);
}

/*---- To clear the div of data ---*/
function emptyDiv(divID) {
    let div = document.getElementById(divID);
    div.innerHTML = "";
}

function singleuser() {
    let username = document.getElementById('viewPersonWithDataInputTAG').value;
    if (!username) {
        document.getElementById('viewPersonWithDataPTAG').innerHTML = 'Type in a name'
    }
    else {
        let urlName = url + 'person/' + username;
        fetch(urlName)
            .then(handleHttpErrors)
            .then(fetchedData => {
                document.getElementById('viewPersonWithDataPTAG').innerHTML = writeToPTagPrPerson(fetchedData[0]);
            })
            .catch(err => {
                if (err.status) {
                    err.fullError.then(e => console.log(e.detail))
                }
                else { console.log("Network error"); }
            });
    }
}

function writeToPTagPrPerson(jsondata) {
    let hobbies = '';
    jsondata['hobbies'].forEach(element => {
        hobbies = hobbies + '<br>' + element.name + ' - ' + element.description;
    });
    let phones = '';
    jsondata['phones'].forEach(element => {
        phones = phones + '<br>' + element.description + ': ' + element.number;
    });

    let stringToWrite =
        "<br>Firstname: " + jsondata['firstName'] + ' ' + jsondata['lastName']
        + "<br>e-mail: " + jsondata['email'];
    if (!isNullOrUndefined(jsondata['address'])) {
        stringToWrite = stringToWrite + "<br>Address: " + jsondata['address']['street'] + ', '
            + jsondata['address']['additionalInfo'] + ', ' + jsondata['address']['cityInfo']['zipCode']
            + ' ' + jsondata['address']['cityInfo']['city'];
    }
    stringToWrite = stringToWrite
        + "<br>Hobbies: " + hobbies
        + "<br>Phones: " + phones;
    return stringToWrite;
}

/*---------------------------------------------*/
/*----------- End Get Person By Name ----------*/
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

function fillViewAllPersonsWithDataDiv() {
    emptyDiv('viewAllPersonsWithData');
    let ptag = document.createElement('p');
    ptag.setAttribute('id', 'viewAllPersonsWithDataPTAG');

    let buttontag = document.createElement('button');
    buttontag.innerHTML = 'Get All Users';
    buttontag.setAttribute('id', 'viewAllPersonsWithDataButtonTAG');

    let div = document.getElementById('viewAllPersonsWithData');
    div.appendChild(buttontag);
    div.appendChild(ptag);
}

function allUsersToPtag() {
    let urlAll = url + 'allpersons';
    fetch(urlAll)
        .then(handleHttpErrors)
        .then(jsondata => {

            let allPersonsToWrite = '';

            jsondata.forEach(element => {
                allPersonsToWrite = allPersonsToWrite + writeToPTagPrPerson(element);
            });
            document.getElementById('viewAllPersonsWithDataPTAG').innerHTML = allPersonsToWrite;
        })
        .catch(err => {
            if (err.status) {
                err.fullError.then(e => console.log(e.detail))
            }
            else { console.log("Network error: " + err); }
        });
}

/*---------------------------------------------*/
/*------------ End Get All Persons ------------*/
/*---------------------------------------------*/
