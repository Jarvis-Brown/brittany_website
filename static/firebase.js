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
    apiKey: "AIzaSyBzUOCTAqQf7aQDD_ti4MhXVKli8tZzhJw",
    authDomain: "potterysite-brittany.firebaseapp.com",
    projectId: "potterysite-brittany",
    storageBucket: "potterysite-brittany.appspot.com",
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
// imageGrid covers both upload & gallery pages
const imageGrid = document.getElementById("imageGrid") || document.querySelector(".row");

// Function to load images into the grid
function loadImages() {
    if (!imageGrid) return;
    const folderRef = ref(storage, "uploads");
    listAll(folderRef)
        .then((res) => {
            imageGrid.innerHTML = "";
            res.items.forEach((itemRef) => {
                getDownloadURL(itemRef).then((url) => {
                    const div = document.createElement("div");
                    div.classList.add("col", "image-item");
                    div.innerHTML = `
                        <div class=\"card shadow-sm\" style=\"position: relative;\" >
                            <img class=\"gallery_img card-img\" alt=\"image of clay piece\" src=\"${url}\" />
                            <button class=\"delete-btn\" data-path=\"${itemRef.fullPath}\" style=\"position:absolute;top:5px;right:5px;background:red;color:white;border:none;cursor:pointer;\">X</button>
                        </div>
                    `;
                    imageGrid.appendChild(div);
                });
            });
        })
        .catch((err) => console.error("Error loading images:", err));
}

// Function to enable drag-and-drop sorting
function enableSorting() {
    if (!imageGrid) return;
    new Sortable(imageGrid, {
        animation: 150,
        onEnd: (evt) => console.log(`Moved from ${evt.oldIndex} to ${evt.newIndex}`),
    });
}

// Function to upload image (requires login on upload page)
window.uploadImage = async () => {
    if (!fileInput) return;
    const file = fileInput.files[0];
    if (!file) return alert("Please select a file to upload.");

    const fileRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
    try {
        await uploadBytes(fileRef, file);
        alert("Image uploaded successfully!");
        loadImages();
    } catch (err) {
        console.error("Upload error:", err);
        alert("Upload failed: " + err.message);
    }
};

// Function to delete image
if (imageGrid) {
    imageGrid.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const path = e.target.getAttribute("data-path");
            if (!path) return;
            const fileRef = ref(storage, path);
            deleteObject(fileRef)
                .then(() => {
                    alert("Deleted");
                    loadImages();
                })
                .catch((err) => {
                    console.error("Delete error:", err);
                    alert("Failed to delete: " + err.message);
                });
        }
    });
}

// Auth functions
window.login = () => {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    signInWithEmailAndPassword(auth, email, password)
        .then(() => alert("Logged in"))
        .catch((err) => alert(err.message));
};

window.logout = () => {
    signOut(auth).then(() => alert("Logged out"));
};

// Initialize UI based on page and auth state
if (uploadSection) {
    // Upload page: gate upload by auth
    onAuthStateChanged(auth, (user) => {
        if (user) {
            uploadSection.style.display = "block";
            authSection.style.display = "none";
        } else {
            uploadSection.style.displ