// Your Bearer token
const bearerToken = "yourBearerTokenHere";

fetch("http://localhost:9092")
  .then((res) => res.text()).then((data)=>console.log(data))
  .catch((error) => {
    console.error("Fetch Error:", error);
  });
