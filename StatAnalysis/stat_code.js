function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Form.html');
  template.action = ScriptApp.getService().getUrl();
  template.escoles = getEscoles();
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
  logForm(form);
  return keys;
}

function logForm(form){
  var escoles = getEscoles();
  Logger.log(form.year);
  Logger.log(form.level);
  Logger.log(form.question);
  Logger.log(escoles[form.escola])
}

function getEscoles(){
  return SpreadsheetApp
    .openById('1GM9lxR7fS0u9bOvrB2RXlhAW_H76Xx6R9h6ABFVHvuc')
    .getActiveSheet()
    .getDataRange()
    .getValues();
}
