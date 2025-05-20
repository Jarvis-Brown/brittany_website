// Unified Firebase Script for Upload + Gallery
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    getStorage,
    ref,
    listAll,
    getDownloadURL,
    deleteObject,
    uploadBytes,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import Sortable from "https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/modular/sortable.esm.js";

// Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzUOCTAqQf7aQDD_ti4MhXVKli8ZtZhJw",
    authDomain: "potterysite-brittany.firebaseapp.com",
    projectId: "potterysite-brittany",
    storageBucket: "potterysite-brittany.appspot.com", // ← this line is critical
    messagingSenderId: "647969435737",
    appId: "1:647969435737:web:cebf7e67611b5f0596c148",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();

// DOM Elements
const uploadSection = document.getElementById("upload-section");
const authSection = document.getElementById("auth");
const fileInput = document.getElementById("fileInput");
const imageGrid =
    document.getElementById("imageGrid") || document.querySelector(".row");

// Load images into imageGrid (used by both upload and gallery pages)
function loadImages() {
    const folderRef = ref(storage, "uploads");
    listAll(folderRef).then((res) => {
        imageGrid.innerHTML = "";
        res.items.forEach((itemRef) => {
            getDownloadURL(itemRef).then((url) => {
                const div = document.createElement("div");
                div.classList.add("col", "image-item");
                div.innerHTML = `
                    <div class="card shadow-sm" style="position: relative;">
                        <img
                            class="gallery_img card-img"
                            alt="image of clay piece"
                            src="${url}"
                        />
                        <button class="delete-btn" data-path="${itemRef.fullPath}" style="position:absolute;top:5px;right:5px;background:red;color:white;border:none;cursor:pointer;">X</button>
                    </div>
                `;
                imageGrid.appendChild(div);
            });
        });
    });
}

// Enable drag-and-drop sorting if Sortable and gallery are present
function enableSorting() {
    if (imageGrid) {
        new Sortable(imageGrid, {
            animation: 150,
            onEnd: function (evt) {
                console.log(`Moved from ${evt.oldIndex} to ${evt.newIndex}`);
            },
        });
    }
}

// Upload image to Firebase
window.uploadImage = function () {
    const file = fileInput?.files?.[0];
    if (!file) {
        alert("Please select a file to upload.");
        return;
    }
    const fileRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
    uploadBytes(fileRef, file)
        .then(() => {
            alert("Image uploaded successfully!");
            loadImages();
        })
        .catch((err) => {
            alert("Upload failed: " + err.message);
            console.error("Upload error:", err);
        });
};

// Delete image from Firebase
imageGrid?.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const path = e.target.getAttribute("data-path");
        const fileRef = ref(storage, path);
        deleteObject(fileRef)
            .then(() => {
                alert("Deleted");
                loadImages();
            })
            .catch((err) => {
                alert("Failed to delete: " + err.message);
            });
    }
});

// Auth functions
window.login = function () {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Logged in");
        })
        .catch((err) => {
            alert(err.message);
        });
};

window.logout = function () {
    signOut(auth).then(() => {
        alert("Logged out");
    });
};

// Show/hide UI depending on authentication status
onAuthStateChanged(auth, (user) => {
    if (user) {
        uploadSection?.style && (uploadSection.style.display = "block");
        authSection?.style && (authSection.style.display = "none");
        loadImages();
        setTimeout(enableSorting, 1000);
    } else {
        uploadSection?.style && (uploadSection.style.display = "none");
        authSection?.style && (authSection.style.display = "block");
        imageGrid && (imageGrid.innerHTML = "");
    }
});
