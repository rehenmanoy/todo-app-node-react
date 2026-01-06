const API_BASE = import.meta.env.VITE_API_BASE;

export const authFetch = (url , options = {}) => {
    const token = localStorage.getItem("token");

    return fetch(`${API_BASE}${url}`,{
       ...options ,
       headers : {
           "Content-Type" : "application/json",
           Authorization : `Bearer ${token}`,
           ...(options.headers || {}),
       },
    });
}
//created a reusable authFetch utility that automatically attaches the Authorization header using a token stored in localStorage