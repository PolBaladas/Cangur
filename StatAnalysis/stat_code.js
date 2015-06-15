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
  template.keys = keys;
  return template.evaluate().getContent();
}

function getAnalytics(form){
  var keys = [];
  logForm(form);
  var answers = getAnswers(parseInt(form.year), parseInt(form.level));
  Logger.log(answers);
  keys[0] = answers;
  return keys;
}

function logForm(form){
  var escoles = getEscoles();
  Logger.log(form.year);
  Logger.log(form.level);
  Logger.log(form.question);
  Logger.log(escoles[form.escola])
}

function getAnswers(year,level){
  var ss = SpreadsheetApp.openById('1hnh4O4GiWQH8yJtppSdyy3SaVNXDZAx5YX9o-0Jc5AE');
  var keySheetName = ss.getSheets()[1].getName();
  var sheet = ss.setActiveSheet(ss.getSheetByName(keySheetName).activate());

  var firstkeyRow = getFirstKeyRow(year,level,sheet)
  var key = sheet.getSheetValues(firstkeyRow, 3, 1, 30)[0].valueOf();
  return key;
}

function getFirstKeyRow(year, level, sheet){
  var yearRow = getYearRow(year,sheet);
  var lvlRow = getLevelRow(level, yearRow);
  return lvlRow;
}

function getYearRow(requestedYear, sheet){
  var rowNum = 1;
  var foundYear = sheet.getRange("A2").getValue;

  while(foundYear!=requestedYear){
    foundYear = sheet.getRange("A"+rowNum).getValue();
    rowNum+=1
  }
  return rowNum-1;
}

function getLevelRow(requestedLevel, yearRow){
  var lvlRow = yearRow+requestedLevel;
  return lvlRow-1;
}


function getEscoles(){
  return SpreadsheetApp
    .openById('1GM9lxR7fS0u9bOvrB2RXlhAW_H76Xx6R9h6ABFVHvuc')
    .getActiveSheet()
    .getDataRange()
    .getValues();
}
