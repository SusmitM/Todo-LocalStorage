import { useEffect, useReducer, useState } from "react";
import "./App.css";



const reducer = (state, action) => {
  switch (action.type) {
    case "Add-Task": {
      return {
        ...state,
        tasks: [...state.tasks, { id: action.id, value: action.taskValue }],
        searchQuery: "",
        currentId:state.currentId+1
      };
    }
    case "Update-SearchQuery": {
      return {
        ...state,
        searchQuery: action.searchQuery,
      };
    }
    case "Update-State-Value": {
      return {
        ...state,
        tasks:state.tasks.map(item=>item.id===action.id ? {...item,value:action.updatedValue}:item)
      };
    }
    case "Done-Task": {
      return {
        ...state,
        tasks: state.tasks.filter(({id})=>id!==action.id),
        doneTasks:[...state.doneTasks,state.tasks.find(({id})=>id===action.id)],

        searchQuery: "",
      };
    }
    case "Delete-Task": {
      return {
        ...state,
        tasks: state.tasks.filter(({id})=>id!==action.id),
      };
    }
    case "Delete-Done-Task": {
      return {
        ...state,
        doneTasks:state.doneTasks.filter(({id})=>id!==action.id),
      };
    }

    default:
      state;
  }
};

function App() {

  //getting data from localStorage
  const storedState = JSON.parse(localStorage.getItem("state"));

  const [state, dispatch] = useReducer(reducer, storedState || { tasks: [],doneTasks:[], searchQuery: "",currentId:1 });
  const [isEditing,setIsEditing]=useState(false)
  const [selectedId,setSelectedId]=useState(null)
  const [editValue,setEditValue]=useState(null);



  //add data to localStorage
  useEffect(() => {
    localStorage.setItem("state", JSON.stringify(state));
  }, [state]);

  const addTask = (e) => {
    e.preventDefault();
    dispatch({
      type: "Add-Task",
      id: state.currentId,
      taskValue: state.searchQuery,
    });
  };
  

  const updateSearchQuery = (e) => {
    dispatch({
      type: "Update-SearchQuery",
      searchQuery: e.target.value,
    });
  };

  const markAsDone=(item)=>{
    dispatch({
      type: "Done-Task",
      id: item.id,
    });

  }
  const markAsDelete=(item)=>{
    dispatch({
      type: "Delete-Task",
      id: item.id,
    });

  }
  const deleteDoneTask=(item)=>{
    dispatch({
      type: "Delete-Done-Task",
      id: item.id,
    });

  }
  const handelChange=(event)=>{
    setEditValue(event.target.value)
  }
  const handelSaveBtn=(item)=>{
    dispatch({
      type: "Update-State-Value",
      id: item.id,
      updatedValue:editValue
    });
    setIsEditing(isEditing=>!isEditing)
  }

  return (
    <div className="App">
      <h1>Task Manager</h1>

      <form onSubmit={addTask}>
        <input
          value={state.searchQuery}
          placeholder="Add Task"
          onChange={(e) => {
            updateSearchQuery(e);
          }}
        />
        {"   "}

        <button type="submit">Add</button>
      </form>

      <div className="taskContainer">
      <div className="allTasks">
        <h2>All Tasks</h2>

        <ul>
          {state.tasks.map((item) => {
            return (
              <li key={item.id}>
                {
                isEditing && selectedId===item.id ? 
                (<>
                <input onChange={handelChange} />
                <button  onClick={()=>{
                  handelSaveBtn(item);
                 }}>Save</button>
                </>) :
                (
                <>
                {item.value}{"  "}
      
                  <button onClick={()=>{setSelectedId(item.id);
                  setIsEditing(isEditing=>!isEditing)}}>Edit</button>
                  </>)
                  }

                {"  "} <button onClick={()=>markAsDone(item)}>Done</button>
                {"  "} <button onClick={()=>markAsDelete(item)}>Delete</button>
              </li>
            );
          })}
        </ul>
      </div>
      <hr/>
      <div className="doneTasks">
        <h2>Done Tasks</h2>

        <ul>
          {state.doneTasks.map((item) => {
            return (
              <li key={item.id}>
                {item.value}
                {"  "} <button onClick={()=>deleteDoneTask(item)}>Delete</button>
              </li>
            );
          })}
        </ul>
      </div>
      </div>
    </div>
  );
}

export default App;
