var defaultDocID = "1Ttl2nqrYvi6SW5IhZ_adg2fEm1YLyvBJ04_VcURNT04";
var EsDocID = "1m39CSPIgaQCyUVaieNO_gw22482rSf6KWkjHwJjWDOI";
var LcDocID = "10MBQ7QCHRNhH5hcjAKzr6P-tRVwgBUPvCKCCPRpAp0o";

function omplirFull(text,prof){
  switch (prof){
      
    case "lluis.cros":
      Logger.log("Volen en Luis!!!!");
      updateDoc(LcDocID, prof, text);
      break;
      
    case "jordi.esgleas" :
      Logger.log("Volen en Jordi!!!!");
      updateDoc(EsDocID, prof, text);
      break;
      
    default :
      Logger.log("No volen a ningú dels anteriors :(")
      updateDoc(defaultDocID, prof, text)
  }
}

function updateDoc(docID, prof,text){
  var thisDoc = DocumentApp.openById(docID);
  var head = thisDoc.getHeader();
  Logger.log("\[" + head)
  var foot = thisDoc.getFooter();
  Logger.log("\["+foot);
  
  year = getCurrentYear();
  
  if (head==null){
    thisDoc.addHeader();
    thisDoc.getHeader().insertParagraph(0,"Resultats de les proves Cangur "+year+" \n Professor(a): " + prof);
  }  
  
  if (foot == null){
    thisDoc.addFooter();
    thisDoc.getFooter().insertParagraph(0,"Cangur "+ year +" \t Escola Pia Sarrià-Calassanç");
  }
  
  thisDoc.appendHorizontalRule();                     
  thisDoc.appendParagraph(text); 
  
}
  
  
function getCurrentYear(){
  var currentTime = new Date()
  return currentTime.getFullYear();
}