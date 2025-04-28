document.addEventListener('DOMContentLoaded', function() {
    // Parse booking details from URL
    const urlParams = new URLSearchParams(window.location.search);
    
    // Format and display booking details
    if (urlParams.has('date')) {
        const date = new Date(urlParams.get('date'));
        document.getElementById('confirmation-date').textContent = date.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    if (urlParams.has('time')) {
        document.getElementById('confirmation-time').textContent = urlParams.get('time');
    }
    
    if (urlParams.has('participants')) {
        document.getElementById('confirmation-participants').textContent = urlParams.get('participants');
    }
    
    if (urlParams.has('total')) {
        document.getElementById('confirmation-total').textContent = urlParams.get('total');
    }
    
    // Generate calendar download link
    const calendarBtn = document.querySelector('.confirmation-actions .outline-btn');
    if (calendarBtn) {
        calendarBtn.href = generateCalendarEvent(urlParams);
    }
});

function generateCalendarEvent(params) {
    const startDate = new Date(`${params.get('date')}T${convertTo24Hour(params.get('time'))}`);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 2); // 2 hour duration
    
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=Japanese+Tea+Ceremony&dates=${
        formatCalendarDate(startDate)
    }/${
        formatCalendarDate(endDate)
    }&details=Your+VibeConnect+experience&location=Japan+House+Delhi`;
}

function convertTo24Hour(timeStr) {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours) + 12;
    
    return `${hours}:${minutes}`;
}

function formatCalendarDate(date) {
    return date.toISOString().replace(/-|:|\.\d\d\d/g,'');
}