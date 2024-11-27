
let categories = [];

$("button").click(function(){
    categories = [];
    setupAndStart();
})


async function getCategoryIds() {
    const res = await axios.get("http://jservice.io/api/categories?count=100");
    const shuffledCats = _.shuffle(res.data).slice(0, 6);
    return shuffledCats.map(c => c.id);
}



async function getCategory(catId) {
    const result = await axios.get("http://jservice.io/api/category?id=" + catId);
    let availClues = result.data.clues;
    const selectedClues =_.shuffle(availClues).slice(0, 5);

    let myClues = selectedClues.map(function(n){
        return {
            "question": n.question,
            "answer": n.answer,
            "showing": null,
        }
    })
    
    let catObject = {
        "title": result.data.title,
        "clues": myClues
    };
    return catObject;
}


async function fillTable() {

    let header = $("thead");
    let body = $("tbody");
    header.empty();
    body.empty();

    let hrow = $("<tr>");

    for (let cat of categories){
        const newTitle = $("<th>");
        newTitle.text(cat.title.toUpperCase());
        hrow.append(newTitle);
    }
    header.append(hrow);

    for (let i=0; i <5; i++){
        let newRow = $("<tr>");
        for (let c in categories){
            newTd = $("<td>");
            const id = (""+c+i);
            newTd.attr("id", id).text("?");
            newRow.append(newTd); 
        }
        body.append(newRow);
    }
}

$("#jeopardy").click(function handleClick(evt){
    const currentId = evt.target.id;
    let catIdx=currentId[0];
    let clueIdx=currentId[1];
    let thisClue = categories[catIdx].clues[clueIdx];
    var val = thisClue.showing;

    if (val != "answer"){
        if (val == null){
            evt.target.innerText = thisClue.question;
            thisClue.showing = "question";
            evt.target.classList.add("question");
        } else {
            evt.target.innerText = thisClue.answer;
            thisClue.showing = "answer";
            evt.target.classList.replace("question", "answer");
        }
    }

})


async function setupAndStart() {
    const catIDs = await getCategoryIds();

    for (let i = 0; i < catIDs.length; i++) {
        const cat = await getCategory(catIDs[i]);
        categories.push(cat);
        
    }
    fillTable();
}
