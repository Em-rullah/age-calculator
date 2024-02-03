const form = document.querySelector('.age-form');
const inputAll = form.querySelectorAll('input');
const inputDay = document.querySelector('.day-input');
const inputMonth =document.querySelector('.month-input');
const inputYear =document.querySelector('.year-input');
const formBtn = document.querySelector('.submit-btn');
const yearInputText = document.querySelector('.input-1-value');
const monthInputText=document.querySelector('.input-2-value');
const dayInputText=document.querySelector('.input-3-value');


const daysInMonth = function(month, year){
  if(year === null) return;
  return new Date(year,month,0).getDate();
}

const defaultV = function(){
  inputAll.forEach( v => {
    v.addEventListener('focus', function(){
      v.closest('li').firstElementChild.classList.remove('error');
      v.classList.remove('error-border');
      if(v.closest('li')?.lastElementChild.classList.contains('error-msg')) 
      v.closest('li').lastElementChild.remove();
    })
  });
}

const error = function(target,message){
  if(target.closest('li')?.lastElementChild.classList.contains('error-msg')) return;
  target.closest('li').firstElementChild.classList.add('error')
  target.classList.add('error-border')
  if(message === 'empty'){
    target.closest('li input').insertAdjacentHTML('afterend', `
    <p class="error-msg">This field is required!</p>`);
    return
  }
  if(message === 'invalidYear'){
    target.closest('li input').insertAdjacentHTML('afterend', `
    <p class="error-msg">Must be in the past!</p>`);
    return
  }
  if(message === 'invalid')
  {
    target.closest('li input').insertAdjacentHTML('afterend', `
    <p class="error-msg">Must be valid!</p>`);
    return
  }
}


const formHandle = function(){
  // RESULT VALUES
  let resultYear;
  let resultDay;
  let resultMonth;

  form.addEventListener('submit',function(e){
    e.preventDefault();
    // REMOVE FOCUS ON INPUTS
    inputAll.forEach(v=> v.blur())

    // GET CURRENT DATE
    const [curDate,curMonth,curYear] = [...new Date().toLocaleDateString().split('.').map(v=> parseInt(v))];

    // GET INPUT DATA
    const data = new FormData(this);
    const dataArr = [...data.entries()];

    // THESE ARE FOR RESULT AND DAY VALUE
    let count = 0;
    const dayV = parseInt(dataArr[0][1])
    const monthV = parseInt(dataArr[1][1]);
    const yearV = parseInt(dataArr[2][1]) || null;
    const computeMonthNum = parseInt(daysInMonth(monthV,yearV));


    // HANDLE ERRORS
    dataArr.forEach(v=>{
      const curEl = document.querySelector(`#${v[0]}`);
      //EMPTY INVALID
      if(v[1] ===""){
        error(curEl,'empty');
        count++;
        return;
      }
      // YEAR INVALID
      if(v[0] === 'year') {
          if(curYear <+v[1]){
          error(curEl,'invalidYear');
          count++;
          return;}

          if(+v[1]<1){
            error(curEl,'invalid');
          count++;
          return;
          }     
      }
      // MONTH INVALID
      if(v[0] === 'month' && (12 < +v[1] || +v[1] < 1))
      {
        error(curEl,'invalid');
        count++;
        return;
      } 
      // DAY INVALID
      if(v[0] === 'day' && (+v[1] > computeMonthNum || 31< +v[1] || +v[1] < 1)) {
        console.log(v[0]);
        error(curEl,'invalid');
        count++;
      return;
      }
    })

    // GET COUNT
    if(count !== 0) return;

    const getResult = function(){
      resultYear = curYear-yearV;
      resultDay = curDate - dayV;
      resultMonth =  curMonth - monthV;
      if(resultDay< 0){
        resultMonth--;
      resultDay += computeMonthNum;
      }
      if(resultMonth<0){
        resultYear--;
        resultMonth += 12;
      }
      dayInputText.textContent = resultDay;
      monthInputText.textContent = resultMonth;
      yearInputText.textContent = resultYear;
      
    }

  getResult();
  })
}

formHandle();
defaultV();