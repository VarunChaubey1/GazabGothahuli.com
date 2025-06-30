/* ========== Initialization ========== */
document.addEventListener('DOMContentLoaded', () => {
    console.log('news.js loaded at', new Date().toLocaleString());
/* ========== End Initialization ========== */

/* ========== Load News Article ========== */
    $.getJSON('./updates.json', function (data) {
        console.log('News data loaded:', data);
        const urlParams = new URLSearchParams(window.location.search);
        const id = parseInt(urlParams.get('id'));
        const newsTitle = $('#news-title');
        const newsTitleBreadcrumb = $('#news-title-breadcrumb');
        const newsMedia = $('#news-media');
        const newsContent = $('#news-content');
        const newsDate = $('#news-date');

        if (!newsTitle || !newsMedia || !newsContent || !newsDate || !newsTitleBreadcrumb) {
            console.error('Missing DOM elements');
            newsTitle.text('त्रुटि');
            newsTitleBreadcrumb.text('त्रुटि');
            newsContent.text('DOM तत्व गायब हैं।');
            return;
        }

        if (isNaN(id) || id < 0 || id >= data.updates.length) {
            console.error('Invalid update ID:', id);
            newsTitle.text('त्रुटि');
            newsTitleBreadcrumb.text('त्रुटि');
            newsContent.text('क्षमा करें, यह अपडेट उपलब्ध नहीं है।');
            newsDate.text('');
            newsMedia.html('<p class="text-danger">मीडिया उपलब्ध नहीं है।</p>');
            return;
        }

        const update = data.updates[id];
        newsTitle.text(update.title);
        newsTitleBreadcrumb.text(update.title);
        newsContent.text(update.content);
        newsDate.text(`दिनांक: ${update.date}`);

        if (update.media) {
            if (update.media.endsWith('.mp4') || update.media.endsWith('.webm')) {
                newsMedia.html(`
                    <video class="news-media-video" controls aria-label="${update.title}">
                        <source src="${update.media}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                `);
            } else {
                newsMedia.html(`<img src="${update.media}" class="news-media-img" alt="${update.title}" loading="lazy" onerror="this.src='images/fallback.jpg';">`);
            }
        } else {
            newsMedia.html(`<img src="images/fallback.jpg" class="news-media-img" alt="Fallback" loading="lazy">`);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Error loading updates.json:', textStatus, errorThrown);
        console.error('Status:', jqXHR.status, 'Response:', jqXHR.responseText);
        $('#news-title').text('त्रुटि');
        $('#news-title-breadcrumb').text('त्रुटि');
        $('#news-content').text('अपडेट लोड करने में त्रुटि। कृपया बाद में पुनः प्रयास करें।');
        $('#news-date').text('');
        $('#news-media').html('<p class="text-danger">मीडिया लोड करने में त्रुटि।</p>');
    });
/* ========== End Load News Article ========== */
});