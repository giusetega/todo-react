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

function App(props) {

  const [filter, setFilter] = useState('All');
  const [tasks, setTasks] = useState([]);

  // Use effect AJAX GET all tasks, this is called when the page has stopped rendering
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
      .catch(error => console.log("Error", error))
  }

  // Create filter list based on FILTER_NAMES
  const filterList = FILTER_NAMES.map(name => (
    <Filterbutton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const taskList = tasks
    .filter(FILTER_MAP[filter]) //Pass a function that for each item returns each item that has a completed state true or false based on the filter
    .map(task => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        updateTaskName={updateTaskName}
        deleteTask={deleteTask}
      />
    )
    );

  // PUT completed
  function toggleTaskCompleted(id) {
    tasks.forEach(task => {
      if (id === task.id) {
        const URL = `http://localhost:3030/tasklist/${id}/completed`;
        fetch(URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "completed": !task.completed })
        })
          .then(response => { getAll(); })
          .catch(error => console.log("Error", error))
      };

      getAll();
    });
  }

  function updateTaskName(id, newName) {
    const URL = `http://localhost:3030/tasklist/${id}`;
    fetch(URL, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ "name": newName })
    })
      .then((resp) => getAll())
      .catch(error => console.log("Error", error))
  }

  // POST task
  function addTask(name) {
    const URL = "http://localhost:3030/tasklist/create";
    fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "name": name })
    })
      .then(response => { getAll(); })
      .catch(error => console.log("Error", error))
  }

  // DELETE
  function deleteTask(id) {
    const URL = "http://localhost:3030/tasklist/" + id;
    fetch(URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => { getAll(); })
      .catch(error => console.log("Error", error))
  }

  // function editTask(id, newName) {
  //   const editedTaskList = tasks.map(task => task.id === id ? { ...task, name: newName } : task);
  //   setTasks(editedTaskList);
  // }

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">
        {taskList.length === 1 ? taskList.length + " task remaining" : taskList.length + " tasks remaining"}
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
