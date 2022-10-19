import { memo } from "react";
import { useStore } from "../store";

function C() {
  const store = useStore();
  const { count } = store.usePicker(["count", "increment"]);
  console.debug("C rendered");
  return (
    <div>
      <h2>I'm the C</h2>
      <div>number：{count}</div>
    </div>
  );
}

export default memo(C);
