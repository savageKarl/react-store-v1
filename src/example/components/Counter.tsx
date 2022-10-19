import { memo } from "react";

import { useStore } from "../store";

export function Count() {
  const store = useStore();
  const { count, increment } = store.usePicker(["count", "increment"]);

  console.debug("count rendered");

  return (
    <div>
      <h1>I'm the counter</h1>
      <div>number：{count}</div>
      <button onClick={() => increment("payload")}> +1</button>
    </div>
  );
}

export default memo(Count);
