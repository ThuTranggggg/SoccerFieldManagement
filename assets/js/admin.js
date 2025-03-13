// Thông tin đăng nhập hợp lệ
const validCredentials = {
    username: "admin",
    password: "123456"
};

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    if (currentPage.includes('login.html')) {
        loginSystem();
    }
    else {
        highlightActiveNavItem();
        if (currentPage.includes('bookingStats.html')) {
            initializeBookingCalendar();
        }
    }

    // Dropdown menu
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    const logoutOption = document.getElementById('logout-option');
    const mailboxOption = document.getElementById('mailbox-option');

    // Mở/đóng menu khi click vào icon hamburger
    if (hamburgerIcon) {
        hamburgerIcon.addEventListener('click', function() {
            dropdownMenu.classList.toggle('show');
        });
    }

    // Đóng menu khi click ra ngoài
    window.addEventListener('click', function(event) {
        if (hamburgerIcon && !hamburgerIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }
    });

    // Xử lý khi click vào option Logout
    logoutOption.addEventListener('click', function() {
        // Ở đây bạn có thể thêm code để hiển thị form logout
        alert('Bạn đã chọn Logout - Hiển thị form xử lý logout tại đây');
        dropdownMenu.classList.remove('show');
    });

    // Xử lý khi click vào option Hòm thư
    mailboxOption.addEventListener('click', function() {
        // Ở đây bạn có thể thêm code để hiển thị form hòm thư
        alert('Bạn đã chọn Hòm thư - Hiển thị form xử lý hòm thư tại đây');
        dropdownMenu.classList.remove('show');
    });
});

function loginSystem() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Lấy giá trị từ các trường input
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // Reset thông báo lỗi
            document.getElementById('usernameError').style.display = 'none';
            document.getElementById('passwordError').style.display = 'none';
            
            // Kiểm tra các trường bắt buộc
            let isValid = true;
            
            if (username === '') {
                document.getElementById('usernameError').style.display = 'block';
                isValid = false;
            }
            
            if (password === '') {
                document.getElementById('passwordError').style.display = 'block';
                isValid = false;
            }
            
            // Nếu form hợp lệ, kiểm tra thông tin đăng nhập
            if (isValid) {
                if (username === validCredentials.username && password === validCredentials.password) {
                    // Đăng nhập thành công, chuyển hướng đến trang bookingStats.html
                    window.location.href = 'P:/SoccerFieldManagement/admin/bookingStats.html';
                } else {
                    // Đăng nhập không thành công
                    document.getElementById('passwordError').textContent = 'Tên đăng nhập hoặc mật khẩu không chính xác';
                    document.getElementById('passwordError').style.display = 'block';
                }
            }
        });
    }
}

function highlightActiveNavItem() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPage.includes(linkPath) && linkPath !== '/') {
            link.classList.add('active');
        }
    });
}

// bookingStats.html
// booking.html
//Khởi tạo ngày T2 đầu tuần hiện tại
let currentWeekStart = new Date();
currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1); // Set to Monday of current week

// Khởi tạo lịch đặt sân
function initializeBookingCalendar() {
    generateBookingTable();
    updateCalendarHeader();
    setupCalendarNavigation();
}

//Tiêu đề lịch
function updateCalendarHeader() {
    const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const weekdayNames = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đưa về 00:00:00 để so sánh
    weekdays.forEach((day, index) => {
        const date = new Date(currentWeekStart);
        date.setDate(date.getDate() + index);
        const dayElement = document.getElementById(day);
        if (dayElement) {
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
            dayElement.textContent = `${weekdayNames[index]} ${formattedDate}`;
            // Nhận biết để tô đỏ ngày hiện tại
            const dateWithoutTime = new Date(date);
            dateWithoutTime.setHours(0, 0, 0, 0);
            if (dateWithoutTime.getTime() === today.getTime()) {
                dayElement.classList.add('today');
            } else {
                dayElement.classList.remove('today');
            }
        }
    });
    updateCurrentDateDisplay();
}

//Hiển thị tuần hiện tại trên thanh nav
function updateCurrentDateDisplay() {
    const endOfWeek = new Date(currentWeekStart);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    const startDay = currentWeekStart.getDate();
    const startMonth = currentWeekStart.getMonth() + 1; // Tháng 1 = 0
    const endDay = endOfWeek.getDate();
    const endMonth = endOfWeek.getMonth() + 1;
    const year = currentWeekStart.getFullYear();
    let dateRangeText;
    if (startMonth === endMonth) {
        dateRangeText = `${startDay}-${endDay} ${monthNames[startMonth - 1]} năm ${year}`;
    } else {
        dateRangeText = `${startDay}/${startMonth}-${endDay}/${endMonth} năm ${year}`;
    }
    const currentDateElement = document.querySelector('.current-date');
    if (currentDateElement) {
        currentDateElement.textContent = dateRangeText;
    }
}

//Nút "Hôm nay"
function setupCalendarNavigation() {
    const todayButton = document.querySelector('.today-button');
    if (todayButton) {
        todayButton.addEventListener('click', () => {
            const today = new Date();
            currentWeekStart = new Date(today);
            currentWeekStart.setDate(today.getDate() - today.getDay() + 1); // Set to Monday of current week
            generateBookingTable(); // Tạo lại bảng đặt sân
            updateCalendarHeader(); // Đã chuyển xuống dưới để cập nhật tiêu đề sau khi tạo bảng -> hiển thị thanh nav
        });
    }
    
    //Tuần trước đó
    const prevButton = document.querySelector('.nav-button.prev');
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentWeekStart.setDate(currentWeekStart.getDate() - 7);
            generateBookingTable(); // Tạo lại bảng đặt sân
            updateCalendarHeader(); // Đã chuyển xuống dưới để cập nhật tiêu đề sau khi tạo bảng -> hiển thị thanh nav
        });
    }
    
    //Tuần tiếp theo
    const nextButton = document.querySelector('.nav-button.next');
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentWeekStart.setDate(currentWeekStart.getDate() + 7);
            generateBookingTable(); // Tạo lại bảng đặt sân
            updateCalendarHeader(); // Đã chuyển xuống dưới để cập nhật tiêu đề sau khi tạo bảng -> hiển thị thanh nav
        });
    }
}

// Hàm định dạng ngày tháng
function formatDateYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Hàm lấy giá tiền theo giờ
function getPrice(time) {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 17) {
        return '200.000đ';
    } else if (hour >= 17 && hour < 22) {
        return '250.000đ';
    } else {
        return '300.000đ';
    }
}

// Tạo bảng đặt sân
function generateBookingTable() {
    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;
    tableContainer.innerHTML = '';
    
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const timeHeader = document.createElement('th');
    timeHeader.textContent = 'Giờ';
    headerRow.appendChild(timeHeader);
    
    const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const weekdayNames = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
    
    weekdays.forEach((day, index) => {
        const dayHeader = document.createElement('th');
        dayHeader.id = day;
        dayHeader.textContent = weekdayNames[index];
        headerRow.appendChild(dayHeader);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    const timeSlots = [
        '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
        '21:00', '22:00', '23:00', '24:00'
    ];
    
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    timeSlots.forEach(time => {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = time;
        row.appendChild(timeCell);
        
        weekdays.forEach((_day, dayIndex) => {
            const cell = document.createElement('td');
            const date = new Date(currentWeekStart);
            date.setDate(date.getDate() + dayIndex);
            
            const isPastDate = date < today;
            const isToday = date.getDate() === now.getDate() && 
                            date.getMonth() === now.getMonth() && 
                            date.getFullYear() === now.getFullYear();
            
            const timeHour = parseInt(time.split(':')[0]);
            const isPastTime = isToday && timeHour <= now.getHours();
            
            if (!isPastDate && !isPastTime) {
                const price = getPrice(time);
                cell.textContent = price;
                cell.classList.add('bookable');
            }
            
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}
