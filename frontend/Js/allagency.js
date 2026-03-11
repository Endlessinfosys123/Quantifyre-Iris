// ==========================================
// 1. GLOBAL FUNCTIONS (Ready ke bahar taaki HTML onclick kaam karein)
// ==========================================

function openLogoutModal() {
    console.log("Opening Logout Modal...");
    // jQuery use karke modal ko 'flex' display dein aur active class lagayein
    $("#logoutModal").fadeIn(200).css("display", "flex").addClass('active');
    $("#profileDropdown").removeClass('active');
    $("#profileChevron").css("transform", "rotate(0deg)");
}

function closeLogoutModal() {
    $("#logoutModal").fadeOut(200).removeClass('active');
}

function confirmLogout() {
    console.log("Cleaning session and redirecting...");
    // 1. LocalStorage saaf karein
    localStorage.clear();

    // 2. Cookie ko expire karein (Security ke liye)
    document.cookie = "isAgencyLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 3. Login page par bhejein
    window.location.href = "index.html";
}

// ==========================================
// 2. DOCUMENT READY LOGIC
// ==========================================

$(document).ready(function () {
    const agencyEmail = localStorage.getItem("agencyEmail");
    const $sidebar = $('.sidebar');
    const $notifDropdown = $('#notifDropdown');
    const $profileDropdown = $('#profileDropdown');
    const $profileChevron = $('#profileChevron');

    // --- A. Profile Loading ---
    function loadGlobalProfile() {
        if (!agencyEmail) return;
        $.ajax({
            url: "http://localhost:8080/api/agency/profile",
            type: "GET",
            data: { email: agencyEmail },
            success: function (data) {
                if (data.agencyLogo) {
                    let finalPath = "http://localhost:8080/uploads/logos/" + encodeURIComponent(data.agencyLogo);
                    $("#sidebarAgencyLogo, #headerAgencyLogo, #leftAgencyLogo").attr("src", finalPath);
                }
                const aName = data.agencyName || "Agency User";
                $(".display-agency-name, .user-mini-profile p, .d-name").text(aName);
                $("#display-agency-email").text(data.email);
            }
        });
    }
    loadGlobalProfile();

    // --- B. Sidebar Toggle Logic ---
    $('#sidebarToggle').click(function (e) {
        e.stopPropagation();
        $notifDropdown.removeClass('active');
        $profileDropdown.removeClass('active');
        $profileChevron.css("transform", "rotate(0deg)");
        $sidebar.toggleClass('collapsed');
        
        // Map resize fix
        setTimeout(() => { if (typeof map !== 'undefined') map.invalidateSize(); }, 300);
    });

    // --- C. Dropdowns Toggles ---
    window.toggleNotification = function (event) {
        event.stopPropagation();
        $sidebar.removeClass('collapsed');
        $profileDropdown.removeClass('active');
        $profileChevron.css("transform", "rotate(0deg)");
        $notifDropdown.toggleClass('active');
    };

    window.toggleProfileDropdown = function (event) {
        event.stopPropagation();
        $sidebar.removeClass('collapsed');
        $notifDropdown.removeClass('active');
        const isActive = $profileDropdown.toggleClass('active').hasClass('active');
        $profileChevron.css("transform", isActive ? "rotate(180deg)" : "rotate(0deg)");
    };

    // --- D. Global Click Close ---
    $(document).click(function (event) {
        if (!$(event.target).closest('.sidebar, .notification-wrapper, .profile-info, .notif-dropdown, .profile-dropdown').length) {
            $sidebar.removeClass('collapsed');
            $notifDropdown.removeClass('active');
            $profileDropdown.removeClass('active');
            $profileChevron.css("transform", "rotate(0deg)");
        }
        // Modal ke bahar click karne par band ho (Optional)
        if ($(event.target).is('#logoutModal')) {
            closeLogoutModal();
        }
    });

    $('#closeSidebarBtn').click(function () {
        $sidebar.removeClass('collapsed');
    });
});