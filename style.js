const theme = document.getElementById("theme");



theme.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    //document.getElementsByClassName("drumContainer").classList.toggle("dark")
});

