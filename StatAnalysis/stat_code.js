function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Form.html');
  template.action = ScriptApp.getService().getUrl();
  template.escoles SpreadsheetApp
    .openById('1GM9lxR7fS0u9bOvrB2RXlhAW_H76Xx6R9h6ABFVHvuc')
    .getActiveSheet()
    .getDataRange()
    .getValues();
  return template.evaluate();
}

function processForm(form) {
  // Fill in response template
  var template = HtmlService.createTemplateFromFile('Result.html');
  var keys = getAnalytics(form);
  return template.evaluate().getContent();
}


function getAnalytics(form){
  var keys = [];
  return keys;
}