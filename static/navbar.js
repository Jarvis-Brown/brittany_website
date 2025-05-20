document.addEventListener("DOMContentLoaded", function () {
    const toggler = document.querySelector(".navbar-toggler");
    const navLinks = document.querySelectorAll(".nav-link");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            // Only run on small screens
            if (
                window.innerWidth < 992 &&
                navbarCollapse.classList.contains("show")
            ) {
                e.preventDefault(); // Stop immediate navigation

                // Collapse the menu
                new bootstrap.Collapse(navbarCollapse).hide();

                // Remove focus highlight
                if (toggler) toggler.blur();

                // Navigate after a short delay (after collapse animation)
                setTimeout(() => {
                    window.location.href = link.href;
                }, 300); // Match Bootstrap's collapse transition duration
            }
        });
    });
});
