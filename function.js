let checkboxIdCounter = 0; 
let checkboxArray = [];


const folderSelect = document.getElementById('folder-select');
const searchBox = document.getElementById('search-box');
const itemSelect = document.getElementById('item-select');



folderSelect.addEventListener('change', function() {
    const selectedFolder = this.value;
    console.log(selectedFolder)
    itemSelect.disabled=true;
    if (selectedFolder === "Desktop") {
        const desk=document.querySelector(".Desktop");
        console.log(desk)
        const desktopItems = desk.querySelectorAll('.child-list .item');
        loaditems(desktopItems)
    
    }
    else{
        const doc=document.querySelector(".Documents");
        console.log(doc)
        const docItems=doc.querySelectorAll(".child-list .item");
        console.log(docItems)
        loaditems(docItems);
    }
});

function loaditems(items){
    itemSelect.disabled=false;
    itemSelect.innerHTML = '<option value="">Select item</option>'
    items.forEach(item => {
        const option = document.createElement('option')
        option.value = item.textContent;
        option.textContent = item.textContent;
        itemSelect.appendChild(option)
    });
}

itemSelect.addEventListener("change", function(){
    const itemSelected=this.value;
    const itemSelectedli=document.querySelector(`.${itemSelected}`);

    const selectedul=itemSelectedli.parentElement;
    console.log(selectedul)
    selectedul.classList.add("child-show");


    const selectedli=selectedul.parentElement;
    console.log(selectedli)
    const caretli=selectedli.querySelector(".clicky");
    console.log(caretli)
    caretli.classList.add("rotatedown");

    parentul=selectedul.parentElement.parentElement;
    console.log(parentul)
    parentul.classList.add("child-show");

    const parentli=parentul.parentElement;
    const pcaretli=parentli.querySelector(".clicky");
    pcaretli.classList.add("rotatedown");

    selectedcreateChipsForChildItems([itemSelectedli]);
});


 function  selectedcreateChipsForChildItems(childItems){
    childItems.forEach(child => {
        const chipContent = child.textContent.trim();
        const existingChip = chipsContainer.querySelector(`[data-content="${chipContent}"]`);

        if (!existingChip) {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.textContent = chipContent;
            chip.setAttribute('data-content', chipContent);
           
            const checkbox = child.querySelector('input[type=checkbox]');
            const uniqueId = `checkbox-${checkboxIdCounter++}`; 
            checkbox.id = uniqueId; 

            
            checkboxArray.push({ id: uniqueId, checkbox: checkbox });
            

            updateChipsCount(1); 
            const closeBtn = document.createElement('span');
            closeBtn.className = 'close-btn';
            closeBtn.textContent = '✖';

            closeBtn.addEventListener('click', function(Event) {
                const checkboxIndex = checkboxArray.findIndex(item => item.id === uniqueId);
                if (checkboxIndex !== -1) {
                    checkboxArray[checkboxIndex].checkbox.checked = false; // Uncheck the checkbox
                }
                uncheckParentAndGrandparents(child);    
                chipsContainer.removeChild(chip);
                updateChipsCount(0);
                Event.stopPropagation();
            });

            chip.appendChild(closeBtn);
            chipsContainer.appendChild(chip);
            checkbox.checked=true;

            const parentli=checkbox.parentElement.parentElement.parentElement;
            console.log(parentli);  
            checkparent(parentli);

        }
    });
}



    const childShow = document.querySelectorAll(".clicky");
    var countChips=document.getElementById("count");
  
    childShow.forEach(item => {
        item.addEventListener("click", function (event) {
            event.stopPropagation();
            const parentItem = this.closest('li.select, li');

            const childList = parentItem.querySelector('.child-list');
        
            childList.classList.toggle("child-show");
            
            const caret = this;
            caret.classList.toggle("rotatedown");
        })
    })

const chipsContainer = document.getElementById('chips-container');

function toggleChildCheckboxes(parentCheckbox) {
    console.log(parentCheckbox.checked);
    const parentItemli = parentCheckbox.closest('li.select');
    console.log(parentItemli);  //li will be get selected 
    const childCheckboxes = parentItemli.querySelectorAll('.child-list .item input[type=checkbox]');
    console.log(childCheckboxes);  // checkboxitems in the li get selected 

    // to check the checkboxes of mid li

    showchild(parentItemli);

    

    var midparentli;
    const midparentul=parentItemli.querySelectorAll(".child-list");
    console.log(midparentul);

    midparentul.forEach(midul =>{
         midparentli=midul.closest(".select");
         console.log(midparentli)
       
        midparentcheckbox=midparentli.querySelector(".child-checkbox");
        
        midparentcheckbox.checked=parentCheckbox.checked;
        
    })
    grandparentcheck(midparentli);
    
    // to create the chip for selected checkboxex
    childCheckboxes.forEach(childCheckbox => {
        childCheckbox.checked = parentCheckbox.checked;
        //console.log(childCheckbox.closest('.item'));  // ig select select checkbox li
        if (parentCheckbox.checked) {
            createChipsForChildItems([childCheckbox.closest('.item')]);
        } else {
            removeChipsforChildItems([childCheckbox.closest('.item')]);
        }
    });
}

function showchild(parentItemli){
    const parentuls=parentItemli.querySelectorAll(".child-list");

    parentuls.forEach(parentul =>{
        parentul.classList.toggle("child-show");
    })
    
}
//parent checkboxes that is li is to be clicky
const parentCheckboxes = document.querySelectorAll('.select > .child-checkbox');    
parentCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function(event) {
        event.stopPropagation();
        toggleChildCheckboxes(this);
  
    });

});


// Event listener for child checkboxes
const childCheckboxes = document.querySelectorAll('.child-list .item input[type=checkbox]');
childCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function(event) {
        event.stopPropagation();   
        const parentItem = this.closest('li.select'); // li select that is image,video
        checkparent(parentItem);
        
        console.log(this.closest(".item")); // to know the li is correctly checked or not from the checkbox
        
        if (this.checked) {
            createChipsForChildItems([this.closest('.item')]);
        } else {
            removeChipsforChildItems([this.closest('.item')]);
        }
        
    });
});
function checkparent(parentItem){
    const siblingCheckboxes = parentItem.querySelectorAll('.child-list .item input[type=checkbox]');
        let allChecked = true; 
        for (let i = 0; i < siblingCheckboxes.length; i++) {
            const checkbox = siblingCheckboxes[i]; 
            if (!checkbox.checked) {
                allChecked = false;
                break; 
            }
        }
          
        const parentCheckbox = parentItem.querySelector('.child-checkbox');
        parentCheckbox.checked = allChecked;
        
        grandparentcheck(parentItem);
}

 function grandparentcheck(childitem){
    const grandparentli=childitem.parentElement.parentElement;
    const grandparentcheckbox=grandparentli.querySelector(".child-checkbox");
   
    const midparentli=childitem.closest("ul").querySelectorAll(".select");
    console.log(midparentli);
    let allChecked=true;
    midparentli.forEach(midli=>{
        const midcheck=midli.querySelector(".child-checkbox");
    
        if(!midcheck.checked) {
            allChecked=false;
        }

    })
    if(allChecked) 
    {
     grandparentcheckbox.checked=true;   
    }
    else{
        grandparentcheckbox.checked=false;
    }
    
 }

function createChipsForChildItems(childItems) {
   
    childItems.forEach(child => {
        const chipContent = child.textContent.trim();
        const existingChip = chipsContainer.querySelector(`[data-content="${chipContent}"]`);

        if (!existingChip) {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.textContent = chipContent;
            chip.setAttribute('data-content', chipContent);
           
            const checkbox = child.querySelector('input[type=checkbox]');
            const uniqueId = `checkbox-${checkboxIdCounter++}`; 
            checkbox.id = uniqueId; 

            
            checkboxArray.push({ id: uniqueId, checkbox: checkbox });
            

            updateChipsCount(1); 
            const closeBtn = document.createElement('span');
            closeBtn.className = 'close-btn';
            closeBtn.textContent = '✖';

            closeBtn.addEventListener('click', function(Event) {
                const checkboxIndex = checkboxArray.findIndex(item => item.id === uniqueId);
                if (checkboxIndex !== -1) {
                    checkboxArray[checkboxIndex].checkbox.checked = false; // Uncheck the checkbox
                }
                uncheckParentAndGrandparents(child);    
                chipsContainer.removeChild(chip);
                updateChipsCount(0);
                Event.stopPropagation();
            });

            chip.appendChild(closeBtn);
            chipsContainer.appendChild(chip);
            

        }
    });
}

function removeChipsforChildItems(childItems){
    
    childItems.forEach(child => {
        const chipContent = child.textContent.trim();
        const existingChip = chipsContainer.querySelector(`[data-content="${chipContent}"]`);
        
        if (existingChip) {
            const uniqueId = existingChip.getAttribute('data-checkbox-id');
            const checkboxIndex = checkboxArray.findIndex(item => item.id === uniqueId);
            if (checkboxIndex !== -1) {
                checkboxArray[checkboxIndex].checkbox.checked = false; // Uncheck the checkbox
            }
            uncheckParentAndGrandparents(child);
            chipsContainer.removeChild(existingChip);
            updateChipsCount(0);
        }
    });
}
function uncheckParentAndGrandparents(child) {
    const parentItem = child.closest('li.select');

    
    // Check if any of the sibling checkboxes are still checked, if not, uncheck the parent
    const siblingCheckboxes = parentItem.querySelectorAll('.child-list .item input[type=checkbox]');
   
    let parentchecked = true;

    siblingCheckboxes.forEach(siblingCheckbox => {
        if (!siblingCheckbox.checked) {
            parentchecked = false;
        }
    });

    if (!parentchecked) {
        const parentCheckbox = parentItem.querySelector('.child-checkbox');
        if (parentCheckbox) {
            parentCheckbox.checked = false; // Uncheck the parent checkbox
            uncheckGrandparent(parentItem); // Check if we need to uncheck the grandparent too
        }
    }
}

// Uncheck the grandparent checkbox if necessary
function uncheckGrandparent(parentItem) {
    const grandparentItemmid = parentItem.closest('li.select');
    const grandparentItem = grandparentItemmid.parentElement.parentElement;
 
    if (!grandparentItem) return;

    const grandparentCheckbox = grandparentItem.querySelector('.child-checkbox');
    const parentofitems = grandparentItem.querySelectorAll('.child-list .select');
    
    
    let grandparentchecked = true;

    parentofitems.forEach(parentofitem => {
        const parentofitemcheckbox=parentItem.querySelector(".child-checkbox");
        if (!parentofitemcheckbox.checked) {
            grandparentchecked = false;
        }
    });



    if (!grandparentchecked) {
        grandparentCheckbox.checked = false; // Uncheck the grandparent checkbox
    }
}

const items = document.querySelectorAll('.item');
    

    items.forEach(item => {
        item.addEventListener('click', function(event) {
            event.stopPropagation(); 

        const chipContent = this.textContent.trim();
        const existingChip = chipsContainer.querySelector(`[data-content="${chipContent}"]`);
        

            
            if(!existingChip){
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.textContent = this.textContent;
            chip.setAttribute('data-content', chipContent);
            updateChipsCount(1);

          
            const closeBtn = document.createElement('span');
            closeBtn.className = 'close-btn';

            closeBtn.textContent = '✖'; 

           
            closeBtn.addEventListener('click', function() {
                chipsContainer.removeChild(chip);
                updateChipsCount(0);
                event.stopPropagation(); 
            });

            chip.appendChild(closeBtn);
            chipsContainer.appendChild(chip);
        }
        });
    });
    function updateChipsCount(n){
        let currentCount = parseInt(countChips.textContent) || 0;
        if(n){
            countChips.innerText=currentCount++;
            
        }
        else{
            countChips.innerText=currentCount--;

        }
        countChips.innerText = currentCount;
       
    }