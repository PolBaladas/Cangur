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

var studentAnswers;
var realResults;

function notificaMeLa() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.setActiveSheet(ss.getSheetByName("RECULL").activate());

  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();

  var usuari = sheet.getRange(lastRow, 2).getValue();
  var testYear = sheet.getRange(lastRow, 3).getValue();
  var testLevel = sheet.getRange(lastRow, 4).getValue();
  var prof = sheet.getRange(lastRow, lastColumn-1).getValue();

  Logger.log("Usuari: "+usuari + "\nAny: " + testYear + "\nNivell: " + testLevel);

  realResults = getKey(testYear,testLevel);
  studentAnswers = sheet.getSheetValues(lastRow,5,1,30)[0].valueOf();
  Logger.log('studentAnswers :'+studentAnswers);

  for (var n=0; n<studentAnswers.length; n++){
    var num = n+1;
    processAnswer(n,num);
  }

  Logger.log(resultsCompilation+"\n");
  Logger.log("\Ok: " + correctAnswersNum + "\nBad: " + incorrectAnswersNum);
  var nota = (correctAnswersNum/30)*10;
  var percentNota = (correctAnswersNum/30)*100;
  Logger.log("\n\n\tNota: " + nota.toFixed(2) + " ("+ percentNota.toFixed(2) + "%)");
  Logger.log("\n\nNota real: " + notaFinal);

  var parcials = "\n\nRespostes correctes:\n\nPreguntes 1-10:\t" + oneValuedAnswers.length +
            "\nPreguntes 11-20:\t" + twoValuedAnswers.length + "\nPreguntes 21-30:\t" + threeValuedAnswers.length +
            "\nSense resposta: " + blankAnswers.length;

  var teacherMail = prof + "@sarria.epiaedu.cat";

  var txtAlumne = "Hola " + usuari + ", Acabes de resoldre una nova prova cangur "
                    +".\n\nAquesta és la teva llista de resultats: \n" +
                    "\nAlumne/a: " + usuari + "\n\nAny de la prova: " + testYear + "\nNivell: " + testLevel +
                    "\nNota final: " + notaFinal + parcials + "\n\nLlista_OK: \n"
                    + correctAnswers + "\n\nLlista_Bad: \n" + incorrectAnswers +
                    "\n\nLlista_Blanks: \n"+ blankAnswers + "\n\nResultats: \n\n"+resultsCompilation;

  var txtProf = "Hola " + prof + ",\n\nT'acaba d'arribar una nova entrada de la prova cangur de l'usuari "
                    +usuari+ ".\n\nAquesta és la llista dels seus resultats: \n" +
                    "\nAlumne/a: " + usuari + "\nAny de la prova: " + testYear + "\nNivell: " + testLevel +
                    "\nNota final: " + notaFinal + parcials + "\n\nLlista_OK: \n"
                    + correctAnswers + "\n\nLlista_Bad: \n" + incorrectAnswers +
                    "\n\nLlista_Blanks: \n"+ blankAnswers + "\n\nResultats: \n\n"+resultsCompilation;

  var parcialsDoc = "\n\nRespostes correctes \(parcials\): \nPreguntes 1-10:\t" + oneValuedAnswers.length +
            "\nPreguntes 11-20:\t" + twoValuedAnswers.length + "\nPreguntes 21-30:\t" + threeValuedAnswers.length;

  var txtDocProf = "\nAlumne/a: " + usuari + "\nAny: " + testYear + "\nNivell: " + testLevel +
                    "\nNota final: " + notaFinal + parcialsDoc;

  MailApp.sendEmail(usuari,"\[NOTIFICANGUR\]: ", txtAlumne);
  MailApp.sendEmail(teacherMail,"\[NOTIFICANGUR\]: " + usuari, txtProf);

  omplirFull(txtDocProf,prof);
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

function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Send data",
    functionName : "notificaMeLa"
  }];
  sheet.addMenu("NOTIFICANGUR", entries);
};
