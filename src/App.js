import React, { useState, useEffect } from "react";
import Todo from "./components/Todo";
import Form from "./components/Form";
import Filterbutton from "./components/FilterButton";

const FILTER_MAP = {
  All: () => true,
  Active: task => !task.completed,
  Completed: task => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);
console.log("filter", FILTER_NAMES)

function App(props) {

  const [filter, setFilter] = useState('All');
  // const [tasks, setTasks] = useState(props.tasks);
  const [tasks, setTasks] = useState([]);
  let [counter, setCounter] = useState(3);


  // Use effect AJAX GET all tasks
  useEffect(() => {
    getAll()
  }, [])

  function getAll() {
    fetch("http://localhost:3030/tasklist")
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const result = data.task_list.map(({ _id, name, completed }) => ({ id: _id, name, completed }));
        setTasks(result)
      })
      .catch(error => console.log("Si è verificato un errore!"))
  }

  const filterList = FILTER_NAMES.map(name => (
    <Filterbutton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  FILTER_NAMES.map(name => console.log(name));

  // const taskList = props.tasks.map(task => task.name);
  const taskList = tasks.map(task => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  )
  );

  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  console.log("DATA", props.tasks)

  // Toggle task completed
  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map(task => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...task, completed: !task.completed }
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  // Add task
  function addTask(name) {
    const newTask = { id: "todo-" + counter, name: name, completed: false };
    setTasks([...tasks, newTask]);
    setCounter(++counter)
  }

  function deleteTask(id) {
    // const remainingTasks = tasks.filter(task => id !== task.id);
    // setTasks(remainingTasks);
    const URL = "http://localhost:3030/tasklist/" + id;
    fetch(URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => {
        console.log("IIIIIIIINNNNNN")
        response.text()
        getAll();
      })
      .catch(error => console.log("Si è verificato un errore!", error))
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map(task => task.id == id ? { ...task, name: newName } : task);
    setTasks(editedTaskList);
  }

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
