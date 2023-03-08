import logo from '../image/logo-monkey.png';
import cross from '../image/cross.png';
import '../components/Dashboard.css';
import React, { createContext, useContext, useState, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";
import Draggable from 'react-draggable';
import BurgerMenu from "./BurgerMenu";

const ItemContext = createContext({
  items: [],
  addItem: () => {},
  deleteItem: () => {}
});

const initialState = [];
const ItemProvider = (props) => {
  const [items, setItems] = useState(initialState);
  const addItem = (item) => setItems((items) => [...items, item]);
  const deleteItem = (id) =>
  setItems((items) => items.filter((item) => item.id !== id));
  const value = {
    items,
    addItem,
    deleteItem
  };
  return (
    <ItemContext.Provider value={value}>{props.children}</ItemContext.Provider>
  );
};

const GetArea = async () => {
  const { addItem } = useContext(ItemContext);
  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": true
    },
    body: JSON.stringify({
      "user_id": sessionStorage.getItem('user_id')
    })
  };
  const data = await (await fetch('http://localhost:8080/area/update', requestOptions)).json();
  console.log("user", sessionStorage.getItem("user_id"));
  for (var i = 0; i < data.length; i++) {
    addItem({
      name: data[i].title,
      sourceActn: JSON.parse(data[i].loaded_data).action,
      sourceRctn: JSON.parse(data[i].loaded_data).reaction,
      action: data[i].action_id,
      reaction: data[i].reaction_id,
      id: uuidv1()
    });
  }
}
const AddItem = () => {
  const [name, setName] = useState("");
  const [sourceActn, setSourceActn] = useState("");
  const [sourceRctn, setSourceRctn] = useState("");
  const [action, setAction] = useState('1');
  const [reaction, setReaction] = useState('1');
  const { addItem } = useContext(ItemContext);
  const updateName = (e) => {
    setName(e.target.value);
  };
  const updateSourceActn = (e) => {
    setSourceActn(e.target.value);
  };
  const updateSourceRctn = (e) => {
    setSourceRctn(e.target.value);
  };
  const updateAction = (e) => {
    setAction(e.target.value);
    document.getElementById("srcActn").disabled = false;
    if (e.target.value === '0')
      document.getElementById("srcActn").disabled = true;
  };
  const updateReaction = (e) => {
    setReaction(e.target.value);
    document.getElementById("srcRctn").disabled = false;
    if (e.target.value === '2' || e.target.value === '5')
      document.getElementById("srcRctn").disabled = true;
  };
  function resetMedia() {
    setName('');
    setSourceActn('');
    setSourceRctn('');
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    if (action !== 0 && reaction !== 0) {
    addItem({
      name: name,
      sourceActn: sourceActn,
      sourceRctn: sourceRctn,
      action: action,
      reaction: reaction,
      id: uuidv1()
    });
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": true
      },
      body: JSON.stringify({
         "user_id": sessionStorage.getItem('user_id'),
         "title": name,
         "action_id": action,
         "reaction_id": reaction,
         "loaded_data": {
              "action": sourceActn,
              "reaction": sourceRctn,
          }
      })
    };
    const response = await fetch('http://localhost:8080/area', requestOptions);
    const json = await response.json();
    if (json.error === "KO") {
      alert("error");
    }
  }
    resetMedia();
  };

  return (
    <div>
      <form className="menu" onSubmit={submitHandler}>
      <div className="handle"></div>
        <input
          id="name"
          type="text"
          value={name}
          onChange={updateName}
          placeholder="titre"
        />
        <select value={action} onChange={updateAction}>
          <option selected value='1'>Get last tweet from user</option>
          <option value='2'>Get last tweet from topic</option>
        </select>
        <input
          id="srcActn"
          type="text"
          value={sourceActn}
          onChange={updateSourceActn}
          placeholder="source action"
        />
        <select value={reaction} onChange={updateReaction}>
          <option selected value='1'>Envoyer mail</option>
          <option value='2'>Envoyer tweet</option>
          <option value='3'>Envoyer message Discord</option>
          <option value='4'>Retweet</option>
          <option value='5'>Envoyer post</option>
          <option value='6'>Ajouter event</option>
        </select>
        <input
          id="srcRctn"
          type="text"
          value={sourceRctn}
          onChange={updateSourceRctn}
          placeholder="source reaction"
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

const Item = ({ name, sourceActn, sourceRctn, action, reaction, id, }) => {
  const { deleteItem } = useContext(ItemContext);
  if (name === "")
    name = "Test";
  return (
    <div className="block">
      <h3>{name}</h3>
      {(() => {
switch (action) {
   case 1: case '1':
       return (
         <p>Get Last Tweet</p>
       )
   case 2: case '2':
       return (
         <p>Last Follower</p>
       )
   default:
       return (
         <p>ERROR</p>
         )}})()}
      <p>{sourceActn}</p>
      {(() => {
switch (reaction) {
   case 1: case '1':
       return (
         <p>Envoyer Mail</p>
       )
   case 2: case '2':
       return (
         <p>Envoyer Tweet</p>
       )
   case 5: case '5':
       return (
        <p>Envoyer post</p>
       )
   default:
       return (
         <p>ERROR</p>
       )}})()}
      <p>{sourceRctn}</p>
      <button onClick={() => deleteItem(id)} className="delete-btn">
        Delete
      </button>
    </div>
  );
};

const ItemsList = () => {
  const { items } = useContext(ItemContext);
  if (window.test === 1) {
    GetArea();
    window.test = 2;
  }
  return (
    <div className="items">
      {items.map((item) => (
        <Item
          key={item.id}
          name={item.name}
          action={item.action}
          sourceActn={item.sourceActn}
          reaction={item.reaction}
          sourceRctn={item.sourceRctn}
          id={item.id}
        />
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [isShown, setIsShown] = useState(false);
  const showMenu = event => {
    setIsShown(current => !current);
  };
  useEffect(() => {
    window.test = 1;
  }, []);
  return (
    <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <div className="cross_sign">
      <BurgerMenu right/>
        </div>
        <div className="App-contain">
        <img alt="cross" src={cross} onClick={showMenu} className="cross"/>
        <ItemProvider>
        {isShown && (
          <Draggable
        handle=".handle"
        defaultPosition={{x: 200, y: 200}}
        >
        <div className="menu">
            <AddItem/>
          </div>
          </Draggable>
        )}
      {isShown}
      <ItemsList/>
      </ItemProvider>
      </div>
      </header>
    </div>
  );
}
export default Dashboard;