/* Tanımlamalar */
const html = document.querySelector("html");
const searchInput = document.querySelector("#searchInput");
const searchIcon = document.querySelector(".searchIco");
const toggleIcon = document.querySelector(".toggleIcon");
const wrapper = document.querySelector(".gridContainer");
const searchArea = document.querySelector(".searchArea");
const countryContainer = document.querySelector(".countryContainer");
const selectOption = document.querySelector(".filterDiv");
/* Tanımlamalar */

showCountries(); /* başlangıçta belirtilen ülkeleri çağıran fonksiyon */

/* Fetch api fonksiyonları */
async function getCountry(countryData) {
  let link = ( countryData == "all"  ?  "https://restcountries.com/v3.1/" : "https://restcountries.com/v3.1/name/" )
  try {
    const response = await fetch(
      link + countryData
    );
    const data = await response.json();
    console.log(data.length)
    return data;
   
  } catch {
    console.log("error");
  }
}

async function getRegion(region) {
  
  const response = await fetch(
    "https://restcountries.com/v3.1/region/" + region
  );
  const data = await response.json();
  return data;
}
/* Fetch api fonksiyonları */

/* Card Template */
function cardCreate(countryData) {
  const card = document.createElement("div");
  card.className = "card";
  card.setAttribute("onclick","showDetails(this)"); 
  card.setAttribute("id",`${countryData.name.common}`); 
  card.innerHTML = `
          <div class="cardImg">
            <img src="${countryData.flags.png}" alt="" />
          </div>
          <h3 class="cardTitle">${countryData.name.common}</h3>
          <div class="cardDetails">
            <p><strong>Population:</strong> ${countryData.population}</p>
            <p><strong>Region:</strong> ${countryData.region}</p>
            <p><strong>Capital:</strong> ${countryData.capital}</p>
          </div>`;
  wrapper.append(card);
}
/* Card Template */

/* Detail Template */
async function showDetails(value) { 
  const detail = document.createElement("div");
  wrapper.style.display = "none";
  searchArea.style.display = "none";
  const countryData = (await getCountry(value.id))[0];
  detail.innerHTML = `
  <button class="btnBack" onclick="backButton(this)"><i class="fa-solid fa-arrow-left-long"></i>Back</button>
   <div class="countryDetails">
          <div class="detailImg">
            <img src="${countryData.flags.svg}" alt="" />
          </div>
          <div class="detailDiv">
            <h1 class="detailTitle">${countryData.name.common}</h1>
            <div class="detailDivFlex">
              <div class="col">
                <p><strong>Native Name:</strong> ${Object.values(countryData.name.nativeName)[0].common}</p>
                <p><strong>Population:</strong> ${countryData.population}</p>
                <p><strong>Region:</strong> ${countryData.region}</p>
                <p><strong>Sub Region:</strong> ${countryData.subregion}</p>
                <p><strong>Capital:</strong> ${countryData.capital}</p>
              </div>
              <div class="col">
                <p><strong>Top Level Domain:</strong> ${countryData.tld}</p>
                <p><strong>Curencies:</strong> ${Object.keys(countryData.currencies)}</p>
                <p><strong>Languages:</strong> ${Object.values(countryData.languages)}</p>
              </div>
            </div>
            <div class="borders">
            <span class="borderTitle">Border Countries:</span>
          
             ${bordersLoop(countryData.borders)}
              </div>
          </div>
        </div>
  `;
  countryContainer.append(detail);
}

/* Detail Template */

/* Preview imagede belirtilen ülkeri gösteren fonksiyon */
async function showCountries() {
  divClear();
  const countryData = await getCountry("all");
  const filtered = countryData.filter((item,index)=>{
    return  (item.cca3 == "USA" || item.cca3 == "DEU" || item.cca3 == "BRA"  
    || item.cca3 == "ISL" || item.cca3 == "AFG" 
     || item.cca3 == "ALA" || item.cca3 == "ALB" || item.cca3 == "DZA");
    }) // Ön Sayfadaki ülkelerin filtrelenmesi   
  const sortedContries = [filtered[1],filtered[6],filtered[5],filtered[3],filtered[2],filtered[0],filtered[7],filtered[4]] // Manuel Sıralama
    for (let i = 0; i < sortedContries.length; i++) {
    cardCreate(sortedContries[i]);
  }
  if(selectOption.classList.contains('showOption')) {selectOption.classList.remove("showOption");}
  
}
/* Preview imagede belirtilen ülkeri gösteren fonksiyon */

/* Bölgeye göre ülke getiren fonksiyon */
async function showByRegion(value) {
  divClear();
  const countryData = await getRegion(value.id);
  for (let i = 0; i < countryData.length; i++) {
    cardCreate(countryData[i]);
  }
  selectOption.classList.toggle("showOption");
}

/* Arama fonksiyonu */
async function searchCountry() {
  const countryName = document.querySelector("#searchInput").value == "" ? "all" : document.querySelector("#searchInput").value ;
 if ( countryName == "all"){showCountries() return;} 
  const countryData = await getCountry(countryName);
  divClear();
  
  for (let i = 0; i < countryData.length; i++) {
    cardCreate(countryData[i]);
  }
}

searchInput.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    event.preventDefault();
    searchCountry();
  }

});
/* Arama fonksiyonu */

/* Buton ve select fonksiyonları */

function toggleCheckBox(checkBox) {
  if (!checkBox.checked) {
    html.dataset.color = "dark";
    toggleIcon.classList.add("dark");
    searchIcon.classList.add("dark");
    searchInput.classList.add("dark");
  } else {
    html.dataset.color = "white";
    toggleIcon.classList.remove("dark");
    searchIcon.classList.remove("dark");
    searchInput.classList.remove("dark");
  }
}

function showDropdown() {
  selectOption.classList.toggle("showOption");
}


function divClear() {
  wrapper.innerHTML = ``;
}

function backButton(element) {
  wrapper.style.display = "grid";
  searchArea.style.display = "flex";
  const parrent = element.parentElement;
  parrent.remove();
}
/* Buton ve select fonksiyonları */

function bordersLoop (borders){
 if(typeof borders == "undefined") return "-";
  let borderCountries = "";
  for (let i = 0; i < borders.length; i++) {
   borderCountries += `<button class="bCountry" disabled="disabled">${borders[i]}</button>`
    
  }
  console.log(borderCountries)
  return borderCountries;
}
