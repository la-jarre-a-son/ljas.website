
import './styles/debug.css';

let objectName = "";
const $debug = document.getElementById('debug');

function setObjectName(name) {
  if (!PRODUCTION) {
    if (objectName !== name) {
      objectName = name;
      $debug.innerText = objectName;
    }
  }
}

export { setObjectName };