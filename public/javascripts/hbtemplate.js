import { LocalStorage } from './localStorage.js';

Handlebars.registerHelper('parseHeaders', function(headers) {
  return Object.keys(headers).map(header => {
    return { name: header, value: headers[header]};
  });
});

Handlebars.registerPartial('request', document.getElementById('request').innerHTML);

function requestHTML(requestObject) { // Argument: Object { method, header, body }
  let template = Handlebars.compile(document.getElementById('request').innerHTML);
  return template(requestObject);
}

function binHTML(binObject) { // Argmuent: Object { path, requestList }
  // requestList corresponds to the array of requests you get from the GET /bins/pathkey path
  // path should be assigned to pathkey
  let template = Handlebars.compile(document.getElementById('bin').innerHTML);

  binObject.requestList.forEach(request => {
    request.body = JSON.stringify(request.body);
  });

  return template(binObject);
}

function yourBinsHTML() { // Argument: Object { binList } where binList is array of objects containing path { path }
  let bins = LocalStorage.getBinsFromLocalStorage();

  let template = Handlebars.compile(document.getElementById('your-bins').innerHTML);
  return template({ bins });
}

// exported methods receive object with data, returns HTML string using Handlebars template
export const HBHelper = {
  requestHTML,
  binHTML,
  yourBinsHTML,
};








