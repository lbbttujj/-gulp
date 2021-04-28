console.log('hello');
const hamburger = document.querySelector('.hamburger__list');
const menu__toggle = document.querySelector('#menu__toggle');
const menu = document.querySelectorAll('.hm');
console.log(menu__toggle);
for(let i of menu)
{
    i.addEventListener('click',()=>{      
        menu__toggle.checked=false;
    })
}