let category = document.querySelector(".category");
let contaner = document.querySelector(".contaner");
let options = document.querySelector(".options");
let spans = document.querySelector(".spans");
let submitbtn = document.querySelector(".submit");

// options
let youTimer = 1;
let type_Q;
let Number_question = 1;
let countq;
let objq;
let Correct_answer = 0;

// time options
let timer = youTimer * 60;
let timeQ;

// Select the type of questions
document.querySelector(".programming").onclick = () => {
  type_Q = "programming";
  getAPI();
  category.remove();
  contaner.style.display = "block";
};
document.querySelector(".public").onclick = () => {
  type_Q = "public";
  getAPI();
  category.remove();
  contaner.style.display = "block";
};

// get api for questions
function getAPI() {
  let api = new XMLHttpRequest();
  api.open("GET", `Quizzes db/Quizzes_${type_Q}.json`);
  api.send();

  api.onreadystatechange = () => {
    if (api.status == 200 && api.readyState == 4) {
      let data = JSON.parse(api.responseText);
      countq = data.length;
      objq = data;

      //   get info questions
      getInfo(data.length);

      //   get question
      getquestion(data[Number_question - 1]);

      //   spans for count qustions
      countQustions(data.length);

      // Timer
      timerQ();
    } else {
      console.log(Error("api status not 200 && api readyState not 4"));
    }
  };
}

function getInfo(count) {
  document.querySelector(".Category-info").innerHTML = type_Q;
  document.querySelector(".Questions-Count").innerHTML = count;
}

function getquestion(obj) {
  document.querySelector(".question h2").innerHTML = obj.title;
  for (let i = 1; i <= 4; i++) {
    // create elements

    let div = document.createElement("div");
    let input = document.createElement("input");
    let label = document.createElement("label");

    // set label
    label.htmlFor = `option_${i}`;
    label.innerHTML = obj.options[4 - i];

    // set input
    if (i == 4) {
      input.checked = true;
    }
    input.type = "radio";
    input.id = `option_${i}`;
    input.name = "question";
    input.dataset.answer = obj.options[4 - i];

    // append in div and options class
    div.appendChild(input);
    div.appendChild(label);
    options.prepend(div);
  }
}

submitbtn.onclick = () => {
  submit();
};
function submit() {
  let inputs = document.querySelectorAll(".options div input");
  inputs.forEach((answer) => {
    if (answer.checked == true) {
      if (answer.dataset.answer == objq[Number_question - 1].answer) {
        Correct_answer++;
      }
    }
  });
  if (countq != Number_question) {
    Number_question++;
    options.innerHTML = "";
    getquestion(objq[Number_question - 1]);
    countQustions(countq);
    clearInterval(timeQ);
    timerQ();
  } else {
    options.remove();
    submitbtn.remove();
    document.querySelector(".time").style.display = 'none';
    document.querySelector(".question h2").innerHTML = `Your answers are ${
      Correct_answer == countq
        ? `<span class='perfect'>Perfect</span> , Your correct answers : <span class='perfect'>${Correct_answer}<span>`
        : Correct_answer < countq && Correct_answer > countq / 2
        ? `<span class='good'>Good</span> , Your correct answers : <span class='good'>${Correct_answer}<span>`
        : `<span class='bad'>Bad</span> , Your correct answers : <span class='bad'>${Correct_answer}<span>`
    }`;
    document.querySelector(".question h2").style.cssText =
      "text-align: center;font-size:18px";
  }
}
function countQustions(count) {
  spans.innerHTML = "";
  for (let i = 0; i < count; i++) {
    let span = document.createElement("span");
    spans.appendChild(span);
    if (Number_question > i) {
      span.className = "on";
    }
  }
}

function timerQ() {
  timer = youTimer * 60;
  if (countq + 1 != Number_question) {
    timeQ = setInterval(() => {
      let minutes = Math.trunc(timer / 60);
      let seconds = Math.trunc(timer % 60);
      document.querySelector(".minutes").innerHTML =
        minutes < 10 ? `0${minutes}` : minutes;
      document.querySelector(".seconds").innerHTML =
        seconds < 10 ? `0${seconds}` : seconds;
      --timer;
      if (timer < 0) {
        clearInterval(timeQ);
        submit();
      }
    }, 1000);
  }
}
