import { memo } from "react";

function B() {
  console.debug("B rendered");
  return <h2>I'm the B</h2>;
}

export default memo(B);
