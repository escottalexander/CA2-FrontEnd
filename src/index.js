import 'bootstrap/dist/css/bootstrap.css'
import { isNullOrUndefined } from 'util';
document.addEventListener("DOMContentLoaded", function () {
    /*---------- Begin Get Person By Name ---------*/
    /*----- Should be moved to NavBar function ----*/
    fillViewPersonWithDataDiv();
    fillViewAllPersonsWithDataDiv();
    document.getElementById("viewPersonWithDataButtonTAG").addEventListener('click', function (event) {
        event.preventDefault();
        singleuser();
    });
    document.getElementById("viewAllPersonsWithDataButtonTAG").addEventListener('click', function (event) {
        event.preventDefault();
        allUsersToPtag();
        allUsersToTableTag();
    });
});

/* The JavaScript Code for Navigation Dynamic Behavior */
/* Listen for fragment identifier value changes (The # at the end of the URL is the fragment) */
window.addEventListener("hashchange", function () {
    var fragment = location.hash;
    // Do something when the fragment changes. 
    console.log(fragment);

    changeActiveNavbarElement();
});

function changeActiveNavbarElement() {
    // Get the container element
    var btnContainer = document.getElementById("navbarNav");

    // Get all items with class="btn" inside the container
    var btns = btnContainer.getElementsByClassName("nav-item");

    // Loop through the items and add the active class to the current/clicked nav
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            var current = document.getElementsByClassName("active");

            // If there's no active class
            if (current.length > 0) {
                current[0].className = current[0].className.replace(" active", "");
            }

            // Add the active class to the current/clicked nav
            this.className += " active";
        });
    }
}

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

    let tabletag = document.createElement('table');
    tabletag.setAttribute('id', 'viewAllPersonsWithDataTableTAG');

    let div = document.getElementById('viewAllPersonsWithData');
    div.appendChild(buttontag);
    div.appendChild(ptag);
    div.appendChild(tabletag);
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

function allUsersToTableTag() {
    let urlAll = url + 'allpersons';
    fetch(urlAll)
        .then(handleHttpErrors)
        .then(jsondata => {
            let sortedData = sortPersonJSON(jsondata);
            let table = document.getElementById('viewAllPersonsWithDataTableTAG');
            let headdata = Object.keys(sortedData[0]);
            tableHead(table, headdata);
            tableData(table, sortedData);
            fixTableHeaders();

        })
        .catch(err => {
            if (err.status) {
                err.fullError.then(e => console.log(e.detail))
            }
            else { console.log("Network error: " + err); }
        });
}

function tableHead(table, headData) {
    let head = table.createTHead();
    let row = head.insertRow();
    for (let key of headData) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.id = key;
        th.appendChild(text);
        row.appendChild(th);
    }

}

function tableData(table, bodyData) {
    let tbody = document.createElement('tbody');
    table.appendChild(tbody);
    for (let element of bodyData) {
        let row = table.insertRow();
        tbody.appendChild(row);
        for (let key in element) {
            let cell = row.insertCell();
            let obj = JSON.parse(JSON.stringify(element));
            let cellValue = '';
            if (typeof element[key] === 'object') {
                if (key === 'address') {
                    cellValue = obj.address.street + ', ' + obj.address.cityInfo.zipCode + ' ' + obj.address.cityInfo.city;
                }
                else if (key === 'hobbies') {
                    obj.hobbies.forEach(hobby => {
                        cellValue = cellValue + hobby.name + ', ';
                    });
                    cellValue = cellValue.slice(0, -2);
                }
                else if (key === 'phones') {
                    obj.phones.forEach(phone => {
                        cellValue = cellValue + phone.description + ': ' + phone.number + ', ';
                    });
                    cellValue = cellValue.slice(0, -2);
                }
            }
            else {
                cellValue = element[key];
            }
            let text = document.createTextNode(cellValue);
            cell.appendChild(text);
        }
    }
}

function fixTableHeaders() {
    document.getElementById("address").innerText = "Address";
    document.getElementById("email").innerText = "E-mail";
    document.getElementById("firstName").innerText = "Firstname";
    document.getElementById("id").innerText = "ID";
    document.getElementById("lastName").innerText = "Lastname";
    document.getElementById("phones").innerText = "Phone numbers";
    document.getElementById("hobbies").innerText = "Hobbies";

}

/*---------------------------------------------*/
/*------------ End Get All Persons ------------*/
/*---------------------------------------------*/

/*---------------------------------------------*/
/*----------- Begin Util Functions ------------*/
/*---------------------------------------------*/

/**
 * Sorts a complete JSON person Object in this Order:
 - id
 - firstName
 - lastName
 - email
 - hobbies
 - phones
 - address
 * @param {Person} persons 
 */
function sortPersonJSON(persons) {
    // Array we return at the end. 
    var returnPersons = [];

    persons.forEach(person => {
        // New Person:
        var returnPerson = {
            id: person.id,
            firstName: person.firstName,
            lastName: person.lastName,
            email: person.email,
            address: person.address,
            hobbies: person.hobbies,
            phones: person.phones,
        };
        // Add sorted person to return array
        returnPersons.push(returnPerson);
    });
    return returnPersons;
}

