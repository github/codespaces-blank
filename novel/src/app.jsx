import React from 'react';
import ReactDOM from 'react-dom/client';

/*
This one just did not work.
import React from "https://esm.sh/stable/react@18.2.0/es2022/react.js";
import * as ReactDOM from "https://esm.sh/v111/react-dom@18.2.0/es2022/server.js";
*/

export const App = (props) => {
    return (
        <div className="w3-panel w3-card">
            <h1>{props.title}</h1>
            <p>{props.message}</p>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App title="Testing" message="Hello..." />);
