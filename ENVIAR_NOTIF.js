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
  
  var realResults = getKey(testYear,testLevel);
  var ok = 0;
  var bad = 0;
  var blank = 0;
  
  var llistaFinal = new Array();
  var llistaOk = new Array();
  var llistaBlank = new Array();
  
  var llistaOk1 = new Array();
  var llistaOk2 = new Array();
  var llistaOk3 = new Array();
  
  var llistaBad = new Array();
  var resultFinal = "";
  var valor = 0;
  var notaFinal = 30;
  
  var studentAnswers = sheet.getSheetValues(lastRow,5,1,30) //5->1st Anwer on sheet; 1-> one row; 30-> 30 columns of data.
  
  Logger.log(studentAnswers);
  
  for (var n=0;n<studentAnswers.length;n++){
    var num = n+1;
    
    if (studentAnswers[n]!=""){
      if(realResults[n].indexOf(studentAnswers[n])<-1){  
        
        if(n>=0&&n<10){
          valor = 3;
          llistaOk1.push("P"+num);
        }
        else if(n>=10&&n<20){
          valor = 4;
          llistaOk2.push("P"+num);
        }
        else if(n>=20&&n<30){
          valor = 5;
          llistaOk3.push("P"+num);
        }
     
        ok = ok+1;
        notaFinal = notaFinal+valor;
        resultFinal = "P"+num+": "+studentAnswers[n]+" (OK)";
        llistaFinal.push(resultFinal);
        llistaOk.push("P"+num);
      }

      else{
        if(n>=0&&n<11){
          valor = 3;
        }
        else if(n>=11&&n<21){
          valor = 4;
        }
        else if(n>=21&&n<=30){
          valor = 5;
        }         
        
        bad = bad+1;
        notaFinal = notaFinal-valor/4;
        resultFinal = "** P"+num+": "+studentAnswers[n]+" ("+ realResults[n]+")";
        llistaFinal.push(resultFinal);
        llistaBad.push("P"+num);
      }
    }

    else{
      blank = blank+1;
      notaFinal = notaFinal;
      resultFinal = "** P"+num+": "+studentAnswers[n]+" ("+ realResults[n]+")";
      llistaFinal.push(resultFinal);
      llistaBlank.push("P"+num);
    }
  }

  Logger.log(llistaFinal+"\n");
  Logger.log("\Ok: " + ok + "\nBad: " + bad);
  var nota = (ok/30)*10;
  var percentNota = (ok/30)*100;
  Logger.log("\n\n\tNota: " + nota.toFixed(2) + " ("+ percentNota.toFixed(2) + "%)");
  Logger.log("\n\nNota real: " + notaFinal);
  
  var parcials = "\n\nRespostes correctes:\n\nPreguntes 1-10:\t" + llistaOk1.length +
            "\nPreguntes 11-20:\t" + llistaOk2.length + "\nPreguntes 21-30:\t" + llistaOk3.length +
            "\nSense resposta: " + llistaBlank.length;
  
  var teacherMail = prof + "@sarria.epiaedu.cat";
  
  var txtAlumne = "Hola " + usuari + ", Acabes de resoldre una nova prova cangur "
                    +".\n\nAquesta és la teva llista de resultats: \n" +
                    "\nAlumne/a: " + usuari + "\n\nAny de la prova: " + testYear + "\nNivell: " + testLevel +
                    "\nNota final: " + notaFinal + parcials + "\n\nLlista_OK: \n"
                    + llistaOk + "\n\nLlista_Bad: \n" + llistaBad + 
                    "\n\nLlista_Blanks: \n"+ llistaBlank + "\n\nResultats: \n\n"+llistaFinal;
  
  var txtProf = "Hola " + prof + ",\n\nT'acaba d'arribar una nova entrada de la prova cangur de l'usuari "
                    +usuari+ ".\n\nAquesta és la llista dels seus resultats: \n" +
                    "\nAlumne/a: " + usuari + "\nAny de la prova: " + testYear + "\nNivell: " + testLevel +
                    "\nNota final: " + notaFinal + parcials + "\n\nLlista_OK: \n"
                    + llistaOk + "\n\nLlista_Bad: \n" + llistaBad + 
                    "\n\nLlista_Blanks: \n"+ llistaBlank + "\n\nResultats: \n\n"+llistaFinal;
  
  var parcialsDoc = "\n\nRespostes correctes \(parcials\): \nPreguntes 1-10:\t" + llistaOk1.length +
            "\nPreguntes 11-20:\t" + llistaOk2.length + "\nPreguntes 21-30:\t" + llistaOk3.length;
  
  var txtDocProf = "\nAlumne/a: " + usuari + "\nAny: " + testYear + "\nNivell: " + testLevel +
                    "\nNota final: " + notaFinal + parcialsDoc;
  
  MailApp.sendEmail(usuari,"\[NOTIFICANGUR\]: ", txtAlumne);
  
  MailApp.sendEmail(teacherMail,"\[NOTIFICANGUR\]: " + usuari, txtProf);
  
  omplirFull(txtDocProf,prof);
  
  //var range = sheet.getRange("A9");
  //range.setBackgroundColor("red");
}




function getKey(year,level){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var keySheetName = SpreadsheetApp.getActiveSpreadsheet().getSheets()[1].getName();
  var sheet = ss.setActiveSheet(ss.getSheetByName(keySheetName).activate());
  
  var firstkeyRow = getFirstKeyRow(year,level,sheet)
  var key = sheet.getSheetValues(firstkeyRow, 3, 1, 30)
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
