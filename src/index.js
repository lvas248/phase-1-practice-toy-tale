let addToy = false;
let toyContainer = document.querySelector('#toy-collection')

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    } 
  });
});

//challenge 1 - Fetch Andy's toys
   fetchToys() 
//challenge 2- Add new toy and post to DOM w/out refreshing
   document.querySelector('form').addEventListener('submit', (e)=>{
    e.preventDefault()  
    let toyName = e.target.querySelector('input').value
    let toyImage = e.target.querySelectorAll('input')[1].value
    postNewToy(toyName,toyImage) 
    e.target.reset()

   }
   )
//challeng 3 - Increase a Toy's likes
 toyContainer.addEventListener("click", (e)=>{
    if(e.target.className === "like-btn"){
      let id = e.target.id
      //console.log(id)
      let currentNumberOfLikes = getLikeNum(e.target.parentNode.querySelector('p').textContent)
      //console.log(currentNumberOfLikes)
      patchAndUpdate(id, currentNumberOfLikes, e)
    }
    })
 
 

//-------------------------------------------------------


function fetchToys(){
  //fetch toys from DB and create a card to add to DOM
  fetch("http://localhost:3000/toys")
  .then(res => res.json())
  .then(data => {
    data.forEach(getToy)
})
}

function getToy(toy){
  //add new toy to DOM
  toyContainer.innerHTML +=`<div class="card">
  <h2>${toy.name}</h2>
  <img src="${toy.image}" class="toy-avatar"/>
  <p>${toy.likes} Likes</p>
  <button class="like-btn" id="${toy.id}">Like ❤️</button>
</div>`
}

function postNewToy(toyName, toyImage){
  //Post new toy + update dom
  fetch("http://localhost:3000/toys", {
    method: 'POST',
    headers: {
      "Content-type":"application/json",
      Accept:"application/json"
    },
    body: JSON.stringify({
      "name": toyName ,
      "image": toyImage ,
      "likes": 0
    })
    
  })
    .then(res=> res.json())
    .then(obj => getToy(obj))
}


function patchAndUpdate(id, currentNumberOfLikes, event){
  //update likes in DB + update DOM
  fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers:
      {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "likes": currentNumberOfLikes+1
      })
  })
  .then(res=> res.json())
  .then(data => {
    event.target.parentNode.querySelector('p').textContent = `${data.likes} Likes`
  }
  )
}

function getLikeNum(string){
  //grab target string of likes and convert to Int
  return parseInt(string.split(' ')[0])
}

