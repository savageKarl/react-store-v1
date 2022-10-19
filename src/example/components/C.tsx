import { memo } from "react";

function C() {
  console.debug("C rendered");
  return <h2>I'm the C</h2>;
}

export default memo(C);
