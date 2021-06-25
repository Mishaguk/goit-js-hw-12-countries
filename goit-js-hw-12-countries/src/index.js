import debounce from 'lodash.debounce';
import toastr from 'toastr';

import 'toastr/build/toastr.min.css';
import './sass/main.scss';

toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  positionClass: 'toast-top-right',
  preventDuplicates: false,
  onclick: null,
  showDuration: '300',
  hideDuration: '1000',
  timeOut: '3000',
  extendedTimeOut: '1000',
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut',
};

const refs = {
  inputCountryName: document.querySelector('#input-country-name'),
  countryList: document.querySelector('#country-list'),
  singleCountry: document.querySelector('.single-country'),
  name: document.querySelector('#name'),
  capital: document.querySelector('#capital'),
  population: document.querySelector('#population'),
  languages: document.querySelector('#languages'),
  flag: document.querySelector('#flag'),
};

const handleInputChange = e => {
  const { value } = e.target;

  if (!value) {
    refs.countryList.innerHTML = '';
    return;
  }

  fetch(`https://restcountries.eu/rest/v2/name/${value}`)
    .then(resp => resp.json())
    .then(data => {
      refs.countryList.innerHTML = '';
      refs.singleCountry.classList.remove('show');

      if (!data.map) {
        toastr.error(data.message);
        return;
      }

      const list = data.map(({ name }) => `<li>${name}</li>`).join('');

      if (data.length === 1) {
        const { name, capital, population, languages, flag } = data[0];
        const languagesList = languages.map(({ name }) => `<li>${name}</li>`).join('');

        refs.singleCountry.classList.add('show');
        refs.name.textContent = name;
        refs.capital.textContent = capital;
        refs.population.textContent = population;
        refs.languages.innerHTML = '';
        refs.languages.insertAdjacentHTML('beforeend', languagesList);
        refs.flag.src = flag;
      } else if (data.length > 10) {
        toastr.error('Too many matches found. Please enter a more specific query!');
      } else {
        refs.countryList.insertAdjacentHTML('beforeend', list);
      }
    })
    .catch(error => {
      console.log(error);
    });
};

const debouncedHandleInputChange = debounce(handleInputChange, 400);

refs.inputCountryName.addEventListener('input', debouncedHandleInputChange);






