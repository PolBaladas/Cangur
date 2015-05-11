function notificaMeLa() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.setActiveSheet(ss.getSheetByName("RECULL").activate());
                                
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  
  var usuari = sheet.getRange(lastRow, 2).getValue();
  var year = sheet.getRange(lastRow, 3).getValue();
  var level = sheet.getRange(lastRow, 4).getValue();
  var prof = sheet.getRange(lastRow, lastColumn-1).getValue();
  var firstCellLlista = sheet.getRange(lastRow, 5);

  Logger.log("Usuari: "+usuari + "\nAny: " + year + "\nNivell: " + level);
  
  var llistaResults = getKey(year,level);
  var llistaStudent = new Array();
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
  
  for (var m = 0; m<30;m++){
    var llistaCells = firstCellLlista.offset(0,m).getValue();
    llistaStudent.push(llistaCells);
  }
  
  Logger.log(llistaStudent);
  
  for (var n=0;n<llistaStudent.length;n++){
    var num = n+1;
    
    if (llistaStudent[n]!=""){
      var arrayAns = llistaResults[n].split(" ");
      Logger.log(arrayAns);
      if(llistaStudent[n]==arrayAns[0] || llistaStudent[n]==arrayAns[1]){  
        
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
        resultFinal = "P"+num+": "+llistaStudent[n]+" (OK)";
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
        resultFinal = "** P"+num+": "+llistaStudent[n]+" ("+ llistaResults[n]+")";
        llistaFinal.push(resultFinal);
        llistaBad.push("P"+num);
      }
    }

    else{
      blank = blank+1;
      notaFinal = notaFinal;
      resultFinal = "** P"+num+": "+llistaStudent[n]+" ("+ llistaResults[n]+")";
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
                    "\nAlumne/a: " + usuari + "\n\nAny de la prova: " + year + "\nNivell: " + level +
                    "\nNota final: " + notaFinal + parcials + "\n\nLlista_OK: \n"
                    + llistaOk + "\n\nLlista_Bad: \n" + llistaBad + 
                    "\n\nLlista_Blanks: \n"+ llistaBlank + "\n\nResultats: \n\n"+llistaFinal;
  
  var txtProf = "Hola " + prof + ",\n\nT'acaba d'arribar una nova entrada de la prova cangur de l'usuari "
                    +usuari+ ".\n\nAquesta és la llista dels seus resultats: \n" +
                    "\nAlumne/a: " + usuari + "\nAny de la prova: " + year + "\nNivell: " + level +
                    "\nNota final: " + notaFinal + parcials + "\n\nLlista_OK: \n"
                    + llistaOk + "\n\nLlista_Bad: \n" + llistaBad + 
                    "\n\nLlista_Blanks: \n"+ llistaBlank + "\n\nResultats: \n\n"+llistaFinal;
  
  var parcialsDoc = "\n\nRespostes correctes \(parcials\): \nPreguntes 1-10:\t" + llistaOk1.length +
            "\nPreguntes 11-20:\t" + llistaOk2.length + "\nPreguntes 21-30:\t" + llistaOk3.length;
  
  var txtDocProf = "\nAlumne/a: " + usuari + "\nAny: " + year + "\nNivell: " + level +
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
  
  var firstKeyCellName = getKeyCell(year,level, sheet);
  var firstKeyCell = sheet.getRange(firstKeyCellName);
  
  var key = new Array();
  for (var k = 0; k<ss.getLastColumn();k++){
    var keyCells = firstKeyCell.offset(0,k).getValue();
    key.push(keyCells);
  }
  
  Logger.log("\n"+'key :'+key+"\n");
  
  return key;
}

function getKeyCell(year, level, sheet){
  yearRow = getYearRow(year,sheet);
  lvlRow = getLevelRow(level, yearCell, sheet);
  
  firstKeyCell = "C"+lvlRow;
  
  return firstKeyCell;
}

function getYearRow(year, sheet){
  rowNum = 2
  foundYear = sheet.getRange("A2").getValue;
  
  var i = 0;
  while(foundYear!=year){
    foundYear = sheet.getRange("A"+rowNum.toString()).getValue();
    rowNum+=1
  }
  
  Logger.log("Test Year : "+foundYear)
  return rowNum;
}

function getLevelRow(level, yearRow, sheet){
  lvlRow = yearRow;
  foundLvl = sheet.getRange("B"+lvlRow).getValue();
  
  var j = 0;
  while(foundLvl!=level){
    foundLvl = sheet.getRange("B"+lvlRow).getValue();
    lvlRow+=1;
  }
  
  return lvlRow;
}

function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Send data",
    functionName : "notificaMeLa"
  }];
  sheet.addMenu("NOTIFICANGUR", entries);
};
