import { useLocation } from "react-router-dom";

function Detail() {
  const location = useLocation();
  const data = location.state ? location.state.data : "Detail";

  return <div>{data}</div>;
}

export default Detail;
