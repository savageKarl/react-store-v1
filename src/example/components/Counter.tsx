import { memo } from "react";

import { useStore } from "../store";

export function Count() {
  const store = useStore();
  const { count, increment, name, changeName } = store.usePicker([
    "count",
    "name",
    "increment",
    "changeName",
  ]);

  console.debug("count rendered");

  return (
    <div>
      <h1>I'm the counter</h1>
      <div>number：{count}</div>
      <div>
        <button onClick={() => increment("payload")}> +1</button>
      </div>
      <h3>{name}</h3>
      <button onClick={() => changeName()}>change name to foo</button>
    </div>
  );
}

export default memo(Count);
