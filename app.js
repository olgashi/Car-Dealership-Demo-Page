import { cars } from './car-data.js';
let carsCopy = [...cars];
document.addEventListener("DOMContentLoaded", (event) => {
  createPageElements();
  loadImages(carsCopy);

  const filterButtonEl = document.getElementsByClassName('filter-button')[0];
  const makeDropdown = document.querySelector('[name="make"]');


  makeDropdown.addEventListener('change', event => {
    carsCopy = [...cars];
    event.stopPropagation();

    const selectedDropDownName = 'make'
    const dropDownValue = event.target.value;
    const filterObj = {};
    filterObj[selectedDropDownName] = dropDownValue;

    carsCopy = filterDropdownOptionsforValue(filterObj, carsCopy);

    const modelDropdown = document.querySelector('[name="model"]');
    modelDropdown.textContent = '';

    const defaultOptionEl = createDefaultOptionElement();
    modelDropdown.appendChild(defaultOptionEl);

    let optonValuesArr = getUniqueElementsInArray(carsCopy.map(car => car['model']));

    optonValuesArr.forEach(val => {
      const option = document.createElement('option');
      const optionText = String(val);
      option.setAttribute('value', optionText.toLowerCase());
      option.textContent = optionText;
      modelDropdown.appendChild(option);
    });
  });

  filterButtonEl.addEventListener('click', event => {
    event.stopPropagation();

    const filterDropdownsArr = Array.from(document.querySelectorAll('.filter-dropdown'));

    if (filterDropdownsArr.every(dropdown => dropdown.value === 'all')) {
      carsCopy = [...cars];
      carsCopy = filterDropdownOptionsforValue(filterObj, carsCopy);
    }

    let selectedFilters = {};
    filterDropdownsArr.forEach(dropdown => {
      const dropdownValue = dropdown.value;
      if (dropdownValue.toLowerCase() !== 'all') {
        const dropdownName = dropdown.getAttribute('name');
        selectedFilters[dropdownName] = dropdownValue;
      }
    });

    const selectedFilterValuesArr = Object.values(selectedFilters);
    let filteredCarsArr = [...cars];

    selectedFilterValuesArr.forEach(filterType => {
      filteredCarsArr = filteredCarsArr.filter(carObj => Object.values(carObj).map(item => String(item).toLowerCase()).includes(filterType));
    });

    loadImages(filteredCarsArr);
  })
});

const createPageElements = () => {
  const wrapperDiv = document.getElementById('wrapper');

  const filterWrapperDiv = document.createElement("div");
  filterWrapperDiv.setAttribute("id", "filter-container");

  const filterWrapperDivTextElement = document.createElement('h2');
  filterWrapperDivTextElement.setAttribute('id', 'header-text')
  filterWrapperDivTextElement.textContent = 'Buy Used Cars';
  filterWrapperDiv.appendChild(filterWrapperDivTextElement);

  const mainContentDiv = document.createElement("div");
  mainContentDiv.setAttribute("id", "main-content");

  createFilteringDropdowns(filterWrapperDiv);
  createFilterButton(filterWrapperDiv);
  
  wrapperDiv.appendChild(filterWrapperDiv);
  wrapperDiv.appendChild(mainContentDiv);
}

const createDropdownElement = (parent, optionsArr, nameAttrValue, idValue) => {
  const makeLabel = document.createElement('label');
  makeLabel.setAttribute('for', idValue);
  makeLabel.textContent = nameAttrValue;

  const selectElement = document.createElement('select');
  selectElement.setAttribute('name', nameAttrValue.toLowerCase());
  selectElement.setAttribute('id', idValue);
  selectElement.classList.add('filter-dropdown');

  const defaultOptionElement = createDefaultOptionElement();
  selectElement.appendChild(defaultOptionElement);

  optionsArr.forEach(optionVal => {
    const optionElement = document.createElement('option');

    optionElement.setAttribute('value', String(optionVal).toLowerCase());
    optionElement.textContent = optionVal;

    selectElement.appendChild(optionElement);
  });

  parent.appendChild(makeLabel);
  parent.appendChild(selectElement);

  return true;
}

const getUniqueElementsInArray = (arr) => Array.from(new Set(arr));

const compareAsNumbers = (a, b) => Number(a) - Number(b);

const createFilteringDropdowns = (parentElement) => {

  const makeDropdownOptionsArr = getUniqueElementsInArray(carsCopy.map(obj => obj.make)).sort();
  createDropdownElement(parentElement, makeDropdownOptionsArr, 'Make',  'make-dropdown');
  
  const modelDropdownOptionsArr = getUniqueElementsInArray(carsCopy.map(obj => obj.model)).sort();
  createDropdownElement(parentElement, modelDropdownOptionsArr, 'Model',  'model-dropdown');
  
  const priceDropdownOptionsArr = getUniqueElementsInArray(carsCopy.map(obj => obj.price)).sort(compareAsNumbers);
  createDropdownElement(parentElement, priceDropdownOptionsArr, 'Price',  'price-dropdown');
  
  const yearDropdownOptionsArr = getUniqueElementsInArray(carsCopy.map(obj => obj.year)).sort(compareAsNumbers);
  createDropdownElement(parentElement, yearDropdownOptionsArr, 'Year',  'year-dropdown');
}

const createFilterButton = (parentEl) => {
  const filterButton = document.createElement('span');
  filterButton.classList.add('filter-button');
  filterButton.textContent = 'Filter';
  filterButton.setAttribute('disabled', true);

  parentEl.appendChild(filterButton);
}

const loadImages = (imgArr) => {
  document.getElementById('main-content').replaceChildren();
  imgArr.forEach(car => {
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('img-container');
    
    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', car.image);
    imageDiv.appendChild(imageElement);

    const makeModelSpan = document.createElement('span');
    makeModelSpan.textContent = `${car.make} ${car.model}`;
    makeModelSpan.classList.add('make-model-text');
    imageDiv.append(makeModelSpan);

    const yearSpan = document.createElement('span');
    yearSpan.textContent = `Year: ${car.year}`;
    yearSpan.classList.add('year-text');
    imageDiv.append(yearSpan);

    const priceSpan = document.createElement('span');
    priceSpan.textContent = `Price: $${car.price}`;
    priceSpan.classList.add('price-text');
    imageDiv.append(priceSpan);
    
    const buyButton = document.createElement('span');
    buyButton.classList.add('buy-btn');
    buyButton.textContent = "Buy";
    imageDiv.append(buyButton);

    document.getElementById('main-content').appendChild(imageDiv);
  });
}

const filterDropdownOptionsforValue = (valObj, carsObjArr) => {
  // valObj example => {make: 'Audi'} or {year: 2014}
  const filterType = Object.keys(valObj)[0];
  const filterValue = Object.values(valObj)[0];

  if (filterValue.toLowerCase() === 'all') {
    return [...cars];
  }

  return carsObjArr.filter(obj => {
    const val = String(obj[filterType]);
    return val.toLowerCase() === filterValue;
  });
}

const createDefaultOptionElement = () => {
  const option = document.createElement('option');
  option.setAttribute('value', 'All');
  option.textContent = 'All';
  option.setAttribute('selected', true);
  return option;
}