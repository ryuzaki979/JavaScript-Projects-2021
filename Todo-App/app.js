// switching selectors
const hamburger= document.getElementById('hamburger-button');
const closeButton = document.getElementById('close-button')
const menuScreen = document.getElementById('menu-screen');
const listScreen = document.getElementById('list-screen');
//category selectors for menu
const category = document.getElementById('category');
const categorySelect = document.getElementById('category-select');
const categorySelectItems = document.querySelectorAll('.category-select-items');
//category selectors for list screen
const listCategoryItems = document.querySelectorAll('.category-item');
//analytics
const analyticsButton = document.getElementById('analytics'); 
//adding items to ul
const taskListElement = document.getElementById('task-list-element');
const input = document.getElementById('input');
const form = document.getElementById('form');
 
//variables to help this project 

//
hamburger.addEventListener('click', () =>{
    menuScreen.classList.add('visible');
    listScreen.classList.add('hidden');
})
//
closeButton.addEventListener('click', () =>{
    menuScreen.classList.remove('visible');
    listScreen.classList.remove('hidden');
});
//
category.addEventListener('click', () => {
    categorySelect.classList.toggle('show');
})
//
// categorySelectItems.forEach((singleCategoryItem) => {
//     singleCategoryItem.addEventListener('click', (e) => {
//         categorySelectItems.forEach((singleCategoryItem) => {
//             if (singleCategoryItem.classList.contains('selected')){
//                 singleCategoryItem.classList.remove('selected');
//             }
//         })
//         singleCategoryItem.classList.add('selected');

//         updateCategory(singleCategoryItem);
//     })
// })
//category-selects
addSelectClass(listCategoryItems);
addSelectClass(categorySelectItems);
function addSelectClass(array){
    array.forEach(function(arrayItem){
        arrayItem.addEventListener('click', function(){
            
            array.forEach((arrayItem) => {
                if (arrayItem.classList.contains('selected')){
                    arrayItem.classList.remove('selected');
                }
            })
            arrayItem.classList.add('selected');
            updateCategory(arrayItem);
            upgradeUI();
        })
    })
}

function updateCategory(item){
    const targetItem= item.textContent.toLowerCase();
    listCategoryItems.forEach((singleCategoryItem) => {
        if (!singleCategoryItem.classList.contains('selected')){
            singleCategoryItem.classList.remove('selected');
        }
    })
    if( listCategoryItems[0].id == targetItem){
        listCategoryItems[0].classList.add('selected');
        listCategoryItems[1].classList.remove('selected');
    }
    else if( listCategoryItems[1].id == targetItem){
        listCategoryItems[1].classList.add('selected');
        listCategoryItems[0].classList.remove('selected');
    }
}

//showing analytics

analyticsButton.addEventListener('click', () => {
    const analyticShowcase =document.querySelector('.analytics-showcase');
    analyticShowcase.classList.toggle('visible');
})


//adding list to ul
let entries= [] ;
form.addEventListener('submit', (e) => {
    e.preventDefault();
    id= new Date().getTime().toString();
    const value = input.value;
    let category = checkCategory();
    let check = checkCheck();
    createItems(value,id,category,check= false);
    upgradeUI();
    saveToLocalStorage(value,id,category,check);
})
function checkCheck(){
    let check;
    entries.forEach(entry=>{
        check= (entry.dataset.category);
    })
    return check;
}

//check category function
function checkCategory(){
let checked ;
       listCategoryItems.forEach(function(a){
        if(a.classList.contains('selected')){
            checked = a.id;
        }
     })
     return checked;
}

function upgradeUI(){
     let selected = document.querySelector('.selected').id;
     
     entries.forEach( function(entry){
        if(entry.dataset.category!==selected){
            entry.classList.add('hide');
            
            
        }
        else if(entry.dataset.category==selected){
            entry.classList.remove('hide');
        }
    })
    checkCount(entries);
    
    
}

let countObj ;

function checkCount(){
    let businessCount = 0;
    let personalCount = 0;
    entries.forEach(entry => {
        if(entry.dataset.category == 'business'){
            businessCount++;
        }
        else if(entry.dataset.category == 'personal'){
            personalCount++;
        }
        // else{
        //     businessCount= 0;
        //     personalCount= 0;
        // }
        countObj = [
            businessCount,
            personalCount]
        
    })
    // console.log(`businessCount : ${businessCount} || personalCount: ${personalCount}`);
    return updateCount(businessCount,personalCount); 
}


//function to update task list count
function updateCount(bCount,pCount) {
    const bTaskCount = document.getElementById('business-task-count');
    bTaskCount.innerText = bCount;
    const pTaskCount = document.getElementById('personal-task-count');
    pTaskCount.innerText= pCount;
}

function checkList (list){
    
    list.addEventListener('click', () => {
        
        
        if(list.dataset.checked === 'false'){
            list.dataset.checked = true;
            list.classList.add('checked');
        }
        else if(list.dataset.checked === 'true'){
            list.dataset.checked = false;
            list.classList.remove('checked');
        }
        updateLocalStorageCheck(list.dataset.id,list.dataset.checked);
        abc();
})
}
function updateLocalStorageCheck(id,check){
    let update =  localStorageItems()
    update.forEach( function(item) {
        if(item.id == id){
            item.check=check;
        }
    });
   localStorage.setItem('list',JSON.stringify(update));
}

function abc(){
    let checkedBusinessListCount = 0;
    let checkedPersonalListCount = 0;
    
    entries.forEach(entry => {
        if(entry.dataset.checked === 'true' && entry.dataset.category === 'business'){
            checkedBusinessListCount++;
        }
        
        if(entry.dataset.checked === 'true' && entry.dataset.category === 'personal'){
            checkedPersonalListCount++;
        }


        
    })
    return updateChecked(checkedBusinessListCount,checkedPersonalListCount);
}

function updateChecked(checkedBLCount,checkPLCount){
    let [bCount,pCount]= countObj;
    let pWidth= (checkPLCount/pCount)*100;
    let bWidth= (checkedBLCount/bCount)*100;
    const personalWidth= document.getElementById('personalWidth');
    const businessWidth = document.getElementById('businessWidth');
    personalWidth.style.width= `${pWidth}%`;
    businessWidth.style.width= `${bWidth}%`;
    showConsistency(bCount,pCount,checkedBLCount,checkPLCount);
}

function showConsistency(bCount,pCount,checkedBLCount,checkPLCount){
    const analyticsLine = document.getElementById('analytics-line');
    const consistancyComment = document.getElementById('consistancy-comment');
   
   if ((checkedBLCount+checkPLCount)/(bCount+pCount) >.75){

    analyticsLine.classList.remove('bad','normal');
    analyticsLine.classList.add('good');
    consistancyComment.textContent = 'Good';
   }
   else if ((checkedBLCount+checkPLCount)/(bCount+pCount) <.5){
    analyticsLine.classList.remove('good','normal');
    analyticsLine.classList.add('bad');
    consistancyComment.textContent = 'bad';
   }
   else if(entries.length===0){
    analyticsLine.classList.remove('bad','good');
    analyticsLine.classList.add('normal');
    consistancyComment.textContent = 'Not Rated';
   }
}

// function write(good){
    
// }



function deleteList (list,id){
    const deleteButton = list.querySelector('#trash-button');
    deleteButton.addEventListener('click', () => {
        list.remove();
        // console.log(id);
        removeFromLocalStorage(id);
        removeFromEntries(id);
    })
}

function removeFromEntries(id){
   
    entries = entries.filter( (entry,index) => {
        return (entry.dataset.id !==id);
    })
    checkCount(entries);
}




function saveToLocalStorage(value,id,category,check){
    
    let listItem = {
        value,
        id,
        category,
        check 
    }
    let items = localStorageItems();
    items.push(listItem);
    localStorage.setItem('list',JSON.stringify(items));
}

function removeFromLocalStorage(id){

    let itemsToRemove =  localStorageItems()

    itemsToRemove = itemsToRemove.filter( function(itemToRemove) {
        
            if(itemToRemove.id !== id){
                return itemToRemove;
            }
        
    });
   
    localStorage.setItem('list',JSON.stringify(itemsToRemove));
}


function localStorageItems(){

    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
    
}

//run local storage
window.addEventListener('DOMContentLoaded', runLocalStorage);


function runLocalStorage(){
  localStorageItems().forEach((a) => {
        createItems(a.value,a.id,a.category,a.check);
    });
    upgradeUI();

    abc();
}



function createItems(value,id,category,check){
    const taskElement = document.createElement('li');
    const idAttr = document.createAttribute('data-id');
    idAttr.value = id;
    taskElement.setAttributeNode(idAttr);
    const categoryAttr = document.createAttribute('data-category');
    categoryAttr.value = category;
    taskElement.setAttributeNode(categoryAttr);
    const checkAttr = document.createAttribute('data-checked');
    checkAttr.value = check ;
    taskElement.setAttributeNode(checkAttr);
    taskElement.classList.add('task-list-item','show');
    // console.log(check);
    if(check === 'true'){
        
        taskElement.classList.add('checked');
    }
    else if(check !== 'true'){
        
        taskElement.classList.remove('checked');
    }
    
    taskElement.innerHTML =`
    <div class="circle" id="circle"></div>
    <i class="far fa-check-circle" id="check-circle"></i>
    <span class="task-title">${value}</span>
    <i class="fas fa-trash trash-button" id="trash-button"></i>
    `;

    entries.push(taskElement);
    
    // console.log(taskElement);
    taskListElement.appendChild(taskElement);
    input.value = '';
   
    checkList(taskElement);
    deleteList(taskElement,id);
}
    
// it's my beginning project for JavaScript. i will do my best to write next code more cleaner//




















