import React, { useState } from "react";
import "./Layout.css";
import Toggle from "../Toggle/Toggle";
import TableView from "../TableView/TableView";
import KanbanView from "../KanbanView/KanbanView";
import { useNavigate } from "react-router-dom";
import Form from '../Form/Form'

const Layout = () => {
  const [view, setView] = useState(0);
  const navigate = useNavigate();

  const [isOpen,setIsopen]=useState(false)

  const displayData = () => {
    switch (view) {
      case 0:
        return <TableView />;
      case 1:
        return <KanbanView />;
    }
  };

  return (
    <div className="layout">
      <div>
        <div className="layot-top--container">
          <h1>Positions</h1>

          {/* popup start */}
          <div className="popup--container">
            <button onClick={() => setIsopen(true)}>Add</button>
            {isOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <Form setIsopen={setIsopen}/>
                    </div>

                </div>
            )}
          </div>

          {/* popup end */}
          {/* <button onClick={()=>navigate('/form')}>Add</button> */}
        </div>
        <div className="toggle-contaiiner">
          <Toggle view={view} setView={setView} />
        </div>
        <div className="data-container">{displayData()}</div>
      </div>
    </div>
  );
};

export default Layout;
