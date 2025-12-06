// client/src/utils/services.js
export const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, '');

export const postRequest = async(url, body) => {
  const fullUrl = `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  console.log("POST ->", fullUrl, "body", body);
  const response = await fetch(fullUrl,{
      method:"POST",
      headers:{ "Content-Type": "application/json" },
      body: JSON.stringify(body),
  });
  const data = await response.json();
  if(!response.ok){
      let message = data?.message ?? data;
      return {error:true, message};
  }
  return data;
};

export const getRequest = async(url)=>{
  const fullUrl = `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  const response = await fetch(fullUrl,{method:"GET"});
  const data = await response.json();
  if(!response.ok){
      let message = data?.message ?? "An error occured";
      return {error:true, message};
  }
  return data;
};
