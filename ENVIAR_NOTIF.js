var correctAnswersNum = 0;
var incorrectAnswersNum = 0;
var blankAnswersNum = 0;

var resultsCompilation = new Array();
var correctAnswers = new Array();
var incorrectAnswers = new Array();
var blankAnswers = new Array();

var oneValuedAnswers = new Array();
var twoValuedAnswers = new Array();
var threeValuedAnswers = new Array();

var resultLogChain = "";
var valor = 0;
var notaFinal = 30;

var usuari;
var prof;
var studentAnswers;
var realResults;

function notificaMeLa() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.setActiveSheet(ss.getSheetByName("RECULL").activate());
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  var testYear = sheet.getRange(lastRow, 3).getValue();
  var testLevel = sheet.getRange(lastRow, 4).getValue();

  usuari = sheet.getRange(lastRow, 2).getValue();
  prof = sheet.getRange(lastRow, lastColumn-1).getValue();
  Logger.log("Usuari: "+usuari + "\nAny: " + testYear + "\nNivell: " + testLevel);
  
  realResults = getKey(testYear,testLevel);
  studentAnswers = sheet.getSheetValues(lastRow,5,1,30)[0].valueOf();
  Logger.log('studentAnswers :'+studentAnswers);

  for (var n=0; n<studentAnswers.length; n++){
    var num = n+1;
    processAnswer(n,num);
  }

  var nota = (correctAnswersNum/30)*10;
  var percentNota = (correctAnswersNum/30)*100;
  
  sendMails(usuari,prof,nota,testYear,testLevel);
  //omplirFull(txtDocProf,prof);
}

function processAnswer(n,num){
  if(studentAnswers[n]!=""){
    if(studentAnswers[n]==realResults[n]){       //Correct answer
      if(n>=0 && n<10){
        valor = 3;
        oneValuedAnswers.push("P"+num);
      }
      else if(n>=10 && n<20){
        valor = 4;
        twoValuedAnswers.push("P"+num);
      }
      else if(n>=20 && n<30){
        valor = 5;
        threeValuedAnswers.push("P"+num);
      }
      
      pushCorrectAnswer(n,valor);
    }
    
    else{                                                   //Incorrect Answer
      if(n>=0 && n<11){valor = 3;}
      else if(n>=11 && n<21){valor = 4;}
      else if(n>=21 && n<=30){valor = 5;}
      pushIncorrectAnswer(n,valor)
    }
  }
  
  else{                                                   //Blank Answer
    pushBlankAnswer(n)
  }

}

function pushCorrectAnswer(n, val){
  correctAnswersNum+=1;
  notaFinal+=valor;
  resultLogChain = "P"+n+1+": "+studentAnswers[n]+" (OK)";
  resultsCompilation.push(resultLogChain);
  correctAnswers.push("P"+n+1);
}

function pushIncorrectAnswer(n, val){
  incorrectAnswersNum+=1;
  notaFinal = notaFinal-valor/4;
  resultLogChain = "** P"+n+1+": "+studentAnswers[n]+" ("+ realResults[n]+")";
  resultsCompilation.push(resultLogChain);
  incorrectAnswers.push("P"+n+1);
}

function pushBlankAnswer(n){
  blankAnswersNum+=1;
  notaFinal = notaFinal;
  resultLogChain = "** P"+n+1+": "+studentAnswers[n]+" ("+ realResults[n]+")";
  resultsCompilation.push(resultLogChain);
  blankAnswers.push("P"+n+1);
}

function getKey(year,level){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var keySheetName = SpreadsheetApp.getActiveSpreadsheet().getSheets()[1].getName();
  var sheet = ss.setActiveSheet(ss.getSheetByName(keySheetName).activate());

  var firstkeyRow = getFirstKeyRow(year,level,sheet)
  var key = sheet.getSheetValues(firstkeyRow, 3, 1, 30)[0].valueOf();
  Logger.log("\n"+'key :'+key+"\n");

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

function sendMails(usuari, prof, nota,testYear, testLevel){
  var markers = ['%user%','%user%','%testYear%','%testLevel%','%notaFinal%',
  '%1to10%','%11to20%','%21to30%','%blankNum%','%correctAnswers%',
  '%incorrectAnswers%','%blankAnswers%'];
  var vars = [usuari,usuari,testYear, testLevel, notaFinal, oneValuedAnswers.length, 
          twoValuedAnswers.length, threeValuedAnswers.length,blankAnswers.length, 
         correctAnswers, incorrectAnswers, blankAnswers];
  
  var docId = '1UJCuEos8KerbxSJnl14ttTOH-zIVHm5gNybeS8Dz9xY'
  var emailTxt = DocumentApp.openById(docId).getBody().getText();
  for(var k=0; k<markers.length; k++){
    emailTxt = emailTxt.replace(markers[k], vars[k]);
  }
  //TODO : Different e-mails for teachers and students?
  var teacherMail = prof + "@sarria.epiaedu.cat";
  MailApp.sendEmail(usuari,"\[NOTIFICANGUR\]: ", emailTxt);
  MailApp.sendEmail(teacherMail,"\[NOTIFICANGUR\]: " + usuari, emailTxt);
}

function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Send data",
    functionName : "notificaMeLa"
  }];
  sheet.addMenu("NOTIFICANGUR", entries);
};