// Navbar.tsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    const [isImageHighlighted, setIsImageHighlighted] = useState(false);

    const handleMouseDown = () => {
        setIsImageHighlighted(true);
    };

    const handleMouseUp = () => {
        setIsImageHighlighted(false);
        
        //to automatically adjust to the current semester
        const today: Date = new Date();
        let semester = "https://www.cs.rpi.edu/academics/courses/"
        if(today.getMonth() <= 4 && today.getDate() >= 10)
            semester += "spring";

        else if(today.getMonth()>=7 && today.getDate() >= 22)
            semester += "fall";

        else
            semester += "summer";

        semester += today.getFullYear().toString().substring(2);
        semester += "/csci2600/";
        window.location.href = semester;
    };

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