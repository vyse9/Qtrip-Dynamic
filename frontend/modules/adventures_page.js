import config from "../conf/index.js";

//Implementation to extract city from query params
function getCityFromURL(search) {
  // TODO: MODULE_ADVENTURES
  // 1. Extract the city id from the URL's Query Param and return it
  const params = new URLSearchParams(search);
  
  let cityName = params.get("city")
  return cityName;

}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data
  try{
    let response = await fetch(config.backendEndpoint+`/adventures?city=${city}`);
    let data = await response.json();
    return data;
  }catch(err){
    return null;
  }

}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
  // TODO: MODULE_ADVENTURES
  // 1. Populate the Adventure Cards and insert those details into the DOM
  adventures.forEach((key) => {
  let divElem = document.createElement("div");
  divElem.className = "col-6 col-lg-3 mb-4 position-relative";
  divElem.innerHTML = `
  <a href="detail/?adventure=${key.id}" id=${key.id}>
  <div class="category-banner">${key.category}</div>
  <div class="activity-card">
  <img src="${key.image}" class="img-responsive"/>
  <div class="activity-card-text text-md-center w-100 mt-3">
     <div class="d-block d-md-flex justify-content-between flex-wrap ps-3 pe-3">
     <h5 class="text-left">${key.name}</h5>
      <p>${key.costperHead}</p>
  </div>
    <div class="d-block d-md-flex justify-content-between flex-wrap ps-3 pe-3">
    <h5 class="text-left">Duration</h5>
    <p>${key.duration} Hours</p>
    </div>
    </div>
    </div>
    </a>
        
  `;
  document.getElementById("data").appendChild(divElem); 
});



}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list
  let newlist = [];
  for(let i=0; i<list.length; i++){
    if(list[i].duration >=low && list[i].duration <=high){
      newlist.push(list[i]);
    }
  }
  return newlist;
}




//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list
 let filterList = [];
 categoryList.forEach((key)=>{
   list.forEach((element)=>{
     if(element.category===key){
       filterList.push(element);
     }
   })
 });
 return filterList;

}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  // TODO: MODULE_FILTERS
  // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures
  // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods
  let categoryList = filters.category;


  if (filters.duration == "" && filters.category.length == 0) {
    return list;
  } else if (filters.duration == "" && filters.category.length > 0) {
    let filteredList = filterByCategory(list, categoryList);
    return filteredList;
  } else if (filters.duration.length > 0) {
    if (filters.category.length === 0) {
      let lowValString;
      let highValString;
      let lowValNumber;
      let highValNumber;

      if (filters.duration.length === 3) {
        lowValString = filters.duration.charAt(0);
        highValString = filters.duration.charAt(2);
        lowValNumber = parseInt(lowValString, 10);
        highValNumber = parseInt(highValString, 10);
      } else if (filters.duration.length === 5) {
        let lowVal1 = filters.duration.charAt(0);
        let lowVal2 = filters.duration.charAt(1);
        lowValString = lowVal1 + "" + lowVal2;
        let highVal1 = filters.duration.charAt(3);
        let highVal2 = filters.duration.charAt(4);
        highValString = highVal1 + "" + highVal2;
        lowValNumber = parseInt(lowValString, 10);
        highValNumber = parseInt(highValString, 10);
      }
      let filteredList = filterByDuration(list, lowValNumber, highValNumber);
      return filteredList;

    } else if (filters.duration.length > 0) {
      let filteredListArr;
      if (filters.category.length > 0) {
        let lowValString;
        let highValString;
        let lowValNumber;
        let highValNumber;

        if (filters.duration.length === 3) {
          lowValString = filters.duration.charAt(0);
          highValString = filters.duration.charAt(2);
          lowValNumber = parseInt(lowValString, 10);
          highValNumber = parseInt(highValString, 10);
        } else if (filters.duration.length === 5) {
          let lowVal1 = filters.duration.charAt(0);
          let lowVal2 = filters.duration.charAt(1);
          lowValString = lowVal1 + "" + lowVal2;
          let highVal1 = filters.duration.charAt(3);
          let highVal2 = filters.duration.charAt(4);
          highValString = highVal1 + "" + highVal2;
          lowValNumber = parseInt(lowValString, 10);
          highValNumber = parseInt(highValString, 10);
        }
        let durationFiltered = filterByDuration(
          list,
          lowValNumber,
          highValNumber
        );
        let categoryFiltered = filterByCategory(list, categoryList);
        function extractFromId(arr1, arr2) {
          let finalDisplayArr = [];
          for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr2.length; j++) {
              if (arr1[i].id === arr2[j].id) {
                finalDisplayArr.push(arr1[i]);
              }
            }
          }
          return finalDisplayArr;
        }

        filteredListArr = extractFromId(durationFiltered, categoryFiltered);
      }
      return filteredListArr;
    }
  }


  // Place holder for functionality to work in the Stubs
  return list;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Store the filters as a String to localStorage
   let filter = JSON.stringify(filters);
   localStorage.setItem("filters",filter)

  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  // TODO: MODULE_FILTERS
  // 1. Get the filters from localStorage and return String read as an object
  let filters = JSON.parse(localStorage.getItem("filters"));

return filters


  // Place holder for functionality to work in the Stubs
  return null;
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // TODO: MODULE_FILTERS
  // 1. Use the filters given as input, update the Duration Filter value and Generate Category Pills
let clELM =document.getElementById("category-list");
let category = filters["category"];
category.forEach((e)=>{
  let hElm = document.createElement("h6");
  hElm.setAttribute("class", "category-filter");
  hElm.innerHTML= e;
  clELM.appendChild(hElm);
})

document.getElementById("duration-select").value=filters["duration"]

}
export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};
