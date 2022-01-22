import { useId } from "@reach/auto-id";
import { useState } from "react";

export const DisplayRawJson: React.FC<{jsObj: Object}> = ({jsObj}) => {
    const [showRaw, updateShowRaw] = useState(true)
    const id = useId();
  
    return (        
      <>
        <div className="form-check">
          <input type="checkbox" className="form-check-input" style={{ marginLeft: "-1.5rem" }} id={id}
            checked={showRaw}
            onChange={() => updateShowRaw(prev => !prev)}
          />
          <label className="form-check-label" htmlFor={id}>
            Show raw JSON
          </label>
        </div>
        {showRaw && <pre>{JSON.stringify(jsObj, null, 2)}</pre>}
      </>
    )
  }