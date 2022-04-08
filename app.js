const inputFile = document.getElementById("file");
const form = document.querySelector("form");
const container = document.querySelector(".grid-container-img");
const indexed = indexedDB;


if(indexed){
    let db;
    const request = indexed.open("Photos-Gallery-Pawww", 1)

    request.onupgradeneeded = () => {
        db = request.result;
        console.log("Creando base de datos...",db)
        let createObjectStore = db.createObjectStore("Photos", {
            autoIncrement: true
        })
    }

    request.onsuccess = () => {
        db = request.result;
        console.log("Abriendo base de datos..", db)
        readData()
    }

    request.onerror = (error) => {
        console.log("Error", error)
    }

    const writeData = (data) => {
        let transaction = db.transaction(["Photos"], "readwrite")
        let objectStore = transaction.objectStore("Photos")
        let request = objectStore.add(data)
    }

    const readData = () => {
        let transaction = db.transaction(["Photos"], "readonly")
        let objectStore = transaction.objectStore("Photos")
        let request = objectStore.openCursor()

        request.onsuccess = (e) => {
            const cursor = e.target.result;
            if(cursor){
                let photo = cursor.value.photo
                container.innerHTML += `<img src="${photo}">`
                cursor.continue()
            }
        }
    }

    inputFile.addEventListener("change", (e) => {
        const files = e.target.files;
        for (const file of files){
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.addEventListener("load", (e) => {
                const data = {
                    photo: e.target.result
                }
                writeData(data)
                location.reload()
            })
        }
    })
}
