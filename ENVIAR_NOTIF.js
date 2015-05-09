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
  var nomFullKey = SpreadsheetApp.getActiveSpreadsheet().getSheets()[1].getName();
  var sheet = ss.setActiveSheet(ss.getSheetByName(nomFullKey).activate());
  var cell = sheet.activate().getRange("A2").activate();
  var cellLevel = sheet.activate().getRange("B2").activate();
  
  var anyNoTrobat = 0;
  var anyTrobat = "";
  
  var nivellNoTrobat = 0;
  var nivellTrobat = "";
  
  for (var i=0; i<sheet.getLastRow(); i++){
    var cellAny = cell.offset(i, 0);
    var any = cellAny.getValue();
    Logger.log(any);
    
    if (any==year){
      anyTrobat = any;
      Logger.log("Ja sé de quin any és l'examen: " + anyTrobat);
      Logger.log("Pleguem, doncs? :\)");
      var cellNivell = cellAny.offset(0, 1);
      break
    } 
    else{
      anyNoTrobat = anyNoTrobat+1;
    }
  }
    
  for (var j=0;j<4;j++){
    var cellNivells = cellNivell.offset(j,0);
    var nivell = cellNivells.getValue();    
    Logger.log(nivell);
      
    if(nivell==level){
      nivellTrobat = level;
      Logger.log("Ja sé de quin nivell és l'examen: " + nivellTrobat);
      Logger.log("Pleguem, doncs :\)");
      var cellFirstKey = cellNivells.offset(0, 1);
      Logger.log(cellFirstKey.getA1Notation());
      break
    }
    else{nivellNoTrobat = nivellNoTrobat+1;}      
  }
  
  var firstKey = cellFirstKey.getValue();
  var arrayKey = new Array();
  for (var k = 0; k<ss.getLastColumn();k++){
    var keyCells = cellFirstKey.offset(0,k).getValue();
    arrayKey.push(keyCells);
  }
  
  Logger.log("\n"+arrayKey+"\n");
  Logger.log("\nResum: \nAny: " + anyTrobat + "; Ens ha costat " + anyNoTrobat + " intents. " +
            "\nNivell: " + nivellTrobat + "; Ens ha costat " + nivellNoTrobat + " intents. " +
            "\nI tenim la primera lletra de la key!! : " + firstKey);
  
  return arrayKey;
}


function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Send data",
    functionName : "notificaMeLa"
  }];
  sheet.addMenu("NOTIFICANGUR", entries);
};
