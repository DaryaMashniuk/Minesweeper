const fieldLength = document.getElementById('fieldLength');
const boardElement = document.getElementById('gameBoard');
const countOutput=document.querySelector('h2');
const numberOfMines=document.getElementById('numberOfMines');
const form=document.querySelector('form');





let mines
let size;
let gameOver=false;
const colors = {
    1: 'blue',
    2:'green',
    3:'red' ,
    4:'purple' ,
    5:'rgb(221, 217, 0)' ,
    6: 'teal' ,
    7: 'gray' ,
    8:'black'
}  
form.addEventListener('submit',(event)=>{
  event.preventDefault();
  size = parseInt(fieldLength.value);
 if (!parseInt(numberOfMines.value)) {
  mines=Math.floor(size*size/4)
} else {
  mines=parseInt(numberOfMines.value)
}
 
  if (isNaN(size) || size <= 3 || size>30 ) {
    alert('Пожалуйста, введите корректный размер поля.');
    return;
  } 
  if (mines>size*size-1) {
    alert('Количество мин  не может быть равно размеру поля');
    return;
  }

  letsPlay();
})


    
let board=[];

const generateBombs=()=>{ 

    const bombAmount=mines;
  const bombsArray=Array(bombAmount).fill('bomb');
    const emptyArray=Array(size*size-bombAmount).fill('valid');
    const field=emptyArray.concat(bombsArray);
    const gameField=field.sort(()=>Math.random()-0.5);
    return gameField
}
// Создание игровой доски
const createBoard=() =>{
  boardElement.style.setProperty('--size', size);
  boardElement.innerHTML = '';
  let bombs=  generateBombs()
  board= new Array(size*size).fill('')
  document.querySelector('form').style.display="none"
  boardElement.style.display="flex"
  board.forEach(( _ , index)=>{
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.classList.add(bombs[index])    
    cell.classList.add(index)
    cell.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      putFlag(index)
      cell.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        board[index].textContent='';
    });
  });
  cell.addEventListener('click', () => {if (!gameOver){makeMove(index)}});
    
    board[index]=cell;
    boardElement.appendChild(cell);
  })
  fillNumberValues();
  countOutput.textContent=``;
}

const restart=()=>{
  const btn=document.createElement('button');
  btn.className = 'reset';
  btn.textContent=`Переиграть`
  btn.addEventListener('click',()=>{

    document.querySelector('form').style.display="block"    
    btn.remove();
    boardElement.style.display="none"
    countOutput.textContent=``;
    })
    const wrapper = document.querySelector('.wrapper');
    wrapper.appendChild(btn);

}
const bomb = "💣";
const flag="🚩";
const fillNumberValues = () => {
    board.forEach((el, index) => {
        if (el.classList.contains('bomb')) {
            board[index].dataset.value = bomb;
        } else {
            let counter = 0;
            const rowIndex = Math.floor(index / size);
            const colIndex = index % size;

            // Check adjacent cells
            for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
                for (let colOffset = -1; colOffset <= 1; colOffset++) {
                    const adjRowIndex = rowIndex + rowOffset;
                    const adjColIndex = colIndex + colOffset;

                    // Skip if out of bounds
                    if (adjRowIndex < 0 || adjRowIndex >= size || adjColIndex < 0 || adjColIndex >= size) {
                        continue;
                    }

                    const adjIndex = adjRowIndex * size + adjColIndex;
                    if (board[adjIndex].classList.contains('bomb')) {
                        counter++;
                    }
                }
            }

            board[index].dataset.value = counter || '';
        }
    });
};
const makeMove=(index)=>{
    
    
        board[index].textContent=board[index].dataset.value;
        
       board[index].style.backgroundColor = 'white';
       
       if (board[index].classList.contains('bomb')){
          gameOver=true
          
            board.forEach((_,ind)=>{
              if (board[ind].classList.contains('bomb')) {
                board[ind].textContent=board[ind].dataset.value;
            }
            })
            gameOver=true;
          countOutput.textContent=`Вы проиграли`;
          
          return
        }
        if (board[index].dataset.value!==''){
          board[index].style.color = `${colors[board[index].dataset.value]}`
        }
        if (isWin()){
      countOutput.textContent=`Вы выиграли!!!!!!!`;
      return}
}

const isWin = () => {
  let allBombsFlagged = true;
  let allOtherCellsOpened = true;

  board.forEach((el) => {
    if (el.classList.contains('bomb') && el.textContent !== flag) {
      allBombsFlagged = false;
    }

    if (el.classList.contains('valid') && el.textContent!==el.dataset.value) {
      allOtherCellsOpened = false;
    }
  });
  gameOver=allBombsFlagged && allOtherCellsOpened;
  return gameOver
};



const putFlag=(index)=>{
  board[index].textContent=flag;
  if (isWin()){
    countOutput.textContent=`Вы выиграли!!!!!!!`;
    gameOver=true
    return}
}

const letsPlay=()=>{
    moves=0;
    gameOver=false;
    createBoard();
     restart()
  }