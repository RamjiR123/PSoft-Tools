import Navbar from "../components/Navbar";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import { post } from "../lib/api";
import { ThreeDots } from "react-loader-spinner";

export default function ForwardReasoning() {
    const [data, setData] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleClickClear = () => {
        setData("");
        setCode("// input code");
    };

    const handleReasoning = () => {
        setLoading(true);
        console.log(code);
        post("http://localhost:3000/forward-reasoning", code)
            .then((response) => {
                setLoading(false);
                console.log(response);
                setData(response);
            })
            .catch((error) => {
                console.error("error: ", error);
            });
    }
    const handleEditorChange = (value: string | undefined) => {
        if (value) {
            //console.log(value);
            setCode(value);
            //console.log(code);
        }
    };
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div
                className="screen"
                style={{ paddingTop: "50px", width: "100%", overflow: "hidden" }}
            >
                <div style={{ width: "50%", justifyContent: "left" }}>

                    <Editor height="92vh" width="50vw" onChange={handleEditorChange} defaultLanguage="dafny"
                        defaultValue="// Input should be in the format '{precondition} code'" />
                </div>
                <div className="flex flex-col  relative pl-8 ">
                    <div className=" flex-grow" style={{ whiteSpace: "pre-line", textAlign:"left"}}>
                        {loading ? (
                            <ThreeDots color="gray" height={100} width={100} />
                        ) : (
                            data
                        )}
                    </div>
                    <div className="flex flex-row justify-evenly max-h-11 mb-4">
                        <button onClick={handleClickClear}>Clear</button>
                        <button onClick={handleReasoning}>Forward Reasoning</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

