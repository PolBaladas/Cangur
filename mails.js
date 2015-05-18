function sendMails(){
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
}