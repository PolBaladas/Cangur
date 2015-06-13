
function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Form.html');
  template.action = ScriptApp.getService().getUrl();
  return template.evaluate();
}


function processForm(theForm) {
  // Fill in response template
  var template = HtmlService.createTemplateFromFile('result.html');
  var name = template.name = theForm.name;
  return template.evaluate().getContent();
}