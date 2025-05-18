import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getStorage,
    ref,
    listAll,
    getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBzUOCTAQqF7aQDD_ti4MhVXkLi8tZzhJw",
    authDomain: "potterysite-brittany.firebaseapp.com",
    projectId: "potterysite-brittany",
    storageBucket: "potterysite-brittany.appspot.com",
    messagingSenderId: "647969435737",
    appId: "1:647969435737:web:ceb7fe67611b5f0596c148",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage();

const galleryRow = document.querySelector(".row");

function loadGallery() {
    const folderRef = ref(storage, "uploads");
    listAll(folderRef).then((res) => {
        res.items.forEach((itemRef) => {
            getDownloadURL(itemRef).then((url) => {
                const col = document.createElement("div");
                col.classList.add("col");

                col.innerHTML = `
          <div class="card shadow-sm">
            <img
              class="gallery_img card-img"
              alt="image of clay piece"
              src="${url}"
            />
          </div>
        `;

                galleryRow.appendChild(col);
            });
        });
    });
}

loadGallery();
