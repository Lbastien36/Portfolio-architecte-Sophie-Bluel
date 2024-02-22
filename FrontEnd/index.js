//Ajout des travaux dans la gallerie

let travaux = fetch("http://localhost:5678/api/works")

    .then(res => res.json())
    .then(data => {

        let affichage = "";

        for (let figure of data) {

            affichage += `
                <figure data-id="${figure.id}">
                        <img src="${figure.imageUrl}" alt="${figure.title}">
                        <figcaption>${figure.title}</figcaption>
                </figure> `

        }


        document.getElementById("gallery").innerHTML = affichage
        console.log(affichage)
        console.log(data)
    })

//Ajout des catégories

let filtre = fetch("http://localhost:5678/api/categories")
    .then(res => res.json())
    .then(data => {

        let filtrebouton = "<p class=categoriebouton data-id=0>Tous</p>";

        for (let categories of data) {

            filtrebouton += `

            <p class=categoriebouton data-id=${categories.id}>${categories.name} </p>
            `

        }
        document.getElementById("categories").innerHTML = filtrebouton
        console.log(categories)

        filter()
    })

/**
 * Fonction pour mise en place des boutons et filtrage
 */
const filter = () => {
    document.querySelectorAll(".categoriebouton").forEach(bouton => {

        bouton.addEventListener("click", (e) => {
            fetch("http://localhost:5678/api/works")

                .then(res => res.json())
                .then(data => {
                    let result = data

                    // Si categorie différente de 0 = filtrage

                    if (e.target.dataset.id != 0) {
                        result = data.filter((figure) => figure.categoryId == e.target.dataset.id);

                    }

                    let affichage = "";

                    for (let figure of result) {

                        affichage += `
                    <figure>
                            <img src="${figure.imageUrl}" alt="${figure.title}">
                            <figcaption>"${figure.title}</figcaption>
                    </figure> `

                    }
                    document.getElementById("gallery").innerHTML = affichage
                })

            console.log(e)
            console.log(e.target.dataset.id)
            console.log("click")
        })
        console.log("coucou", bouton)
    })
}
console.log(travaux)
console.log(filtre)

//Mise en place du mode édition

const boutonlogin = document.getElementById("login")
const banniere = document.getElementById("banniere")

//Vérification du token pour le mode édition

if (localStorage.getItem("token")) {

    banniere.setAttribute("class", "banniere")

    banniere.innerHTML = `
    <i class="fa-regular fa-pen-to-square iconebanniere" ></i>
    <p class="edition">Mode édition</p>
    `
    document.getElementById("divheader").setAttribute("class", "divheader")

    boutonlogin.textContent = "logout"

    boutonlogin.setAttribute("id", "logout")

    const boutonlogout = document.getElementById("logout")

    boutonlogout.addEventListener("click", () => {

        localStorage.clear("token")
        window.location.reload()

    })

    document.querySelector("a").setAttribute("href", "#")

    document.querySelector(".modifier").setAttribute("style", "display:block")

    document.querySelector(".categories").setAttribute("style", "display:none")

    console.log(localStorage)
}

//Ouverture de la modale "modifier"

let modale = null

const openModal = (e) => {
    e.preventDefault()

    const target = document.querySelector(e.target.getAttribute("href"))
    target.style.display = null

    modale = target

    modale.addEventListener("click", closemodal)

    modale.querySelector(".fermermodale").addEventListener("click", closemodal)
    modale.querySelector(".modale-wrapper").addEventListener("click", stopPropagation)
}

//Fermeture de la modale "modifier"

const closemodal = (e) => {

    if (modale === null) return

    e.preventDefault()

    modale.style.display = "none"

    document.getElementById("nouvellediv").setAttribute("style", "display:none")
    document.getElementById("cachergalleriemodale").setAttribute("style", "display:grid")

    modale.removeEventListener("click", closemodal)
    modale.querySelector(".fermermodale").removeEventListener("click", closemodal)
    modale.querySelector(".modale-wrapper").removeEventListener("click", stopPropagation)
    modale = null

}

//Fonction qui empêche la propagation du click sur toute la modale

const stopPropagation = (e) => {
    e.stopPropagation()
}

document.querySelector(".modifier").addEventListener("click", openModal)

//Ajout des travaux dans la modale

fetch("http://localhost:5678/api/works")

    .then(res => res.json())
    .then(data => {

        let affichage = "";

        for (let figure of data) {

            affichage += `
                <figure>
                        <bouton class="boutonsupprimer"><i class="fa-solid fa-trash-can" id="${figure.id}" ></i></bouton>
                        <img src="${figure.imageUrl}" alt="${figure.title}" class="imagemodale">
                        
                </figure> `
        }

        document.getElementById("galleriemodale").innerHTML = affichage

        //Ajout des boutons supprimer sur chacun des travaux

        document.querySelectorAll(".boutonsupprimer").forEach(bouton => {


            bouton.addEventListener("click", (e) => {
                console.log("bla")
                const token = localStorage.getItem("token")

                const id = e.target.getAttribute("id")
                console.log(id)

                console.log(e)

                //Suppression des travaux de l'API

                fetch("http://localhost:5678/api/works/" + id, {

                    method: "DELETE",
                    body: null,
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + token,
                    },

                })

                    //Supression des travaux de la gallerie et de la modale

                    .then((res) => {

                        e.target.parentNode.parentNode.remove()
                        document.querySelector(`[data-id="${id}"]`).remove()
                    }

                    )
                    .catch(err => console.log(err))
            })

        })

        //Fonction de prévisualisation des images avant l'envoi

        const previewimage = (e) => {
            const preview = document.getElementById("preview")
            preview.src = URL.createObjectURL(e.target.files[0])
        }

        //Mise en place du formulaire d'ajout de travaux

        document.getElementById("ajouterphoto").setAttribute("class", "ajouterphoto")

        document.querySelector(".ajouterphoto").addEventListener("click", () => {

            document.getElementById("cachergalleriemodale").setAttribute("style", "display:none")
            document.getElementById("nouvellediv").setAttribute("style", "display:flex")

            //Au chargement d'une image -> appel de la fonction de prévisualisation

            document.getElementById("photo").addEventListener("change", previewimage)

            document.getElementById("photo").addEventListener("change", () => {
                document.querySelector(".labelphoto").setAttribute("style", "opacity:0; height:169px;position: absolute;")
                document.querySelector(".iconeimage").setAttribute("style", "display:none")
                document.querySelector(".jpg").setAttribute("style", "display:none")
            })

            //Mise en place du formulaire de soumission de travaux

            const formAjouterphoto = document.getElementById("formAjouterphoto")

            formAjouterphoto.addEventListener("submit", (e) => {

                e.preventDefault()
                const token = localStorage.getItem("token")


                let input = document.querySelector('input[type="file"]')
                console.log(input.files)
                const formData = new FormData()

                formData.append('image', input.files[0])
                formData.append('title', titre.value)
                formData.append('category', categorie.value)

                //Ajout de travaux sur l'API

                fetch("http://localhost:5678/api/works", {

                    method: "POST",

                    body: formData,

                    headers: {

                        'Authorization': 'Bearer ' + token,
                    }

                })

                    .then((res) => res.json())

                    //Ajout des travaux dans la galllerie et dans la modale

                    .then(data => {

                        let affichage = `<figure data-id="${data.id}">
                        <img src="${data.imageUrl}" alt="${data.title}">
                        <figcaption>${data.title}</figcaption>
                        </figure> `

                        document.getElementById("gallery").insertAdjacentHTML("beforeend", affichage)
                        console.log(data)

                    })


            })

            //Bouton retour de la modale

            document.querySelector(".retourmodale").addEventListener("click", () => {

                document.getElementById("nouvellediv").setAttribute("style", "display:none")
                document.getElementById("cachergalleriemodale").setAttribute("style", "display:grid")
            })

        })

    })




