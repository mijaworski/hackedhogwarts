window.addEventListener("DOMContentLoaded", start);

//Declaring arrays
const HTML = {};
let students = [];
let halfBloodArray = [];
let pureBloodArray = [];


//Defining an array of json files, one for the student list and one for the blood type
const loadArray = [
  "https://petlatkea.dk/2020/hogwarts/students.json",
  "https://petlatkea.dk/2020/hogwarts/families.json"
];

//Defining the prototype of the single student
const Student = {
  firstname: "",
  lastname: "",
  middlename: "",
  photo: null,
  gender: "",
  house: "",
  blood: ""
};

//Selecting elements of DOM and defining a role of each of it
function start() {
  console.log("start");
  HTML.filterhouse = document.querySelector("select#housefilter");

  HTML.sortname = document.querySelectorAll("[data-action=sort]");
  HTML.searchinput = document.querySelector("#searchBar > input");

  HTML.displaystudents = document.querySelector(".totalstudents");

  HTML.thelist = document.querySelector("section#contentlist");

  HTML.displaySlytherin = document.querySelector(".slytherin");
  HTML.displayHufflepuff = document.querySelector(".hufflepuff");
  HTML.displayRavenclaw = document.querySelector(".ravenclaw");
  HTML.displayGryffindor = document.querySelector(".gryffindor");

  HTML.theclone = document.querySelector("template");

  HTML.modalito = document.querySelector(".modalito");
  HTML.closeModalito = document.querySelector(".close");

  //Click events for sorting and filtering
  HTML.filterhouse.addEventListener("change", filteringhouse);
  HTML.sortname.forEach(button => {
    button.addEventListener("click", sortingname);
  });

  //Connecting search event with a search input
  HTML.searchinput.addEventListener("keyup", searching);
  bloodStatus();
}

//Fetching the blood info and preparing for the data clarification
async function bloodStatus() {
  const response = await fetch(loadArray[1]);
  const jsonBlood = await response.json();

  clearTheBlood(jsonBlood);
  loadTheStudents();
}

//Accessing the blood array
function clearTheBlood(jsonBlood) {
  halfBloodArray = jsonBlood.half;
  pureBloodArray = jsonBlood.pure;
}

//Fetching the students array
async function loadTheStudents() {
  const response = await fetch(loadArray[0]);
  const jsonData = await response.json();

  // As sooos as data get loaded, prepare data objects
  prepareObjects(jsonData);
}

//Mapping the object, making sure that it's ready for the list
function prepareObjects(jsonData) {
  students = jsonData.map(prepareObject);
  displayList(students);
}

//The object preparation
function prepareObject(jsonObject) {
  const student = Object.create(Student);

  //Trimming and spliting names + houses. Getting individual parts.
  const fulltexts = jsonObject.fullname.trim().toLowerCase();
  const house = jsonObject.house.trim().toLowerCase();
  const splitnames = fulltexts.split(" ");

  //Working on the FIRST name.//

  //Splitting the whole full name into smaller parts.
  const firstLetter = splitnames[0];
  //Making sure that the first letter of the name is written using capital letter.
  const firstCapitalLetter = firstLetter[0].toUpperCase();
  //Slicing
  const firstLowerLetter = firstLetter.slice(1).toLowerCase();
  const firstName = firstCapitalLetter + firstLowerLetter;
  //Declaring properties for the received values.
  student.firstname = firstName;

  //Working on the LAST name.//

  //Defining where the last name is in the string.
  const theLastSpace = fulltexts.lastIndexOf(" ");
  const last = fulltexts.substring(theLastSpace + 1, fulltexts.length);
  //Defining the placement of the lower and upper cases.
  const lastName = last[0].toUpperCase() + last.slice(1).toLowerCase();
  let havingHyphen;
  //Declaring properties for the received values.
  //Defining the situation of the last names with the hyphens.
  if (lastName.includes("-") === true) {
    havingHyphen =
      lastName[6].toUpperCase() + lastName.slice(7).toLowerCase();
    student.lastname = lastName.substring(0, 6) + havingHyphen;
  } else if (lastName === "Leanne") {
    student.lastname = "";
  } else {
    student.lastname = lastName;
  }

  //Working on the MIDDLE and NICK name//
  //Splitting the fullname from the array using the spaces, substringing and the indexOf.
  const theFirstSpace = fulltexts.indexOf(" ");
  const middleName = fulltexts.substring(theFirstSpace + 1, theLastSpace);
  //Declaring the nick names.
  let ernie;
  let james;
  let lucius;
  //Placing the received values onto new properties.
  if (middleName.includes("er") === true) {
    //Leaving the quotes in the template.//
    ernie =
      middleName[0] +
      //Capitalizing the first letter of the middle/nickname.//
      middleName[1].toUpperCase() +
      middleName.slice(2).toLowerCase();
    student.middlename = ernie;
  } else if (middleName.includes("luci") === true) {
    lucius = middleName[0].toUpperCase() + middleName.slice(1).toLowerCase();
    student.middlename = lucius;
  } else if (middleName.includes("jam") === true) {
    james = middleName[0].toUpperCase() + middleName.slice(1).toLowerCase();
    student.middlename = james;
  } else {
    student.middlename = middleName;
  }

  //Working on the house name.//
  const houseName = house[0].toUpperCase() + house.slice(1).toLowerCase();
  //Connecting the variable name with the json object name.
  student.house = houseName;


  //Connecting the photos with the array.//
  const photo = lastName.toLowerCase() + "_" + firstName[0].toLowerCase() + ".png";
  //The Patils' case.//
  let patilsPhoto = lastName.toLowerCase() + "_" + firstName.toLowerCase() + ".png";
  let fletchleysPhoto =
    lastName.substring(6) + "_" + firstName[0].toLowerCase() + ".png";
  //Declaring the state of Patil and Fletchey's photos.//
  if (photo === "patil_p.png") {
    student.photo = patilsPhoto;
  } else if (photo === "finch-fletchley_j.png") {
    student.photo = fletchleysPhoto;
  } else {
    student.photo = photo;
  }


  //Working on the gender.
  const gender =
    //Making sure that the gender name is written with the first capital name.//
    jsonObject.gender[0].toUpperCase() +
    //And the rest of the letters are written using lower case.//
    jsonObject.gender.slice(1).toLowerCase();
  student.gender = gender;


  //Let's define the blood status.//
  student.blood = bloodType();
  //Calling the blood function.//
  function bloodType() {

    //Running a function that checks the array of the blood types.//
    function runningThroughBlood(bloodarr) {
      return student.lastname == bloodarr;
    }
    const checkPure = pureBloodArray.some(runningThroughBlood);
    const checkHalf = halfBloodArray.some(runningThroughBlood);
    if (checkHalf === true && checkPure === true) {
      return "Half-Blooded";
    } else if (checkHalf === true) {
      return "Half-Blooded";
    } else if (checkPure === true) {
      return "Pure-Blooded";
    } else {
      return "Muggle";
    }
  }

  return student;
}
//SEARCH BY FIRST AND LAST NAMES
function searching(event) {
  console.log("search names");
  //Value from the search bar
  let keywords = event.target.value;
  const searchFirstname = event.target.dataset.firstname;
  const searchLastname = event.target.dataset.lastname;
  const searchHouse = event.target.dataset.house;

  if (searchFirstname === "firstname") {
    keywords = "firstname";
  } else if (searchLastname === "lastname") {
    keywords = "lastname";
  } else if (searchHouse === "house") {
    keywords = "house";
  }
  displayList(searchForStudents(keywords));
}

function searchForStudents(keywords) {
  console.log("searchForStudents");
  const searchresult = students.filter(searchFunction);
  keywords = keywords.toLowerCase();

  function searchFunction(student) {
    let firstnameLower = student.firstname.toLowerCase();
    let lastnameLower = student.lastname.toLowerCase();
    let houseLower = student.house.toLowerCase();

    if (firstnameLower.indexOf(keywords) > -1 || firstnameLower === keywords) {
      return true;
    } else if (lastnameLower.indexOf(keywords) > -1 || lastnameLower === keywords) {
      return true;
    } else if (houseLower.indexOf(keywords) > -1 || houseLower === keywords) {
      return true;
    } else {
      return false;
    }
  }
  return searchresult;
}
//FILTERING BY HOUSE
function filteringhouse(event) {
  //HUSK: atribute 'value' skal have den samme navn som info i listen
  const selectedHouse = event.target.value;
  //løsningen virkede ikke før fordi value = "slytherrin", men student.house = "Slytherin"
  if (selectedHouse === "*") {
    displayList(students);
  } else {
    displayList(filterByHouse(selectedHouse));
  }
}

function filterByHouse(selectedHouse) {
  const result = students.filter(filterFunction);

  function filterFunction(student) {
    if (student.house === selectedHouse) {
      return true;
    } else {
      return false;
    }
  }
  return result;
}

//SORTING BY NAME
function sortingname(event) {
  console.log("sorting name");
  const sortDir = event.target.dataset.sortDirection;
  const sortInfo = event.target.dataset.sort;

  //The switch mellem ascending og descending
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "dsc";
  } else if (sortDir === "dsc") {
    event.target.dataset.sortDirection = "asc";
  }

  displayList(sortByName(sortInfo, sortDir));
}

function sortByName(sortInfo, sortDir) {
  console.log("sortByName");
  let sortedlist;

  if (sortDir === "asc") {
    sortedlist = students.sort(compareAsc);
    console.log("sortAsc");
  } else if (sortDir === "dsc") {
    sortedlist = students.sort(compareDsc);
    console.log("sortDsc");
  }

  //Declaring the ascending order of array
  function compareAsc(a, b) {
    console.log("compareAsc");
    if (a[sortInfo] < b[sortInfo]) {
      return -1;
    } else {
      return 1;
    }
  }
  //Declaring the descending order of array
  function compareDsc(a, b) {
    console.log("compareDsc");
    if (a[sortInfo] > b[sortInfo]) {
      return -1;
    } else {
      return 1;
    }
  }
  return sortedlist;
}

function buildList() {
  const currentList = students;
  displayList(currentList);
}

function displayList(students) {
  // clear the list
  HTML.thelist.innerHTML = "";
  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  //Show the list's status
  const displaySlytherin = students.filter(student => student.house === "Slytherin");
  const displayHufflepuff = students.filter(student => student.house === "Hufflepuff");
  const displayRavenclaw = students.filter(student => student.house === "Ravenclaw");
  const displayGryffindor = students.filter(student => student.house === "Gryffindor");

  HTML.displaySlytherin.textContent = "Slytherin: " + displaySlytherin.length + " students";
  HTML.displayHufflepuff.textContent = "Hufflepuff: " + displayHufflepuff.length + " students";
  HTML.displayRavenclaw.textContent = "Ravenclaw: " + displayRavenclaw.length + " students";
  HTML.displayGryffindor.textContent = "Gryffindor: " + displayGryffindor.length + " students";

  HTML.displaystudents.textContent = "Current total: " + students.length + " students";

  // create clone
  const clone = HTML.theclone.content.cloneNode(true);

  // set clone data
  clone.querySelector(".studentAvatar").src = "images/" + student.photo;
  clone.querySelector("[data-field=firstname]").textContent = student.firstname;
  clone.querySelector("[data-field=lastname]").textContent = student.lastname;
  clone.querySelector("[data-field=house]").textContent = "House of " + student.house;

  // append clone to list
  HTML.thelist.appendChild(clone);


  // click event for one student
  HTML.thelist.lastElementChild.addEventListener("click", () => {
    modalitoUno(student);
  });
}

//Display modal's area
function modalitoUno(student) {
  HTML.modalito.style.display = "block";

  //show the theme according (dataset has the same value as json object)
  HTML.modalito.dataset.theme = student.house;
  HTML.closeModalito.addEventListener("click", closeModalito);


  function closeModalito() {
    //Getting rid of the click events
    HTML.modalito.style.display = "none";
  }

  //Detailed view of the modal's information
  document.querySelector("#displayOneStudent > div.topOfModal > div > h2.firstname").textContent =
    student.firstname;
  document.querySelector("#displayOneStudent > div.topOfModal > div > h2.middlename").textContent =
    student.middlename;
  document.querySelector("#displayOneStudent > div.topOfModal > div > h2.lastname").textContent =
    student.lastname;
  document.querySelector("[data-field=photo]").src = "images/" + student.photo;
  document.querySelector("[data-field=gender]").textContent =
    "Gender: " + student.gender;
  document.querySelector("[data-field=house]").textContent =
    "House: " + student.house;
  document.querySelector("[data-field=bloodstatus]").textContent =
    "Blood status: " + student.blood;
}