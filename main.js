window.addEventListener("DOMContentLoaded", start);

const HTML = {};
let students = [];
let arrHalf = [];
let arrPure = [];


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

  //Search event for search
  HTML.searchinput.addEventListener("keyup", searching);
  loadBlood();
}

async function loadBlood() {
  console.log("loadBlood");
  const response = await fetch(loadArray[1]);
  const jsonBlood = await response.json();

  prepareBlood(jsonBlood);
  loadStudents();
}

function prepareBlood(jsonBlood) {
  console.log("prepareBloodStatus");
  arrHalf = jsonBlood.half;
  arrPure = jsonBlood.pure;
}

async function loadStudents() {
  console.log("loadStudents");
  const response = await fetch(loadArray[0]);
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  console.log("prepareObjects");
  students = jsonData.map(prepareObject);
  displayList(students);
}

function prepareObject(jsonObject) {
  console.log("prepare new objects");
  const student = Object.create(Student);

  //Trim and splits names and houses into parts
  const fulltexts = jsonObject.fullname.trim().toLowerCase();
  const house = jsonObject.house.trim().toLowerCase();
  //const fulltexts = cleanup.replace(/"/g, "");
  const splitnames = fulltexts.split(" ");

  //FIRST NAME
  const first = splitnames[0];
  const firstCap = first[0].toUpperCase();
  const firstLower = first.slice(1).toLowerCase();
  const firstName = firstCap + firstLower;
  //Put values into new properties
  student.firstname = firstName;

  //LAST NAME
  const theLastSpace = fulltexts.lastIndexOf(" ");
  const last = fulltexts.substring(theLastSpace + 1, fulltexts.length);
  const lastName = last[0].toUpperCase() + last.slice(1).toLowerCase();
  let nameWithhyphen;
  //Put values into new properties
  if (lastName.includes("-") === true) {
    nameWithhyphen =
      lastName[6].toUpperCase() + lastName.slice(7).toLowerCase();
    student.lastname = lastName.substring(0, 6) + nameWithhyphen;
  } else if (lastName === "Leanne") {
    student.lastname = "";
  } else {
    student.lastname = lastName;
  }

  //MIDDLE NAME & NICK NAME (with quotes)
  const theFirstSpace = fulltexts.indexOf(" ");
  const middleName = fulltexts.substring(theFirstSpace + 1, theLastSpace);
  let ernie;
  let james;
  let lucius;
  //Put values into new properties
  if (middleName.includes("er") === true) {
    //keep quotes and capitalize first letter
    ernie =
      middleName[0] +
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

  //HOUSE
  const capHouse = house[0].toUpperCase() + house.slice(1).toLowerCase();
  //Put values into new properties
  student.house = capHouse;

  //GENDER
  const gender =
    jsonObject.gender[0].toUpperCase() +
    jsonObject.gender.slice(1).toLowerCase();
  student.gender = gender;

  //PHOTO
  const photo =
    lastName.toLowerCase() + "_" + firstName[0].toLowerCase() + ".png";
  let patilsPhoto = lastName.toLowerCase() + "_" + firstName.toLowerCase() + ".png";
  let fletchleysPhoto =
    lastName.substring(6) + "_" + firstName[0].toLowerCase() + ".png";
  //Put values into new properties
  if (photo === "patil_p.png") {
    student.photo = patilsPhoto;
  } else if (photo === "finch-fletchley_j.png") {
    student.photo = fletchleysPhoto;
  } else {
    student.photo = photo;
  }

  //BLOODSTATUS
  student.blood = bloodStt();

  function bloodStt() {


    function checking(bloodarr) {
      return student.lastname == bloodarr;
    }
    const checkPure = arrPure.some(checking);
    const checkHalf = arrHalf.some(checking);
    if (checkHalf === true && checkPure === true) {
      return "Halfblood";
    } else if (checkHalf === true) {
      return "Halfblood";
    } else if (checkPure === true) {
      return "Pureblood";
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

  //Ascending (stigende)
  function compareAsc(a, b) {
    console.log("compareAsc");
    if (a[sortInfo] < b[sortInfo]) {
      return -1;
    } else {
      return 1;
    }
  }
  //Descending (faldende)
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