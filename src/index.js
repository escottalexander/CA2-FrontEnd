import 'bootstrap/dist/css/bootstrap.css'

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
    inputtag.classList.add('ViewPersonWithDataButtonTAG');
    let div = document.getElementById("viewPersonWithData");
    div.innerHTML = "";
    div.appendChild(inputtag);
    div.appendChild(buttontag);
    div.appendChild(ptag);
}

function singleuser() {
    let id = document.getElementById('useridinput').value;
    if(!id){
        document.getElementById('singleuser').innerHTML = 'Type in an ID'
    }
    else{
        let urlID = 'http://localhost:3333/api/users/' + id;

    fetch(urlID)
        .then(handleHttpErrors)
        .then(jsondata => {
            getUserToEdit(jsondata);
            document.getElementById('singleuser').innerHTML = JSON.stringify(jsondata);
        })
        .catch(err => {
            if (err.status) {
                err.fullError.then(e => console.log(e.detail))
            }
            else { console.log("Network error"); }
        });
    }
}
