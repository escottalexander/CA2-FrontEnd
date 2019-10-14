import 'bootstrap/dist/css/bootstrap.css'
document.addEventListener("DOMContentLoaded", function () {
    fillViewPersonWithDataDiv();
});

const url = 'https://maltemagnussen.com/CA2/api/search/';

function handleHttpErrors(res) {
    if (!res.ok) {
        return Promise.reject({ status: res.status, fullError: res.json() })
    }
    return res.json();
}

function fillViewPersonWithDataDiv() {
    let ptag = document.createElement('p');
    ptag.classList.add('ViewPersonWithDataPTAG');
    let inputtag = document.createElement('input');
    inputtag.classList.add('ViewPersonWithDataInputTAG');
    inputtag.setAttribute('type', 'text');
    inputtag.setAttribute('placeholder', 'UserName');
    let buttontag = document.createElement('button');
    buttontag.innerHTML = 'Get User';
    buttontag.classList.add('ViewPersonWithDataButtonTAG');
    let div = document.getElementById("viewPersonWithData");
    div.innerHTML = "";
    div.appendChild(inputtag);
    div.appendChild(buttontag);
    div.appendChild(ptag);
}

document.getElementById("ViewPersonWithDataButtonTAG").addEventListener('click', function (event) {
    event.preventDefault();
    singleuser();
});

function singleuser() {
    let username = document.getElementById('ViewPersonWithDataInputTAG').value;
    if(!username){
        document.getElementById('ViewPersonWithDataPTAG').innerHTML = 'Type in a name'
    }
    else{
        let urlName = url + username;

    fetch(urlName)
        .then(handleHttpErrors)
        .then(jsondata => {
            getUserToEdit(jsondata);
            document.getElementById('ViewPersonWithDataPTAG').innerHTML = JSON.stringify(jsondata);
        })
        .catch(err => {
            if (err.status) {
                err.fullError.then(e => console.log(e.detail))
            }
            else { console.log("Network error"); }
        });
    }
}
