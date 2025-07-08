import Navbar from "../components/Navbar";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import { post } from "../lib/api";
import { ThreeDots } from "react-loader-spinner";
import sympyParser from "../lib/SympyParser";

export default function ForwardReasoning() {
    const [data, setData] = useState("");
    const [code, setCode] = useState("{x>0 && y>0} y = 2;");
    const [loading, setLoading] = useState(false);

    const handleClickClear = () => {
        setData("");
        //setCode("// input code");
    };

    const handleReasoning = () => {
        setLoading(true);
        let payload: string;
        try {
            const { pre, stmt } = sympyParser(code);
            payload = `{${pre}} ${stmt}`;
        } catch (e: any) {
            console.error("Parse error:", e);
            setData(e.message);
            setLoading(false);
            return;
        }

        post("http://localhost:3000/forward", payload)
            .then((response) => {
                setData(response);
            })
            .catch((error) => {
                console.error("Forward-reasoning error:", error);
                setData(`Error: ${error}`);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value);
        }
    };

    return (
        <div>
            <Navbar />
            <div
                className="screen"
                style={{ paddingTop: "50px", width: "100%", overflow: "hidden" }}
            >
                <div style={{ width: "50%", justifyContent: "left" }}>
                    <Editor
                        height="92vh"
                        width="50vw"
                        onChange={handleEditorChange}
                        defaultLanguage="java"
                        defaultValue="// Input should be in the format '{precondition} code'"
                    />
                </div>
                <div className="flex flex-col relative pl-8">
                    <div className="flex-grow" style={{ whiteSpace: "pre-line", textAlign: "left" }}>
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