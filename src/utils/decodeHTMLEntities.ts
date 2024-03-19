export function decodeHTMLEntities(text: string) {
  var element = document.createElement("div");
  element.innerHTML = text;
  return element.innerText || element.textContent;
}
