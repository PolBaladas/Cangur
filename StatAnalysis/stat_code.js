var ss = SpreadsheetApp.openById("1hnh4O4GiWQH8yJtppSdyy3SaVNXDZAx5YX9o-0Jc5AE").getSheetByName("RECULL");
var escoles = ss.getRange("AK2:AK"+ss.getLastRow()).getValues();
var anys = ss.getRange("C2:C"+ss.getLastRow()).getValues();
var lvls = ss.getRange("D2:D"+ss.getLastRow()).getValues();
var correctAnswers;

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Form.html');
  template.action = ScriptApp.getService().getUrl();
  template.escoles = getEscoles();
  return template.evaluate();
}

//Like the "post" (query) function:
function queryFromForm(form) {
  // Fill in response template
  var template = HtmlService.createTemplateFromFile('Result.html');
  var keys = getAnalytics(form);
  template.keys = keys;
  return template.evaluate().getContent();
}

function getAnalytics(form){
  var keys = [];
  var any = parseInt(form.year);
  var level = parseInt(form.level);
  var questions = form.questions;
  var escola = form.escola;
  correct_answers = getCorrectAnswers(any, level, questions);
  correctAnswers = correct_answers;
  var stats = getAnswerStatistics(any, level, questions, escola);
  keys[0] = correct_answers;
  keys[1] = stats;
  Logger.log(keys);
  return keys;
}

function logForm(form){
  var escoles = getEscoles();
  Logger.log(form.year);
  Logger.log(form.level);
  Logger.log(form.questions);
  Logger.log(escoles[form.escola])
}

function getCorrectAnswers(year,level, questions){
  var ssheet = SpreadsheetApp.openById('1hnh4O4GiWQH8yJtppSdyy3SaVNXDZAx5YX9o-0Jc5AE');
  var keySheetName = ssheet.getSheets()[1].getName();
  var sheet = ssheet.setActiveSheet(ssheet.getSheetByName(keySheetName).activate());

  var firstkeyRow = getFirstKeyRow(year,level,sheet)
  var startColumn = 3;
  var numColumns = 30;
  if(questions.length<=2){
     numColumns=1;
     startColumn = parseInt(questions)+2;
  }
  else{
    var interval = questions.split('-');
    startColumn = parseInt(interval[0])+2;
    numColumns =  parseInt(interval[1])-interval[0]+1;
  }
  var correct_keys = sheet.getSheetValues(firstkeyRow, startColumn, 1, numColumns)[0].valueOf();
  correct_keys.unshift(startColumn-2)
  return correct_keys;
}

function getAnswerStatistics(any, lvl, questions, escola){
  var stats = []
  if(questions.length<=2){
     stats.push(getSingleQuestionStats(any,lvl, parseInt(questions),escola))
  }
  else{
    var interval = questions.split('-');
    var start = parseInt(interval[0]);
    var end =  parseInt(interval[1]);
    Logger.log(start);
    Logger.log(end)
    for(var i=start; i<=end; i++){
      stats.push(getSingleQuestionStats(any,lvl,i, escola));
    }
  }
  Logger.log(stats)
  return stats;
}

function getSingleQuestionStats(any, lvl, question_number, escola){
  var stats=[0,0,0,0,0,0,0,0];
  var letter_index = ['A','B','C','D','E','F','G'];
  
  var data = ss.getRange(2, 4+question_number, ss.getLastRow()-1, 1).getValues();
  var correct_answer = getSingleAnswerByNumber(question_number);
  var cat_counter = 0;
  var cat_total = 0;
  var query_total = 0;
  
  for(var i in data){
    if(any==parseInt(anys[i]) && lvl==parseInt(lvls[i])){
      if(data[i].toString()==correct_answer){cat_counter+=1;}
      if(escoles[i]==escola || escola=="Totes"){
        stats[letter_index.indexOf(data[i].toString())]=stats[letter_index.indexOf(data[i].toString())]+1;
        query_total+=1;
      }
      cat_total+=1;
    }
  }
  
  for(var j in stats){stats[j]=stats[j]*100/query_total}
  stats[7]=cat_counter*100/(cat_total);
  return stats;
}

function getSingleAnswerByNumber(question_number){
  return correctAnswers[question_number];
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