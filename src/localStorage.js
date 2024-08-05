export function saveUserToken(userToken) { 
    localStorage.setItem("TOKEN", userToken); 
  } 
  export function getUserToken() { 
    return localStorage.getItem("TOKEN"); 
  } 
  export function clearUserToken() { 
    return localStorage.removeItem("TOKEN"); 
  } 
export function saveDarkMode(isDark){
  localStorage.setItem("darkMode", isDark);
}
export function getDarkMode(){
  return localStorage.getItem("darkMode");
}