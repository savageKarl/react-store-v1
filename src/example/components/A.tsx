import { memo } from "react";

function A() {
  console.debug("A rendered");
  return <h2>I'm the A</h2>;
}

export default memo(A);
