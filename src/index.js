import 'bootstrap/dist/css/bootstrap.css'
document.addEventListener("DOMContentLoaded", function () {
    /*---------- Begin Get Person By Name ---------*/
    /*----- Should be moved to NavBar function ----*/
    fillViewPersonWithDataDiv();
    document.getElementById("viewPersonWithDataButtonTAG").addEventListener('click', function (event) {
        event.preventDefault();
        singleuser();
        /*---------- End Get Person By Name ----------*/
    });
});

const url = 'https://maltemagnussen.com/CA2/api/search/';

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
    
    let ptag = document.createElement('p');
    ptag.setAttribute('id', 'viewPersonWithDataPTAG');

    let inputtag = document.createElement('input');
    inputtag.setAttribute('id', 'viewPersonWithDataInputTAG');
    inputtag.setAttribute('type', 'text');
    inputtag.setAttribute('placeholder', 'UserName');

    let buttontag = document.createElement('button');
    buttontag.innerHTML = 'Get User';
    buttontag.setAttribute('id', 'viewPersonWithDataButtonTAG');

    let div = document.getElementById("viewPersonWithData");
    div.innerHTML = "";
    div.appendChild(inputtag);
    div.appendChild(buttontag);
    div.appendChild(ptag);
}

/*---------- Not used yet ---------*/
/*---- To clear the div of data ---*/
function emptyViewPersonWithDataDiv() {
    let div = document.getElementById("viewPersonWithData");
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
                   "<br>Firstname: " + person['firstName'] + ' '+ person['lastName']
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
}

/*---------------------------------------------*/
/*----------- End Get Person By Name ----------*/
/*---------------------------------------------*/