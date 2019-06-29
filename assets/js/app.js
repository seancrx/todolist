// Show loading in ul
$("ul").append("<li class='text-center'>Loading...</li>");

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create references
const todoRef = firebase.database().ref("todo");

// Create an data object
var todos = null;

// Sync object changes and read data
todoRef.on('value', snap => {
    $("ul").empty();
    todos = snap.val();
    snap.forEach(function(todo) {
        // console.log(todo.key);
        showTodos(todo);
    })
});

// Set todo to completed
$("ul").on("click", "li", function() {
    var key = $(this)[0].id;
    var todo = $(this).text().trim();
    var status = !$(this).hasClass('completed');
    updateStatus(key, todo, status);
    $(this).toggleClass("completed");
});

// Delete todo
$("ul").on("click", "span", function(event) {
    var keyToDelete = $(this).parent()[0].id;
    console.log(keyToDelete);
    $(this).parent().fadeOut(500, function() {
        $(this).remove();
    });
    deleteTodo(keyToDelete);
    event.stopPropagation();
});

// Add new todo
$("input[type='text']").keypress(function(event) {
    if(event.which === 13) {
        var todoText = $(this).val();
        $(this).val("");
        addTodo(todoText);
    }
});

// Show hide add new todo input
$(".fa-plus").click(function() {
    $("input[type='text']").fadeToggle();
});

// Show todos to html
function showTodos(todo) {
    if (todo.val().status === true) {
        $("ul").append("<li class='completed' id=" + todo.key + "><span><i class='fa fa-trash'></i></span> " + todo.val().todo + "</li>");
    } else {
        $("ul").append("<li id=" + todo.key + "><span><i class='fa fa-trash'></i></span> " + todo.val().todo + "</li>");
    }
}

// Save todo to firebase
function addTodo(todo) {
    const newTodoRef = todoRef.push();
    newTodoRef.set({
        todo: todo,
        status: false
    });
}

// Delete todo from firebase
function deleteTodo(key) {
    firebase.database().ref(`todo/${key}`).remove();
}

// Update status
function updateStatus(key, todo, status) {
    firebase.database().ref(`todo/${key}`).set({
        todo: todo,
        status: status
    });
}