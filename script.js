$(document).ready(function() {
    // --- Global Variables and Data ---
    let currentUser = localStorage.getItem('currentUser'); // Stores the currently logged-in user's email
    let purchasedTickets = JSON.parse(localStorage.getItem('purchasedTickets')) || [];
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || {};

    // Sample Event Data (ensure images exist in images/events/)
    const eventsData = [
        {
            id: 1,
            title: "Summer Music Festival",
            date: "August 25, 2025",
            time: "6:00 PM",
            location: "Central Park",
            price: 49.99,
            capacity: "5000 attendees",
            category: "music",
            image: "images/events/music-festival.jpg",
            description: "Join us for the biggest music festival of the summer featuring top artists from around the world. Three stages, food trucks, and an unforgettable experience!"
        },
        {
            id: 2,
            title: "Tech Workshop",
            date: "September 5, 2025",
            time: "10:00 AM",
            location: "Convention Center",
            price: 29.99,
            capacity: "200 attendees",
            category: "workshop",
            image: "images/events/tech-workshop.jpg",
            description: "Learn the latest in web development and design from industry experts. Hands-on sessions and networking opportunities included."
        },
        {
            id: 3,
            title: "Food Expo",
            date: "September 15, 2025",
            time: "11:00 AM",
            location: "Downtown Plaza",
            price: 19.99,
            capacity: "1000 attendees",
            category: "food",
            image: "images/events/food-expo.jpg",
            description: "Taste culinary delights from around the world. Cooking demonstrations, competitions, and samples from top chefs."
        },
        {
            id: 4,
            title: "Jazz Night",
            date: "September 20, 2025",
            time: "8:00 PM",
            location: "Riverside Lounge",
            price: 35.00,
            capacity: "300 attendees",
            category: "music",
            image: "images/events/jazz-night.jpg",
            description: "An intimate evening of smooth jazz with internationally acclaimed musicians. Dinner and drinks available."
        },
        {
            id: 5,
            title: "Photography Masterclass",
            date: "October 10, 2025",
            time: "9:00 AM",
            location: "Arts District",
            price: 89.99,
            capacity: "50 attendees",
            category: "workshop",
            image: "images/events/photography.jpg",
            description: "Full-day workshop with professional photographers covering composition, lighting, and post-processing techniques."
        },
        {
            id: 6,
            title: "Wine Tasting",
            date: "October 25, 2025",
            time: "7:00 PM",
            location: "Vineyard Estate",
            price: 45.00,
            capacity: "150 attendees",
            category: "food",
            image: "images/events/wine-tasting.jpg",
            description: "Sample award-winning wines paired with gourmet cheeses. Guided by a sommelier with over 20 years of experience."
        }
    ];

    // --- Common UI Elements & Handlers ---

    // Back to top button
    const backToTopBtn = $('#back-to-top');
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            backToTopBtn.fadeIn();
        } else {
            backToTopBtn.fadeOut();
        }
    });
    backToTopBtn.click(function() {
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
    });

    // Mobile menu toggle
    $('.hamburger').click(function() {
        $('nav ul').toggleClass('show');
    });

    // Login/Signup Modal functionality
    const authModal = $('#auth-modal');
    const loginBtn = $('#login-btn');
    const closeBtn = $('.close');

    loginBtn.click(function() {
        if (currentUser) {
            // If user is logged in, this button acts as logout
            logoutUser();
        } else {
            authModal.css('display', 'block');
        }
    });

    closeBtn.click(function() {
        authModal.css('display', 'none');
        // Clear messages when modal closes
        $('#login-message').text('');
        $('#signup-message').text('');
    });

    $(window).click(function(event) {
        if (event.target == authModal[0]) {
            authModal.css('display', 'none');
            $('#login-message').text('');
            $('#signup-message').text('');
        }
    });

    // Tab switching inside modal
    $('.tab-btn').click(function() {
        const tabId = $(this).data('tab');
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        $('.tab-content').removeClass('active');
        $(`#${tabId}`).addClass('active');
        // Clear messages when switching tabs
        $('#login-message').text('');
        $('#signup-message').text('');
    });

    // Update login button text based on current user status
    function updateLoginButton() {
        if (currentUser) {
            loginBtn.text('Logout');
        } else {
            loginBtn.text('Login/Sign Up');
        }
    }
    updateLoginButton(); // Call on page load

    // --- Event Loading Functions ---

    function loadEvents(containerSelector, limit = null) {
        const eventsGrid = $(containerSelector);
        eventsGrid.empty();

        const eventsToDisplay = limit ? eventsData.slice(0, limit) : eventsData;

        if (eventsToDisplay.length === 0) {
            eventsGrid.html('<p style="text-align: center; grid-column: 1 / -1;">No events available at the moment.</p>');
            return;
        }

        eventsToDisplay.forEach(event => {
            const eventCard = `
                <div class="event-card" data-category="${event.category}">
                    <img src="${event.image}" alt="${event.title}">
                    <div class="event-info">
                        <h3>${event.title}</h3>
                        <p><i class="fas fa-calendar"></i> ${event.date} at ${event.time}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                        <p><i class="fas fa-tag"></i> £${event.price.toFixed(2)}</p>
                        <a href="event-details.html?id=${event.id}" class="btn">Details</a>
                    </div>
                </div>
            `;
            eventsGrid.append(eventCard);
        });
    }

    function filterEvents(category) {
        if (category === 'all') {
            $('.event-card').show();
        } else {
            $('.event-card').hide();
            $(`.event-card[data-category="${category}"]`).show();
        }
    }

    // --- Page Specific Logic Execution ---

    // Home page: Load featured events
    if ($('.featured-events .events-grid').length) {
        loadEvents('.featured-events .events-grid', 3); // Show only 3 featured events
    }

    // Events page: Load all events and set up filtering
    if ($('.all-events .events-grid').length) {
        loadEvents('.all-events .events-grid'); // Show all events
        $('.filter-btn').click(function() {
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            const category = $(this).data('category');
            filterEvents(category);
        });
    }

    // Event Details page: Load specific event details and start countdown
    if ($('.event-details').length) {
        loadEventDetails();
    }

    // My Tickets page: Load purchased tickets
    if ($('.my-tickets').length) {
        loadTickets();
    }

    // --- Event Details Page Functions ---
    function loadEventDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = parseInt(urlParams.get('id'));
        
        const event = eventsData.find(e => e.id === eventId);
        
        if (event) {
            $('#detail-event-image').attr('src', event.image);
            $('#event-title').text(event.title);
            $('#event-date').text(`${event.date} at ${event.time}`);
            $('#event-location').text(event.location);
            $('#event-price').text(`£${event.price.toFixed(2)}`);
            $('#event-capacity').text(event.capacity);
            $('#event-description').text(event.description);
            $('#event-id').val(event.id); // Set hidden input for purchase form
            startCountdown(event.date, event.time);
        } else {
            // Handle case where event is not found (e.g., redirect or show error)
            $('main').html('<section class="error-section"><h1>Event Not Found</h1><p>The event you are looking for does not exist or has been removed.</p><a href="events.html" class="cta-button">Browse All Events</a></section>');
        }
    }

    function startCountdown(eventDate, eventTime) {
        const countDownDate = new Date(`${eventDate} ${eventTime}`).getTime();
        
        const x = setInterval(function() {
            const now = new Date().getTime();
            const distance = countDownDate - now;
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            $('#days').text(days.toString().padStart(2, '0'));
            $('#hours').text(hours.toString().padStart(2, '0'));
            $('#minutes').text(minutes.toString().padStart(2, '0'));
            $('#seconds').text(seconds.toString().padStart(2, '0'));
            
            if (distance < 0) {
                clearInterval(x);
                $('.countdown-timer').html('<div>Event has started!</div>');
            }
        }, 1000);
    }

    // --- Form Validations & Logic ---

    // Signup form validation
    $('#signup-form').submit(function(e) {
        e.preventDefault();
        const email = $(this).find('input[type="email"]').val().trim();
        const password = $(this).find('input[type="password"]').val().trim();
        
        if (!email.endsWith('@gmail.com')) {
            $('#signup-message').text('Sorry, only @gmail.com accounts are allowed for registration.').css('color', 'red');
            return;
        }
        if (password.length < 6) {
            $('#signup-message').text('Password must be at least 6 characters long.').css('color', 'red');
            return;
        }

        if (registeredUsers[email]) {
            $('#signup-message').text('This email is already registered. Please login.').css('color', 'red');
            return;
        }

        registeredUsers[email] = { password: password }; // Store user
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        $('#signup-message').text('Registration successful! You can now login.').css('color', 'green');
        $(this)[0].reset(); // Clear form
        // Optionally switch to login tab after successful signup
        $('.tab-btn[data-tab="login"]').click();
    });

    // Login form validation
    $('#login-form').submit(function(e) {
        e.preventDefault();
        const email = $(this).find('input[type="email"]').val().trim();
        const password = $(this).find('input[type="password"]').val().trim();

        if (!registeredUsers[email] || registeredUsers[email].password !== password) {
            $('#login-message').text('Sorry, user not found or incorrect password. Try signing up.').css('color', 'red');
            return;
        }

        currentUser = email;
        localStorage.setItem('currentUser', currentUser);
        $('#login-message').text('Login successful!').css('color', 'green');
        $(this)[0].reset(); // Clear form
        updateLoginButton(); // Update button text to 'Logout'
        setTimeout(() => {
            authModal.css('display', 'none'); // Close modal
            // Optionally redirect or refresh page if needed
            // window.location.reload(); 
        }, 1000);
    });

    // Logout function
    function logoutUser() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        purchasedTickets = []; // Clear in-memory tickets on logout
        localStorage.removeItem('purchasedTickets'); // Clear stored tickets
        updateLoginButton(); // Update button text to 'Login/Sign Up'
        alert('You have been logged out.');
        // If on my-tickets page, refresh to show no tickets
        if (window.location.pathname.includes('my-tickets.html')) {
            window.location.reload();
        }
    }

    // Ticket purchase form validation
    $('#purchase-form').submit(function(e) {
        e.preventDefault();

        if (!currentUser) {
            alert('Please login or sign up to purchase tickets.');
            authModal.css('display', 'block');
            $('.tab-btn[data-tab="login"]').click(); // Show login tab
            return;
        }

        const cardNumber = $('#card-number').val().replace(/\s/g, '');
        const sortCode = $('#sort-code').val();
        const eventId = $('#event-id').val();
        const quantity = parseInt($('#quantity').val());
        const ticketType = $('#ticket-type').val();

        if (cardNumber.length === 16 && !isNaN(cardNumber)) {
            if (sortCode.length === 6 && !isNaN(sortCode)) {
                const event = eventsData.find(e => e.id == eventId);
                if (event) {
                    const ticketPrice = event.price;
                    let finalPrice = ticketPrice;
                    if (ticketType === 'vip') finalPrice *= 1.5; // Example: VIP is 1.5x price
                    if (ticketType === 'premium') finalPrice *= 2; // Example: Premium is 2x price

                    const totalCost = finalPrice * quantity;

                    const ticket = {
                        eventId: event.id,
                        eventTitle: event.title,
                        eventDate: event.date,
                        eventTime: event.time,
                        eventLocation: event.location,
                        quantity: quantity,
                        ticketType: ticketType,
                        totalCost: totalCost.toFixed(2),
                        purchasedBy: currentUser,
                        purchaseDate: new Date().toLocaleString()
                    };
                    purchasedTickets.push(ticket);
                    localStorage.setItem('purchasedTickets', JSON.stringify(purchasedTickets));
                    
                    alert('Purchase successful! Your ticket has been added to My Tickets.');
                    window.location.href = 'my-tickets.html'; // Redirect to my-tickets page
                }
            } else {
                alert('Please enter a valid 6-digit sort code.');
            }
        } else {
            alert('Please enter a valid 16-digit card number.');
        }
    });

    // Contact form submission
    $('#contact-form').submit(function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        $(this).trigger('reset');
    });

    // Format card number input for better readability
    $('#card-number').on('input', function() {
        let value = $(this).val().replace(/\s/g, '');
        if (value.length > 0) {
            value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
        }
        $(this).val(value);
    });

    // --- My Tickets Page Functions ---
    function loadTickets() {
        const ticketsList = $('#tickets-list');
        const noTickets = $('#no-tickets');

        if (!currentUser) {
            noTickets.html('<i class="fas fa-user-circle"></i><h2>Please Log In</h2><p>Log in to view your purchased tickets. <a href="#" id="login-from-tickets">Login/Sign Up</a></p>');
            noTickets.show();
            ticketsList.hide();

            $('#login-from-tickets').click(function(e) {
                e.preventDefault();
                authModal.css('display', 'block');
                $('.tab-btn[data-tab="login"]').click();
            });
            return;
        }

        const userTickets = purchasedTickets.filter(ticket => ticket.purchasedBy === currentUser);

        if (userTickets.length === 0) {
            noTickets.show();
            ticketsList.hide();
        } else {
            noTickets.hide();
            ticketsList.empty();
            ticketsList.show();

            userTickets.forEach((ticket, index) => {
                const event = eventsData.find(e => e.id == ticket.eventId);
                const eventImage = event ? event.image : 'images/placeholder.jpg'; // Fallback image

                const ticketItem = `
                    <div class="ticket-item">
                        <div class="ticket-info">
                            <h3>${ticket.eventTitle}</h3>
                            <p><i class="fas fa-calendar"></i> ${ticket.eventDate} at ${ticket.eventTime}</p>
                            <p><i class="fas fa-map-marker-alt"></i> ${ticket.eventLocation}</p>
                            <p><strong>Ticket Type:</strong> ${ticket.ticketType.charAt(0).toUpperCase() + ticket.ticketType.slice(1)}</p>
                            <p><strong>Quantity:</strong> ${ticket.quantity}</p>
                            <p><strong>Total Cost:</strong> £${ticket.totalCost}</p>
                            <p><strong>Purchased On:</strong> ${ticket.purchaseDate}</p>
                            <img src="${eventImage}" alt="${ticket.eventTitle}" style="max-width: 100px; height: auto; border-radius: 5px; margin-top: 10px;">
                        </div>
                        <div class="ticket-actions">
                            <button class="view-ticket" data-ticket-index="${index}">View Ticket Details</button>
                        </div>
                    </div>
                `;
                ticketsList.append(ticketItem);
            });

            // Add click handler for "View Ticket Details" button
            $('.view-ticket').click(function() {
                const ticketIndex = $(this).data('ticket-index');
                const ticket = userTickets[ticketIndex];
                if (ticket) {
                    alert(`Ticket Details:\n\nEvent: ${ticket.eventTitle}\nDate: ${ticket.eventDate} at ${ticket.eventTime}\nLocation: ${ticket.eventLocation}\nType: ${ticket.ticketType.charAt(0).toUpperCase() + ticket.ticketType.slice(1)}\nQuantity: ${ticket.quantity}\nTotal: £${ticket.totalCost}\nPurchased By: ${ticket.purchasedBy}\nOn: ${ticket.purchaseDate}`);
                }
            });
        }
    }

    // Clear storage for testing (e.g., append ?clear=1 to URL)
    if (window.location.search.includes('clear=1')) {
        localStorage.clear();
        alert('Local storage cleared!');
        window.location.href = window.location.pathname; // Reload page without query param
    }
});
