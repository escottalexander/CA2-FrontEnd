import 'bootstrap/dist/css/bootstrap.css'
import { isNullOrUndefined } from 'util';
import { type } from 'os';
document.addEventListener("DOMContentLoaded", function () {

    /*----- Should be moved to NavBar function ----*/
    fillViewAllPersonsWithDataDiv();
    fillViewAllPersonsWithHobbyDiv();
    fillViewAllPersonsWithZipDiv();
    allHobbies();
    allZipcodes()

    document.getElementById("viewAllPersonsWithDataButtonTAG").addEventListener('click', function (event) {
        event.preventDefault();
        //allUsersToPtag();
        allUsersToTableTag();
    });
    document.getElementById("viewAllPersonsWithHobbyButtonTAG").addEventListener('click', function (event) {
        event.preventDefault();
        getAllPersonsWithHobbyByName();
    });
    document.getElementById("viewAllPersonsWithZipButtonTAG").addEventListener('click', function (event) {
        event.preventDefault();
        allPersonsInCity();
    });
});

/* The JavaScript Code for Navigation Dynamic Behavior */
// Our Cache - Stores the partial .HTML pages.
var partialsCache = {} // Apparently important that this is at the top, or it won't work. 
/* If no Fragment Identifier is provided then we default to home */
if (!location.hash) { // Uses the falsy concept
    location.hash = "#home";
}
/* Navigate once to the initial hash value */
navigate();
/* Listen for fragment identifier value changes (The # at the end of the URL is the fragment) */
/* Navigate whenever the fragment identifier value changes */
window.addEventListener("hashchange", navigate);
/* Encapsulates an HTTP GET request using XMLHttpRequest
Fetches the file at the given path, then calls the 
callback with the content of the file. */
// TODO - Should maybe be replaced with the fetch stuff teachers wants us to use? 
function fetchFile(path, callback) {
    // Create a new AJAX request for fetching the partial HTML file.
    var request = new XMLHttpRequest();
    // Call the callback with the content loaded from the file. 
    request.onload = function () { // This is the function that gets invoked once the file is loaded.
        callback(request.responseText); // We get the content here. 
    };
    // Fetch the partial HTML File given the fragment.
    request.open("GET", path); // Initialize the request. HTTP GET request + PATH
    request.send(null); // Finalize the request.
}

/* Gets the appropriate content for the given fragment identifier */
// Implements a cache.
function getContent(fragment, callback) {
    // If the page has been fetched before:
    if (partialsCache[fragment]) {
        // Just use the cached version:
        callback(partialsCache[fragment]);
    } else {
        fetchFile(fragment + ".html", function (content) {
            // Store the fetched content in the cache
            partialsCache[fragment] = content;
            // Pass the content to the callback
            callback(content);
        });
    }
}
/* Updates Dynamic content based on the fragment identifier */
// Is hoisted.
function navigate() {
    // Get a reference to the content Div
    var contentDiv = document.getElementById("content");
    // Get a reference to the fragment. We use substr(1) to remove the '#' hash from the start of the string. 
    var fragment = location.hash.substr(1);
    // Set the content div innerHTML based on the fragment identifier.
    getContent(fragment, function (content) {
        contentDiv.innerHTML = content;
        switch (fragment) {
            case "get": get(); break;

        }
    });
    changeActiveNavbarElement();
}
function changeActiveNavbarElement() {
    var btnContainer = document.getElementById("navbarNav");
    // Get all items with class="nav-item" inside the container
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
/* End of JavaScript code for dynamic navigation behavior */

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
function get() {

    fillViewPersonWithDataDiv();

    document.getElementById("viewPersonWithDataButtonTAG").addEventListener('click', function (event) {
        event.preventDefault();
        singleuser();
    });

    function fillViewPersonWithDataDiv() {
        emptyDiv('viewPersonWithData');
        let ptag = document.createElement('p');
        ptag.setAttribute('id', 'viewPersonWithDataPTAG');

        let inputtag = document.createElement('input');
        inputtag.setAttribute('id', 'viewPersonWithDataInputTAG');
        inputtag.setAttribute('type', 'text');
        inputtag.setAttribute('placeholder', 'UserName');

/*---- To clear the div of data ---*/
function emptyTag(divID) {
    let div = document.getElementById(divID);
    div.innerHTML = "";
}
        let buttontag = document.createElement('button');
        buttontag.innerHTML = 'Get User';
        buttontag.setAttribute('id', 'viewPersonWithDataButtonTAG');

        let div = document.getElementById('viewPersonWithData');
        div.appendChild(inputtag);
        div.appendChild(buttontag);
        div.appendChild(ptag);
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
}
/*---------------------------------------------*/
/*----------- End Get Person By Name ----------*/
/*---------------------------------------------*/

/*---- To clear the div of data ---*/
function emptyDiv(divID) {
    let div = document.getElementById(divID);
    div.innerHTML = "";
}

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
    emptyTag('viewAllPersonsWithData');
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
    emptyTag('viewAllPersonsWithDataTableTAG');
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

/*---------------------------------------------*/
/*------------ End Util Functions -------------*/
/*---------------------------------------------*/


/*---------------------------------------------*/
/*-------- Begin Get Hobby/AllHobbies ---------*/
/*---------------------------------------------*/

function allHobbies() {
    let urlAll = url + 'allpersons';
    fetch(urlAll)
        .then(handleHttpErrors)
        .then(jsondata => {
            let hobbiesArray = [];
            jsondata.forEach(element => {
                let obj = JSON.parse(JSON.stringify(element));
                hobbiesArray.push(obj.hobbies);
            });
            fillHobbiesDropDownDiv(hobbiesArray)
        })
        .catch(err => {
            if (err.status) {
                err.fullError.then(e => console.log(e.detail))
            }
            else { console.log("Network error: " + err); }
        });
}


function fillHobbiesDropDownDiv(allhobbies) {
    emptyTag('allHobbies');
    let ptag = document.createElement('p');
    ptag.setAttribute('id', 'allHobbiesPTAG');

    let selecttag = document.createElement('select');
    selecttag.setAttribute('id', 'allHobbiesDropDownSelectTAG');
    let optionstagDefault = document.createElement('option');
    optionstagDefault.setAttribute('id', 'default');
    optionstagDefault.setAttribute('selected', '');
    optionstagDefault.setAttribute('hidden', '');
    optionstagDefault.innerHTML = 'Select Hobby';
    selecttag.appendChild(optionstagDefault);

    dropDownData(allhobbies).forEach(hobby => {
        let optionstag = document.createElement('option');
        optionstag.setAttribute('id', hobby.replace(/ /g, ''));
        optionstag.setAttribute('value', hobby);
        optionstag.innerHTML = hobby;
        selecttag.appendChild(optionstag);
    })

    let buttontag = document.createElement('button');
    buttontag.innerHTML = 'Get Hobby';
    buttontag.setAttribute('id', 'hobbiesDropDownButtonTAG');

    let div = document.getElementById('allHobbies');
    div.appendChild(selecttag);
    div.appendChild(buttontag);
    div.appendChild(ptag);

    document.getElementById("hobbiesDropDownButtonTAG").addEventListener('click', function (event) {
        event.preventDefault();
        getHobbyByName();
    });
}

function dropDownData(allhobbies) {
    let hobbyNames = [];
    allhobbies.forEach(element => {
        element.forEach(hobby => {
            hobbyNames.push(hobby.name);
        })
    })
    let uniqueHobbyNames = Array.from(new Set(hobbyNames));
    return uniqueHobbyNames;
}

function getHobbyByName() {
    let selected = document.getElementById('allHobbiesDropDownSelectTAG');

    let hobbyname = selected.options[selected.selectedIndex].value;
    if (selected.options[selected.selectedIndex].id === 'default') {
        document.getElementById('allHobbiesPTAG').innerHTML = 'Select a hobby name'
    }
    else {
        let urlHobby = url + 'hobby/' + hobbyname;
        fetch(urlHobby)
            .then(handleHttpErrors)
            .then(fetchedData => {
                document.getElementById('allHobbiesPTAG').innerHTML = writeToPTagPrHobby(fetchedData);
            })
            .catch(err => {
                if (err.status) {
                    err.fullError.then(e => console.log(e.detail))
                }
                else { console.log("Network error"); }
            });
    }
}

function writeToPTagPrHobby(jsondata) {
    let stringToWrite =
        "<br>Hobby: " + jsondata['name']
        + "<br>Description: " + jsondata['description'];
    return stringToWrite;
}

function getAllPersonsWithHobbyByName() {
    emptyTag('viewAllPersonsWithHobbyTableTAG');
    let selected = document.getElementById('allHobbiesDropDownSelectTAG');

    let hobbyname = selected.options[selected.selectedIndex].value;
    if (selected.options[selected.selectedIndex].id === 'default') {
        document.getElementById('allHobbiesPTAG').innerHTML = 'Select a hobby name'
    }
    else {
        let urlHobby = url + '/hobby?hobby=' + hobbyname;
        fetch(urlHobby)
            .then(handleHttpErrors)
            .then(jsondata => {
                let sortedData = sortPersonJSON(jsondata);
                let table = document.getElementById('viewAllPersonsWithHobbyTableTAG');
                let headdata = Object.keys(sortedData[0]);
                tableHead(table, headdata);
                tableData(table, sortedData);
                fixTableHeaders();
            })
            .catch(err => {
                if (err.status) {
                    err.fullError.then(e => console.log(e.detail))
                }
                else { console.log("Network error"); }
            });
    }
}

function fillViewAllPersonsWithHobbyDiv() {
    emptyTag('viewAllPersonsWithHobby');
    let ptag = document.createElement('p');
    ptag.setAttribute('id', 'allPersonsWithHobbyPTAG');

    let buttontag = document.createElement('button');
    buttontag.innerHTML = 'Get All Users With Hobby';
    buttontag.setAttribute('id', 'viewAllPersonsWithHobbyButtonTAG');

    let tabletag = document.createElement('table');
    tabletag.setAttribute('id', 'viewAllPersonsWithHobbyTableTAG');

    let div = document.getElementById('viewAllPersonsWithHobby');
    div.appendChild(ptag);
    div.appendChild(buttontag);
    div.appendChild(tabletag);
}

/*---------------------------------------------*/
/*--------- End Get Hobby/AllHobbies ----------*/
/*---------------------------------------------*/

/*---------------------------------------------*/
/*----------- Begin Zipcode Section -----------*/
/*---------------------------------------------*/

function allZipcodes() {
    let urlAll = url + 'zip';
    fetch(urlAll)
        .then(handleHttpErrors)
        .then(jsondata => {
            fillZipCodeDiv(jsondata)
        })
        .catch(err => {
            if (err.status) {
                err.fullError.then(e => console.log(e.detail))
            }
            else { console.log("Network error: " + err); }
        });
}

function fillZipCodeDiv(allzips) {
    emptyTag('viewZipCodeData');
    let ptag = document.createElement('p');
    ptag.setAttribute('id', 'viewZipCodeDataPTAG');

    let selecttag = document.createElement('select');
    selecttag.setAttribute('id', 'viewZipCodeDataDropDownSelectTAG');
    let optionstagDefault = document.createElement('option');
    optionstagDefault.setAttribute('id', 'default');
    optionstagDefault.setAttribute('selected', '');
    optionstagDefault.setAttribute('hidden', '');
    optionstagDefault.innerHTML = 'Select Zip';
    selecttag.appendChild(optionstagDefault);

    allzips.forEach(zip => {
        let optionstag = document.createElement('option');
        optionstag.setAttribute('id', zip.replace(/ /g, '') + 'zip');
        optionstag.setAttribute('value', zip);
        optionstag.innerHTML = zip;
        selecttag.appendChild(optionstag);
    })

    let buttontag = document.createElement('button');
    buttontag.innerHTML = 'Get City';
    buttontag.setAttribute('id', 'viewZipCodeDataDropDownButtonTAG');

    let div = document.getElementById('viewZipCodeData');
    div.appendChild(selecttag);
    div.appendChild(buttontag);
    div.appendChild(ptag);

    document.getElementById("viewZipCodeDataDropDownButtonTAG").addEventListener('click', function (event) {
        event.preventDefault();
        getCityByZipcode();
    });
}

function getCityByZipcode() {
    let selected = document.getElementById('viewZipCodeDataDropDownSelectTAG');
    let zipcode = selected.options[selected.selectedIndex].value;
    if (selected.options[selected.selectedIndex].id === 'default') {
        document.getElementById('viewZipCodeDataPTAG').innerHTML = 'Select a zipcode'
    }
    else {
        let urlZip = url + 'city/zip/' + zipcode;
        fetch(urlZip)
            .then(handleHttpErrors)
            .then(fetchedData => {
                document.getElementById('viewZipCodeDataPTAG').innerHTML = writeToPTagZip(fetchedData);
            })
            .catch(err => {
                if (err.status) {
                    err.fullError.then(e => console.log(e.detail))
                }
                else { console.log("Network error"); }
            });
    }
}

function writeToPTagZip(jsondata) {
    let stringToWrite =
        "<br>Zip Code: " + jsondata['zipCode']
        + "<br>City: " + jsondata['city'];
    return stringToWrite;
}


function allPersonsInCity() {
    emptyTag('viewAllPersonsWithZipTableTAG');
    let selected = document.getElementById('viewZipCodeDataDropDownSelectTAG');
    let zipcode = selected.options[selected.selectedIndex].value;
    if (selected.options[selected.selectedIndex].id === 'default') {
        document.getElementById('viewZipCodeDataPTAG').innerHTML = 'Select a zipcode'
    }
    else {
        let urlZip = url + 'city/zip/' + zipcode;
        fetch(urlZip)
            .then(handleHttpErrors)
            .then(fetchedData => {
                allPersonsInCityInner(fetchedData);
            })
            .catch(err => {
                if (err.status) {
                    err.fullError.then(e => console.log(e.detail))
                }
                else { console.log("Network error"); }
            });
    }
}

function allPersonsInCityInner(fetchedData) {
    let city = fetchedData['city'];
    let zip = fetchedData['zipCode'];

    let urlPersonsCity = url + 'city?zip=' + zip + '&city=' + city;
    fetch(urlPersonsCity)
        .then(handleHttpErrors)
        .then(jsondata => {
            let sortedData = sortPersonJSON(jsondata);
            let table = document.getElementById('viewAllPersonsWithZipTableTAG');
            let headdata = Object.keys(sortedData[0]);
            tableHead(table, headdata);
            tableData(table, sortedData);
            fixTableHeaders();
        })
        .catch(err => {
            if (err.status) {
                err.fullError.then(e => console.log(e.detail))
            }
            else { console.log("Network error"); }
        });
}

function fillViewAllPersonsWithZipDiv() {
    emptyTag('viewAllPersonsWithZip');
    let ptag = document.createElement('p');
    ptag.setAttribute('id', 'allPersonsWithZipPTAG');

    let buttontag = document.createElement('button');
    buttontag.innerHTML = 'Get All Users With Zip';
    buttontag.setAttribute('id', 'viewAllPersonsWithZipButtonTAG');

    let tabletag = document.createElement('table');
    tabletag.setAttribute('id', 'viewAllPersonsWithZipTableTAG');

    let div = document.getElementById('viewAllPersonsWithZip');
    div.appendChild(ptag);
    div.appendChild(buttontag);
    div.appendChild(tabletag);
}


/*---------------------------------------------*/
/*------------ End Zipcode Section ------------*/
/*---------------------------------------------*/
