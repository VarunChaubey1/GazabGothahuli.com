$(document).ready(function() {
    // Initialize Swipers
    var gallerySwiper = new Swiper('.gallery-swiper', {
        slidesPerView: 3,
        spaceBetween: 20,
        centeredSlides: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        keyboard: {
            enabled: true,
        },
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 10, centeredSlides: true },
            768: { slidesPerView: 2, spaceBetween: 15 },
            992: { slidesPerView: 3, spaceBetween: 20 },
        },
    });

    var updatesSwiper = new Swiper('.updates-swiper', {
        slidesPerView: 3,
        spaceBetween: 20,
        centeredSlides: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        keyboard: {
            enabled: true,
        },
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 10, centeredSlides: true },
            768: { slidesPerView: 2, spaceBetween: 15 },
            992: { slidesPerView: 3, spaceBetween: 20 },
        },
    });

    // Preloader
    $(window).on('load', function() {
        $('#preloader').fadeOut('slow');
    });

    // Modal Functionality for Updates
    $('.read-more').on('click', function() {
        const id = $(this).data('id');
        $.getJSON('updates.json', function(data) {
            const update = data.updates[id];
            if (update) {
                $('#modal-title').text(update.title);
                $('#modal-content').text(update.content);
                $('#modal-date').text(`दिनांक: ${update.date}`);
                if (update.media) {
                    if (update.media.endsWith('.mp4') || update.media.endsWith('.webm')) {
                        $('#modal-media').html(`
                            <video class="modal-media-video" controls aria-label="${update.title}">
                                <source src="${update.media}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        `);
                    } else {
                        $('#modal-media').html(`
                            <img src="${update.media}" class="modal-media-img" alt="${update.title}" loading="lazy">
                        `);
                    }
                } else {
                    $('#modal-media').html('<p class="text-muted">कोई मीडिया उपलब्ध नहीं है।</p>');
                }
                $('#updateModal').modal('show');
            } else {
                $('#modal-title').text('त्रुटि');
                $('#modal-content').text('अपडेट लोड करने में त्रुटि।');
                $('#modal-date').text('');
                $('#modal-media').html('<p class="text-muted">मीडिया उपलब्ध नहीं है।</p>');
                $('#updateModal').modal('show');
            }
        }).fail(function() {
            $('#modal-title').text('त्रुटि');
            $('#modal-content').text('अपडेट लोड करने में त्रुटि। कृपया बाद में पुनः प्रयास करें।');
            $('#modal-date').text('');
            $('#modal-media').html('<p class="text-muted">मीडिया लोड करने में त्रुटि।</p>');
            $('#updateModal').modal('show');
        });
    });

    // Contact Form Submission
    $('#contact-form').on('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        const $form = $(this);
        const $submitButton = $form.find('button[type="submit"]');
        const $formMessage = $('#form-message');

        // Disable submit button to prevent multiple submissions
        $submitButton.prop('disabled', true).text('भेज रहा है...');

        // Collect form data
        const formData = {
            name: $('#name').val(),
            mobile: $('#mobile').val(),
            message: $('#message').val()
        };

        // Send form data via AJAX
        $.ajax({
            url: $form.attr('action'),
            method: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                // Assuming Google Apps Script returns { status: 'success' } or similar
                $formMessage.html(`
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        आपका संदेश सफलतापूर्वक भेज दिया गया है!
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
                $form[0].reset(); // Clear form
            },
            error: function(xhr, status, error) {
                $formMessage.html(`
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
            },
            complete: function() {
                // Re-enable submit button
                $submitButton.prop('disabled', false).text('संदेश भेजें');
                // Auto-dismiss alert after 5 seconds
                setTimeout(function() {
                    $formMessage.find('.alert').alert('close');
                }, 5000);
            }
        });
    });
});
