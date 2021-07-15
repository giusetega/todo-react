import React, { useState } from "react";
import Todo from "./components/Todo";
import Form from "./components/Form";
import Filterbutton from "./components/FilterButton";



function App(props) {

  const [tasks, setTasks] = useState(props.tasks);
  let [counter, setCounter] = useState(3);

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
    const remainingTasks = tasks.filter(task => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map( task => task.id == id ? {...task, name: newName} : task);
    setTasks(editedTaskList);
  }

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        <Filterbutton name="all" />
        <Filterbutton name="actived" />
        <Filterbutton name="completed" />
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
