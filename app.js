'use strict';

const $ = (id) => document.getElementById(id);
const hexDigits = '0123456789ABCDEF';
const bitText = Array.from({ length: 16 }, (_, n) =>
  [8, 4, 2, 1].map(bit => (n & bit) ? '1' : '0').join(' ')
);

const controls = {
  loadMAR: $('loadMAR'),
  loadIR: $('loadIR'),
  loadACC: $('loadACC'),
  loadSRAM: $('loadSRAM'),
  operation: $('operation'),
  dataSource: $('dataSource'),
  nextStep: $('nextStep')
};

function selectedAddressSource() {
  return document.querySelector('input[name="addressSource"]:checked').value;
}

function updateDisplay() {
  const sourceIndex = Number(controls.dataSource.value);
  const operationIndex = Number(controls.operation.value);
  const nextStepIndex = Number(controls.nextStep.value);
  const addressIsPC = selectedAddressSource() === 'pc';

  // Four 4-bit microcode fields, matching the original C# bit assignments.
  const word0 = [0, 4, 8][sourceIndex] + (controls.loadSRAM.checked ? 2 : 0) + (controls.loadIR.checked ? 1 : 0);
  const word1 = (operationIndex === 0 ? 0 : (operationIndex - 1) * 2) + (controls.loadACC.checked ? 1 : 0);
  const word2 = (addressIsPC ? 2 : 0) + (controls.loadMAR.checked ? 1 : 0);
  const word3 = nextStepIndex;
  const words = [word3, word2, word1, word0];

  words.forEach((value, index) => {
    $(`bits${3 - index}`).textContent = bitText[value];
    $(`hex${3 - index}`).textContent = hexDigits[value];
  });

  const sourceName = controls.dataSource.options[sourceIndex].text;
  $('marSource').textContent = sourceName;
  $('irSource').textContent = sourceName;
  $('sramSource').textContent = sourceName;
}

// Changing the operation automatically enables/disables ACC loading without
// forcing the user's selected operation back to PASS (the original WinForms
// event handlers inadvertently did that).
controls.operation.addEventListener('change', () => {
  controls.loadACC.checked = Number(controls.operation.value) !== 0;
  updateDisplay();
});

// If ACC loading is turned off manually, select NOP. If turned on from NOP,
// choose PASS(Data Bus) as a useful default; otherwise preserve the operation.
controls.loadACC.addEventListener('change', () => {
  if (!controls.loadACC.checked) controls.operation.value = '0';
  else if (controls.operation.value === '0') controls.operation.value = '2';
  updateDisplay();
});

Object.values(controls).forEach(control => {
  if (control !== controls.operation && control !== controls.loadACC) {
    control.addEventListener('change', updateDisplay);
  }
});
document.querySelectorAll('input[name="addressSource"]').forEach(radio => radio.addEventListener('change', updateDisplay));

updateDisplay();
