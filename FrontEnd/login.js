
//Formulaire de connection -> email + mot de passe

const formulairelogin = document.querySelector("form");

formulairelogin.addEventListener("submit", (e) => {

    e.preventDefault();

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",

        body: JSON.stringify
            ({
                "email": email.value,
                "password": password.value,
            }),
        headers: { "Content-Type": "application/json" }
    })


        .then((res) => res.json())

        //Récupération de token

        .then(data => {

            localStorage.setItem("token", data.token)

            //Si mauvais token = erreur

            if (localStorage.getItem("token") == "undefined") {
                document.querySelector(".erreur").textContent = "E-mail ou mot de passe incorrect"

                //Sinon envoie l'utilisateur sur la page d'accueil en mode édition

            } else {
                window.location.href = "/index.html"
            }

            console.log(localStorage)
        })


        .catch(err => {
            console.log("Erreur")
        })

})





