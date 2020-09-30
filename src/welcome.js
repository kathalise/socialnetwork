import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration.js";
import Login from "./login";

// function Welcome() {
//     return (
//         <div className="welcome">
//             <h1>Welcome to this!</h1>
//             <img src="/logo.png" />
//             <HashRouter>
//                 <div>
//                     <Route exact path="/" component={Registration} />
//                     {/* <Route path="/login" component={Login} /> */}
//                 </div>
//             </HashRouter>
//         </div>
//     );
// }

export default function Welcome() {
    return (
        <div className="welcome">
            <h1>Welcome to this</h1>
            <img src="/logo.png" alt="logo" />
            <div>
                <HashRouter>
                    <div>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                    </div>
                </HashRouter>
            </div>
        </div>
    );
}
