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
    let div = document.getElementById("viewPersonWithData");
    div.innerHTML = "";
    div.appendChild(inputtag);
    div.appendChild(ptag);
}


