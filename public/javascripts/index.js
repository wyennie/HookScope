import { HBHelper } from './hbtemplate.js';
import { LocalStorage } from './localStorage.js';
const baseURL = 'http://localhost:3000';

class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View();
    this.bindEvents();
    this.view.bindEvents();
  }

  bindEvents() {
    this.view.bindCreateNewBin(this.createNewBin);
    this.model.bindDisplayBin(this.displayBin);
    this.view.bindGetAllRequests(this.getAllRequests);
  }

  createNewBin = () => this.model.createNewBin();

  displayBin = (pathkey) => this.view.displayBin(pathkey);

  getAllRequests = (pathkey) => this.model.getAllRequests(pathkey);
}

class Model {
  async createNewBin() {
    let response = await fetch(baseURL + '/bins/new', { method: 'POST' });
    let pathkey = await response.json();
    LocalStorage.storeBin(pathkey);
    this.displayBin(pathkey);
  }

  bindDisplayBin(callback) {
    this.displayBin = callback;
  }

  async getAllRequests(pathkey) {
    let response = await fetch(baseURL + `/bins/${pathkey}`);
    return await response.json();
  }
}

class View {
  constructor() {
    this.body = document.body;
    this.main = document.getElementById('root');
    this.getRequiredElements();
  }

  createElement(tag, id) {
    let element = document.createElement(tag);
    element.setAttribute('id', id);
    return element;
  }

  getRequiredElements() {
    this.createBinButton = document.getElementById("createBin");
    this.yourBinsButton = document.getElementById("yourBins");
  }

  bindEvents() {
    this.createBinButton.addEventListener('click', this.createNewBin);
    this.yourBinsButton.addEventListener('click', this.viewYourBins.bind(this));
  }

  bindRequestListEvent() {
    this.requestList.addEventListener('click', this.getRequestsForBin.bind(this));
  }

  bindCreateNewBin(callback) {
    this.createNewBin = callback;
  }

  bindGetAllRequests(callback) {
    this.getAllRequests = callback;
  }

  displayBin(pathkey, requestList=[]) {
    const html = HBHelper.binHTML({path: baseURL + `/req/${pathkey}`, requestList });
    this.main.innerHTML = '';
    this.main.insertAdjacentHTML('afterbegin', html);
  }

  viewYourBins(event) {
    event.preventDefault();
    const html = HBHelper.yourBinsHTML({});
    this.main.innerHTML = '';
    this.main.insertAdjacentHTML('afterbegin', html);
    this.requestList = document.getElementById('bin-links');
    this.bindRequestListEvent();
  }

  async getRequestsForBin(event) {
    event.preventDefault();
    let target = event.target;
    let pathkey;
    if (target.tagName == "A") {
      pathkey = event.target.id;
      let requestList = await this.getAllRequests(pathkey);
      const html = HBHelper.binHTML({ path: baseURL + `/req/${pathkey}`, requestList });
      this.main.innerHTML = '';
      this.main.insertAdjacentHTML('afterbegin', html);
    }
  }
}

new Controller();
