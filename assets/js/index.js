const billList = document.querySelector('.table-bills')
const addBill = document.querySelector('.add-bill')
const dataDeVencimento = document.querySelector('#vencimento')
const bill = document.querySelector('#bill');
const billValue = document.querySelector('#valor');

isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n)

document.addEventListener('keypress', e =>{
  if(e.key === 'Enter'){
    startApp()
  }  
})

addBill.addEventListener('click', e => {
  e.preventDefault()
  startApp()
})

document.addEventListener('click', e =>{
  const el = e.target;

  if(el.classList.contains('pago')){
    const td = el.parentElement
    const tr = td.parentElement
    const tdPago = tr.querySelector('.td-pago')
    if(tr.classList.contains('done')){
      tr.classList.remove('done')
      tdPago.innerText = 'Pendente'
      createResultsTableElement()
      saveOnLocalStorage()

      return
    }
    tr.classList.add('done')
    if(tdPago.innerText === 'Pendente') tdPago.innerText = 'Pago'
    saveOnLocalStorage()
    createResultsTableElement()
  }

  if(el.classList.contains('delete')){

    const modal = document.querySelector('.modal')
    const btnClose = document.querySelector('.btn-close')
    const btnCancel = document.querySelector('.btn-cancel')
    const btnDeletar = document.querySelector('.deletar')
    
    modal.setAttribute('style', 'display:block;')
    
    btnClose.addEventListener('click', e => modal.setAttribute('style', 'display:none;'))
    btnCancel.addEventListener('click', e => modal.setAttribute('style', 'display:none;'))
    btnDeletar.addEventListener('click', e=>{
      const li = el.parentElement
      li.parentElement.remove()
      modal.setAttribute('style', 'display:none;')
      saveOnLocalStorage()
    })
  }
})

function startApp(){
  const valor = billValue.value.replace(',', '.')
  if(!dataDeVencimento.value)return
  if(!isNumber(valor) || bill.value === '') return alert()
  if(bill.value === '' || bill.value.lenght > 100) return alert()
  
  createBill(bill.value, valor, false, dataDeVencimento.value)
  bill.value = ''
  billValue.value = ''
  dataDeVencimento.value = ''
}

function saveOnLocalStorage(){
  const despesasTr= document.querySelectorAll('.trBill')
  const listaDeDespesas = []
  
  for(let despesa of despesasTr){
    const id = despesa.querySelector('.td-id').innerText
    const valor = despesa.querySelector('.td-valor').innerText
    const vencimento = despesa.querySelector('.td-vencimento').innerText
    const pago = despesa.querySelector('.td-pago').innerText
    const valorSemMoeda = valor.replace('R$ ', '')
    
    if(pago === 'Pendente') listaDeDespesas.push({id, valor:valorSemMoeda, vencimento:unfortmatData(vencimento), pago:false})
    if(pago === 'Pago') listaDeDespesas.push({id, valor:valorSemMoeda, vencimento:unfortmatData(vencimento), pago:true})    
  }

  const despesasJSON = JSON.stringify(listaDeDespesas)
  localStorage.setItem('bill', despesasJSON)
  createResultsTableElement()

}

// INCREMENTAÇÃO NA TABELA
function createBill(texto, valor, pago, data){
  const btnDelete = createDeleteButton();
  const btnPago = createPagoButton();
  const tr = createTrBillElement();
  const tdId = createTdIdElement();
  const tdValor = createTdValorElement();
  const tdPago = createTdPagoElement();
  const tdVencimento = createTdVencimentoElement();
  const tdButtons = createTdButtonsElement();
  
  tdId.innerText = texto
  tdValor.innerText = `R$ ${valor}`
  tdPago.innerText = 'Pendente'; 
  if(pago){
    tdPago.innerText = 'Pago';
    tr.classList.add('done')
  }
  // data = formatData(data)
  if(estaVencido(data)) tdVencimento.classList.add('vencido')
  tdVencimento.innerText = fortmatData(data);

  tdButtons.appendChild(btnPago)
  tdButtons.appendChild(btnDelete)
  
  tr.appendChild(tdId)
  tr.appendChild(tdValor)
  tr.appendChild(tdVencimento)
  tr.appendChild(tdPago)
  tr.appendChild(tdButtons)
  billList.appendChild(tr)

  saveOnLocalStorage()
  if(localStorage.getItem('bill')) createResultsTableElement()
}

fortmatData = (data) => {
  const dataV = data.split('-')
  return `${dataV[2]}/${dataV[1]}/${dataV[0]}`
}

unfortmatData = (data) => {
  const dataV = data.split('/')
  return `${dataV[2]}-${dataV[1]}-${dataV[0]}`
}

estaVencido = (data) =>{
  const dataDividida = data.split('-')
  const dataD = new Date(dataDividida[2], dataDividida[1], dataDividida[0])
  if(dataD < new Date) return true
  return false
}
// ELEMENTOS DAS TABELAS
createResultsTableElement = () => {
  const checkTable = document.querySelector('.results')
  if(checkTable) checkTable.remove()

  const container = document.querySelector('.container')

  const table = document.createElement('table')
  table.classList.add('results')
  
  const trTitles = createTrElement();
  const thTotal = createThElement();
  thTotal.innerText = 'Total'
  const thPago = createThElement();
  thPago.innerText = 'Total Pago'
  const thRestante = createThElement();
  thRestante.innerText = 'Pendente'
  
  const trResults = createTrElement();
  const tdTotal = createTdElement();
  const tdPago = createTdElement();
  const tdRestante = createTdElement();

  tdTotal.innerText = calcularTotalDeDespesas().toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
  tdPago.innerText = calcularTotalDeDespesasPagas().toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
  tdRestante.innerText = calcularTotalDeDespesasPendentes().toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

  trTitles.appendChild(thTotal)
  trTitles.appendChild(thPago)
  trTitles.appendChild(thRestante)

  trResults.appendChild(tdTotal)
  trResults.appendChild(tdPago)
  trResults.appendChild(tdRestante)

  table.appendChild(trTitles)
  table.appendChild(trResults)

  container.appendChild(table)
}

createThElement = () => document.createElement('th')

createTdElement = () => document.createElement('td')

createTrElement= () => document.createElement('tr')

createTdIdElement = e => {
  const td = createTdElement();
  td.classList.add('td-id');
  return td;
}

createTdVencimentoElement = e => {
  const td = createTdElement();
  td.classList.add('td-vencimento');
  return td;

}
createTdPagoElement = e => {
  const td = createTdElement();
  td.classList.add('td-pago');
  return td;
}
createTdValorElement = e => {
  const td = createTdElement();
  td.classList.add('td-valor');
  return td;
}

createTdButtonsElement = e => {
  const td = createTdElement();
  td.classList.add('td-buttons');
  return td;
}

createTrBillElement = e => {
  const tr = createTrElement();
  tr.classList.add('trBill');
  return tr;
}


function createPagoButton(){
  const button = document.createElement('button')
  button.classList.add('pago');
  return button
}

function createDeleteButton(){
  const button = document.createElement('button')
  button.classList.add('delete');
  button.setAttribute('type', 'button')
  button.setAttribute('data-bs-toggle', 'modal')
  button.setAttribute('data-bs-target', 'ModalBox')
  return button
}

function createLiElement(){
  return document.createElement('li');
}

// OPERAÇÕES DAS DESPESAS
calcularTotalDeDespesasPagas = () => {
  const pagos = document.querySelectorAll('.done .td-valor');
  let acumulador = [0]

  for (let pago of pagos) {
    const pagoSemMoeda = pago.innerText.replace('R$ ', '')
    acumulador.push(pagoSemMoeda)
  }
  
  return acumulador.reduce((ac, value) => Number(ac) + Number(value));
}

calcularTotalDeDespesasPendentes = () => {
  const total = calcularTotalDeDespesas()
  const pagos = calcularTotalDeDespesasPagas()

  return total - pagos
}

calcularTotalDeDespesas = () => {
  const billsJSON = localStorage.getItem('bill')
  const bills = JSON.parse(billsJSON);
  let acumulador = [0]

  for (let bill of bills) {
    acumulador.push(bill.valor)
  }
  
  return acumulador.reduce((ac, value) => Number(ac) + Number(value));
}

// REQUISIÇÃO NO LOCALSTORAGE
function getFromLocalStorage(){
  const billsJSON = localStorage.getItem('bill')
  const bills = JSON.parse(billsJSON);

  for (let bill of bills) {
    
    createBill(bill.id, bill.valor, bill.pago, bill.vencimento)
  }
}

createResultsTableElement()
getFromLocalStorage()