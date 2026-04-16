// Function to format the month and year for headers
function formatMonthYear(date) {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

function organizeBlogPosts() {
    const blogPostsList = document.querySelector('.blog-posts');
    if (!blogPostsList) return;

    const posts = blogPostsList.querySelectorAll('li');

    // year -> month -> posts
    const postsByYear = new Map();

    posts.forEach(post => {
        const timeElement = post.querySelector('time');
        if (!timeElement) return;

        const date = new Date(timeElement.getAttribute('datetime'));
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-11

        let monthsMap = postsByYear.get(year);
        if (!monthsMap) {
            monthsMap = new Map();
            postsByYear.set(year, monthsMap);
        }

        let monthPosts = monthsMap.get(month);
        if (!monthPosts) {
            monthPosts = [];
            monthsMap.set(month, monthPosts);
        }

        monthPosts.push({ post, date });
    });

    blogPostsList.innerHTML = '';

    const fragment = document.createDocumentFragment();

    // Sort years DESC
    const sortedYears = Array.from(postsByYear.keys()).sort((a, b) => b - a);

    sortedYears.forEach(year => {
        const yearHeader = document.createElement('h2');
        yearHeader.textContent = year;
        yearHeader.className = 'year-header';
        fragment.appendChild(yearHeader);

        const monthsMap = postsByYear.get(year);

        // Sort months DESC
        const sortedMonths = Array.from(monthsMap.keys()).sort((a, b) => b - a);

        sortedMonths.forEach(month => {
            const sampleDate = new Date(year, month);

            const header = document.createElement('h3');
            header.textContent = formatMonthYear(sampleDate);
            header.className = 'month-header';
            fragment.appendChild(header);

            const monthPosts = monthsMap.get(month)
                .sort((a, b) => b.date - a.date);

            monthPosts.forEach(({ post }) => {
                fragment.appendChild(post);
            });
        });
    });

    blogPostsList.appendChild(fragment);
}

// Run the organization when the DOM is loaded
const validClasses = ["blog", "life", "notes", "travel", "tech", "all"];
const shouldRun = document.querySelector(".blog-posts") &&
    validClasses.some(cls => document.body.classList.contains(cls));

if (shouldRun) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", organizeBlogPosts);
    } else {
        organizeBlogPosts();
    }
}