import "./index.css"
import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNotes] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [error, setError] = useState("");
  const [important, setImportant] = useState([]);
  
  console.log(showAll);
  console.log(notes);
  console.log(important);

  
  useEffect(() => {

    const fdata = () => {
      axios.get("http://localhost:3001/notes")
        .then(req => {
          setNotes(req.data);
          console.log(req);
          console.log("Datos obtenidos!");
          console.log(notes.length);
          clearInterval(intervalId);
          setError("");
        })
        .catch((req) => {
          setError("No hay conexión con el servidor!");
          console.log(req.message); // Como prueba accedemos al servidor para obtener dato del mismo, en este caso un mensaje de error.
          console.log(req);
          let dataServerError = req;
          console.log(dataServerError); // A modo de prueba, almacenamos los datos del server en una variable.
          if (Array.isArray(req)) { // comprueba si el dato es un array, y si no es, recorre un objeto.
            req.map(e => console.log(e));
          } else {
            console.log("Este dato no es un array");
            console.log("Convirtiendo...");
            for (const key in dataServerError) {
              console.log(key);
            }
          }
        }
        )
        
    }

    const intervalId = setInterval(() => {
      fdata();
    }, 5000);

    fdata();
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    };

    axios.post("http://localhost:3001/notes", noteObject)
      .then((resp) => {
        console.log(noteObject);
        setNotes(notes.concat(resp.data));
        setNewNotes("");
        console.log(resp);
      })
      .catch(() => {

        setError("Se perdio la conexión, volviendo a conectar...", 3000); // 3000 ms = 3 segundos

        intervalId();

      })
  }

  const handleEventValue = (event) => {
    setNewNotes(event.target.value);
  }


  const clearNotes = () => {
    notes.forEach(note => {
      axios.delete(`http://localhost:3001/notes/${note.id}`)
        .then(() => {
          console.log("Notas eliminadas")
        })
        .catch(error => console.error(error));
    });
    setNotes([]);
  }



  const importNotes = () => {

    const allImportant = notes.filter(note => note.important); //Metodo de array, solo valores True
    console.log(allImportant);

    console.log(important);
    setImportant(allImportant)


    if(allImportant.length === 0){
      setError("No se encuentran notas importantes");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }

    if(showAll === false){
      setError(null)
    }

  }


  const changeImportantValue = (event) => {
    const clickedValue = event.target.value;
    console.log(clickedValue)
  }

  return (
    <>
      <div className="flex flex-col w-100 h-100 m-auto bg-red-500">
        <form onSubmit={addNote} maxLength={60} className="inline-flex items-center justify-center">
          <input type="text" value={newNote} onChange={handleEventValue} maxLength={60} className="border w-60 h-10  rounded" />
          <input type="submit" value="SEND" className="cursor-pointer m-2 p-2 rounded bg-sky-400 text-white" />
          <input type="button" onClick={clearNotes} value={"CLEAR"} title="Esto borra las notas almacenadas del servidor" className="cursor-pointer p-2 rounded bg-sky-400 text-white" />
        </form>
        <div className="absolute right-0">
          <button onClick={() => {
            setShowAll(!showAll),
              importNotes()
          }} className="cursor-pointer m-2 p-2 rounded bg-sky-400 text-white">NOTAS IMPORTANTES</button >
        </div>
      </div>
      <div className="w-100 h-100">
        <ul className="text-center pt-5">
          {showAll ? notes.map(note => <li className="hover:bg-red-50" onClick={() => changeImportantValue()} key={note.id} id={note.id}>{note.content}</li>) : important.map(note => <li key={note.id} className="text-green-500">{note.content}</li>)}
        </ul>
        <p className=" text-red-700 text-center pt-5">{error}</p>
      </div>
    </>
  )
};





export default App