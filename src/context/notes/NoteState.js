import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    const initialState = {
        "name" : "Coder",
        "class" : "10A"
    }
    const [state, setState] = useState(initialState)
    const update = () => {
        setTimeout(() => {
            setState(
                {
                    "name" : "Larry",
                    "class": "11B"
                }
            )
        }, 1000);
    }
    return (
        <NoteContext.Provider value={{state, update}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;