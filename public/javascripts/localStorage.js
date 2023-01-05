// https://developer.mozilla.org/en-US/docs/Web/API/Storage
// Stores array of objects which contain bin pathkey and dateCreated ({ pathkey, dateCreated })
// as string in LocalStorae under key specified by storageKey constant

const storageKey = 'requestBinList';

function storeBin(pathkey) {
  let bin = {
    pathkey,
    dateCreated: String(new Date()),
  }

  let binList = getBinsFromLocalStorage();
  binList.push(bin);
  
  window.localStorage.setItem(storageKey, JSON.stringify(binList));

  return binList;
}

function deleteBin(pathkey) {
  let binList = getBinsFromLocalStorage();
  binList = binList.filter(bin => bin.pathkey !== pathkey);

  window.localStorage.setItem(storageKey, JSON.stringify(binList));

  return binList;
}

function getBinsFromLocalStorage() { // returns array of objects { pathkey, dateCreated }
  let binList = JSON.parse(window.localStorage.getItem(storageKey));
  if (!binList) binList = [];

  return binList;
}

export const LocalStorage = { storeBin, deleteBin, getBinsFromLocalStorage };