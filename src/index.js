import 'bootstrap/dist/css/bootstrap.css'
document.addEventListener("DOMContentLoaded", function () {
    fillViewPersonWithDataDiv();
    // document.getElementById("viewPersonWithDataButtonTAG").addEventListener('click', function (event) {
    //     event.preventDefault();
    //     singleuser();
    // });
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

function emptyViewPersonWithDataDiv() {
    let div = document.getElementById("viewPersonWithData");
    div.innerHTML = "";
}

document.getElementById("viewPersonWithDataButtonTAG").addEventListener('click', function (event) {
  event.preventDefault();
   singleuser();
});

function singleuser() {
    alert(hat);
    let username = document.getElementById('viewPersonWithDataInputTAG').value;
    if (!username) {
        document.getElementById('viewPersonWithDataInputTAG').innerHTML = 'Type in a name'
    }
    else {
        let urlName = url + '/person/' + username;

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
