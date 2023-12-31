import { useEffect, useRef, useState } from "react";

type AngerBarProps = {
  maxAnger: number;
  anger: number;
  title?: string;
};

const AngerBar = (props: AngerBarProps) => {
  const [barHeightPx, setBarHeightPx] = useState(0);

  const containerRef = useRef<any>();

  useEffect(() => {
    // console.log("anger updated to", props.anger);
    if (containerRef.current) {
      // console.log(containerRef.current.clientHeight);
      const maxHeight = containerRef.current.clientHeight;
      const angerPercent = props.anger / props.maxAnger;
      const newHeight = maxHeight * angerPercent;
      setBarHeightPx(newHeight);
    }
  }, [props.anger]);

  return (
    <div ref={containerRef} className="bar-container">
      <div
        style={{ height: `${barHeightPx}px` }}
        className="anger-bar mom-bar"
      ></div>
    </div>
  );
};

export default AngerBar;
