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

var outputPersonSimple = document.getElementById("outputPersonSimple");

var buttonAddSimple = document.getElementById("createSimplePerson");

buttonAddSimple.addEventListener("click", function(){
    fetch(url + "create/person", createPersonOptions())
    .then(res => handleHttpErrors(res))
    .then(function(data) {
        console.log("Create Person Simple:\n" + data);
        outputPersonSimple.innerHTML = "<p>Person created:</p><br>"
        + "<p>ID: " + data.id + "<br>"
        + "<p>First name: " + data.firstName + "<br>"
        + "<p>Last name: " + data.lastName + "<br>"
        + "<p>email: " + data.email + "<br>";
    })
    .catch(err => {
        if(err.status){
          err.fullError.then(e => outputPersonSimple.innerHTML = "Error:<br><br>")
        }
        else{console.log("Network error"); }
     });
})

function createPersonOptions(){
    var FirstName = document.getElementById("inputFirstNamePersonSimple").value;
    var LastName = document.getElementById("inputLastNamePersonSimple").value;
    var Email = document.getElementById("inputEmailPersonSimple").value;
    var Method = "POST";
    var data = {
        firstName : FirstName,
        lastName : LastName,
        email : Email
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
/*------------- Begin  Create All -------------*/
/*---------------------------------------------*/

var outputCreateAll = document.getElementById("outputCreateAll");

var buttonCreateAll = document.getElementById("buttonCreateAll");

var inputHobbyName = document.getElementById("inputHobbyNameCreateAll");
var inputHobbyDescription = document.getElementById("inputHobbyDescriptionCreateAll");
var hobbyStatus = document.getElementById("hobbyStatus");

var inputZipCode = document.getElementById("inputCityZipCreateAll");
var inputCityName = document.getElementById("inputCityNameCreateAll");
var cityStatus = document.getElementById("cityStatus");

var inputFirstName = document.getElementById("inputFirstNameCreateAll");
var inputLastName = document.getElementById("inputLastNameCreateAll");
var inputEmail = document.getElementById("inputEmailCreateAll");
var inputPhone = document.getElementById("inputPhoneCreateAll");
var inputPhoneDescription = document.getElementById("inputPhoneDescriptionCreateAll");
var inputAddressStreet = document.getElementById("inputAddressStreetCreateAll");
var inputAddressInfo = document.getElementById("inputAddressInfoCreateAll");

inputHobbyName.addEventListener("input", function(){
    checkIfInputExists(false);
})

inputZipCode.addEventListener("input", function(){
    checkIfInputExists(true);
})

var lastExisted = false;
function checkIfInputExists(isCity) {
    //Variables based on boolean isCity
    //If isCity then the function is being used to check if a city exists
    //If not then the function is being used to check if a hobby exists
    var checkValue;
    var target;
    var status;
    var uriPart;
    if (isCity) {
        checkValue = inputZipCode;
        target = inputCityName;
        status = cityStatus;
        uriPart = "city/zip/";
    } else {
        checkValue = inputHobbyName;
        target = inputHobbyDescription;
        status = hobbyStatus;
        uriPart = "hobby/";
    }

    //End of variables

    if (checkValue.value == null || checkValue.value === "") {
        target.innerText = "";
        target.value = "";
        if (!target.hasAttribute("disabled"))
        {
            target.setAttribute("disabled", "true");
        }
        return;
    }
    fetch(testurl + uriPart + checkValue.value)
    .then(res => handleHttpErrors(res))
    .then(function(data) {
        console.log(data);
        let output;
        if (isCity)
        {
            output = data.city;
        } else {
            output = data.description;
        }
        if (data.name != null || data.city)
        {
            target.innerText = "";
            target.value = "";
            status.innerHTML = "-- Existing ✓ --";
            target.innerText = output;
            target.value = output;
            lastExisted = true;
            if (!target.hasAttribute("disabled"))
            {
                target.setAttribute("disabled", "true");
            }
        }
    })
    .catch(err => {
        if(err.status){
            //If we end up here it means that no hobby/city with the given name/zipcode was found
            if (target.hasAttribute("disabled"))
            {
                target.removeAttribute("disabled");
            }
            if (lastExisted) 
            {
                target.innerText = "";
                target.value = "";
                status.innerHTML = "-- New --";
                lastExisted = false;
            }
        }
        else{console.log("Network error");
        }
    });
}

buttonCreateAll.addEventListener("click", function(){
    fetch(testurl + "create-all", createAllOptions())
    .then(res => handleHttpErrors(res))
    .then(function(data){
        outputCreateAll.innerHTML = 
        "First name: " + data.firstName + "<br>" + "Last name: " + data.lastName + "<br>" +
        "Email: " + data.email + "<br>" + "Address<br>Street: " + data.address.street + "<br>" +
        "Additional inforamtion: " + data.address.additionalInfo + "<br>" + "City" + "<br>" + 
        "Name: " + data.address.cityInfo.city + "<br>" + "Zipcode: " + data.address.cityInfo.zipCode +
        "<br>" + "Hobby" + "<br>" + "Name: " + data.hobbies[0].name + "<br>" + "Description: " +
        data.hobbies[0].description;
    })
    .catch(err => {
        if(err.status){
            err.fullError.then(e => outputCreateAll.innerHTML = "Error:<br><br>Status: " 
            + e.code + "<br>" + e.message)
        }
        else{console.log("Network error");
        }
    });
})

function createAllOptions(){
    var hobby = {
        name : inputHobbyName.value,
        description : inputHobbyDescription.value
    }

    var hobbies = []
    hobbies[0] = hobby;

    var phone = {
        number : inputPhone.value,
        description : inputPhoneDescription.value
    }

    var phones = []
    phones[0] = phone;

    var cityInfo = {
        zipCode : inputZipCode.value,
        city : inputCityName.value
    }

    var address = {
        street : inputAddressStreet.value,
        additionalInfo : inputAddressInfo.value,
        cityInfo
    }

    var data = {
        firstName : inputFirstName.value,
        lastName : inputLastName.value,
        email : inputEmail.value,
        hobbies,
        phones,
        address
    }
    
    let options = {
        method: "POST", //change to PUT if needed
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
/*-------------- End  Create All --------------*/
/*---------------------------------------------*/
