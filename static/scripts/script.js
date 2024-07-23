var inputStar = document.getElementById("Start-day");
var inputEnd = document.getElementById("End-day");
var inputText = document.getElementById("Newtask");

const todoList = document.getElementById("taskList");

// giá trị No ban đầu được đặt bằng 0
var countNo = 0

// Lấy data
fetch("/get_data")
  .then((response) => response.json())
  .then((data) => {
    // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
    // Hiển thị ra màn hình
    displayTasks(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

//=============================================================================
function displayTasks(todo) {
  // ----------------------------------------------------------------------------------
  todoList.innerHTML = "";
  console.log(todo);
  todo.forEach((item, index) => {
    const tr = document.createElement("tr");
    countNo = item.No
    tr.innerHTML = `
        <td><h4>${item.No}</h4></td>
        <td><input type="checkbox" id="Todo1" onchange="checkcomplete(this)"></td>
        <td><label for="Todo1">${item.text}</label></td>
        <td>${item.start_date}</td>
        <td>${item.end_date}</td>
        <td>${item.status}</td>
        <td><button onclick="delete_task(${item.No})">
                <span class="material-symbols-outlined">
                    delete
                </span>
            </button>
        </td>
        <td><button onclick="editTask(${item.No})">
            <span class="material-symbols-outlined">
                edit
                </span>
            </button>
        </td>`;

    todoList.appendChild(tr);
  });
  console.log("countNo: ", countNo)
}

//=============================================================================

function addTask() {
  /*  
        Thêm một nhiệm vụ mới vào trong ứng dụng
    */
  // in ra thông tin dữ liệu được nhập vào
  console.log("inputStar: " + inputStar.value);
  console.log("inputEnd: " + inputEnd.value);
  console.log("inputElement: " + inputText.value);

  // gán dữ liệu được nhập vào vào biến
  const newStart = inputStar.value;
  const newEnd = inputEnd.value;
  const newText = inputText.value;

  if (newText !== "" && newStart !== "" && newEnd !== "") {
    fetch("/add_task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        No: countNo + 1,
        Check: false,
        text: newText,
        start_date: newStart,
        end_date: newEnd,
        status: "Completed",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Xử lý dữ liệu trả về
        displayTasks(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function delete_task(taskId){
  /*
    Xóa một task khỏi todo list
  */
 console.log("taskId: " + taskId)
  fetch("/delete_task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      No: taskId
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Xử lý dữ liệu trả về
      displayTasks(data);
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function checkcomplete(checkbox) {
  // Bạn tự xử lý trường hợp này giúp thầy

  console.log(checkbox.checked);
  var s = checkbox.parentNode.parentNode;
  var Stat = document.getElementById("Status");
  if (checkbox.checked) {
    s.setAttribute("style", "background-color:green;");
    Stat.textContent = "Completed";
  } else {
    s.setAttribute("style", "background-color:white;");
    Stat.textContent = "Incomplete";
  }
}
// function deletetask(taskId){
//     var bruh = document.getElementById(taskId);
//     if(bruh){
//         bruh.parentNode.removeChild(bruh);
//     } else{
//         window.alert('Id not found');
//     }
// }
// function edit(taskId){
//     var task=document.getElementById(taskId);
//     if(task){
//     var labelElement = task.querySelector('label');
//     var startElement = task.querySelector('td:nth-child(4)');
//     var endElement = task.querySelector('td:nth-child(5)');
//     var newTask = prompt('Enter new task:');
//     var newStart = prompt('Enter new Start day:');
//     var newEnd = prompt('Enter new End day:');
//     labelElement.textContent=newTask;
//     startElement.textContent=newStart;
//     endElement.textContent=newEnd;}

// }
// function editTask(taskId){
//     var taskToEdit = document.getElementById(taskId);
//     var taskInput = document.getElementById('Newtask');
//     var start = document.getElementById('Start-day');
//     var end = document.getElementById('End-day');
//     var td = taskToEdit.getElementsByTagName('td');

//     taskInput.value=td[2].textContent;
//     start.value=td[3].textContent;
//     end.value = td[4].textContent;

//     var addButton = document.getElementById('Add');
//     addButton.textContent='Update';

//     addButton.onclick = function(){
//         saveChanges(taskId);
//     };
// }
// function saveChanges(taskId){
//     var taskToEdit = document.getElementById(taskId);
//     var taskInput = document.getElementById('Newtask');
//     var start = document.getElementById('Start-day');
//     var end = document.getElementById('End-day');
//     var td = taskToEdit.getElementsByTagName('td');

//     if(start.value>end.value){
//         end.value=start.value
//     }

//     td[2].textContent = taskInput.value;
//     td[3].textContent = start.value;
//     td[4].textContent = end.value;

//     var addButton = document.getElementById('Add');
//     addButton.textContent='Add';

//     addButton.onclick = addd;

//     taskInput.value='';
//     start.value='';
//     end.value='';
// }
