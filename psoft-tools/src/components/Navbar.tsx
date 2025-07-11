// Navbar.tsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    const [isImageHighlighted, setIsImageHighlighted] = useState(false);

    //if the user clicks on the logo
    const handleMouseDown = () => {
        setIsImageHighlighted(true);
    };

    //when user let go of click on the logo
    const handleMouseUp = () => {
        setIsImageHighlighted(false);
        
        //to automatically adjust to the current semester
        const today: Date = new Date();

        //full webpage should look like "cs.rpi.edu/academics/courses/semester+year/csci2600"
        //eg. cs.rpi.edu/academics/courses/summer25/csci2600
        let semester = "https://www.cs.rpi.edu/academics/courses/"

        //jan 1 - may 10
        if(today.getMonth() <= 4 && today.getDate() >= 10)
            semester += "spring";

        //august 22 - december 31
        else if(today.getMonth()>=7 && today.getDate() >= 22)
            semester += "fall";

        //may 11 - august 21
        else
            semester += "summer";

        
        semester += today.getFullYear().toString().substring(2); //adds last 2 digits of full year (eg. '25' for '2025')
        semester += "/csci2600/"; //adds class code to url
        window.location.href = semester;
    };

    //adds functionality to all buttons. logo first, then the others. others have two states: active and inactive ->
    //for whether the webpage is the current one being displayed.
    return (
        <>
            <div 
                className="navbar"
                style={{ width: "100%", margin: "auto"}}
            >
                <div className="logo_">
                    <img
                        src="../Logo.png"
                        style={{
                            border: isImageHighlighted ? "1px solid white" : "none",
                            width: 46,
                            height: 46,
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={() => setIsImageHighlighted(false)}
                    />
                
                </div>
                <div className="options">
                    <NavLink
                        to="/index"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Dafny Verifier
                    </NavLink>
                    <NavLink
                        to="/HoareTriple"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Hoare Triples
                    </NavLink>
                    <NavLink
                        to="/ForwardReasoning"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Forward Reasoning
                    </NavLink>
                    <NavLink
                        to="/BackwardReasoning"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Backward Reasoning
                    </NavLink>
                    <NavLink
                        to="/DesignPatterns"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Design Patterns
                    </NavLink>
                    <NavLink
                        to="/CFGCanvas"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        CFG
                    </NavLink>
                </div>
            </div>
        </>
    );
}