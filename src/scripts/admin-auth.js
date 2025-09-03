// admin-auth.js
const password = prompt("Senha do admin:");
if (password !== "Ana.luiza1") {
    alert("Senha incorreta!");
    window.location.href = "/";
}