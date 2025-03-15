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
        if (currentPage.includes('serviceStats.html')) {
            initializeServiceTable();
        }
        if (currentPage.includes('saleStats.html')) {
            initializeSaleTable();
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

// serviceStats.html
function initializeServiceTable() {
    generateEatTable();
    generateWearTable();
    setupTagService();
}

// Tạo bảng quản lý sản phẩm đồ ăn
let eatData = [
    { name: "Cơm gà xối mỡ", importPrice: Math.floor(35000 * getRandomNumber(70, 90) / 100), price: 35000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Bún chả", importPrice: Math.floor(30000 * getRandomNumber(70, 90) / 100), price: 30000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Phở bò tái nạm", importPrice: Math.floor(40000 * getRandomNumber(70, 90) / 100), price: 40000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Bánh mì thịt nguội", importPrice: Math.floor(25000 * getRandomNumber(70, 90) / 100), price: 25000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Cơm rang dưa bò", importPrice: Math.floor(30000 * getRandomNumber(70, 90) / 100), price: 30000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Bún bò Huế", importPrice: Math.floor(35000 * getRandomNumber(70, 90) / 100), price: 35000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Mỳ xào hải sản", importPrice: Math.floor(38000 * getRandomNumber(70, 90) / 100), price: 38000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Cà phê đen đá", importPrice: Math.floor(12000 * getRandomNumber(70, 90) / 100), price: 12000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Cà phê sữa đá", importPrice: Math.floor(15000 * getRandomNumber(70, 90) / 100), price: 15000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Trà chanh", importPrice: Math.floor(10000 * getRandomNumber(70, 90) / 100), price: 10000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Trà đào cam sả", importPrice: Math.floor(18000 * getRandomNumber(70, 90) / 100), price: 18000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Nước ép cam tươi", importPrice: Math.floor(20000 * getRandomNumber(70, 90) / 100), price: 20000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Sinh tố bơ", importPrice: Math.floor(25000 * getRandomNumber(70, 90) / 100), price: 25000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Bánh flan", importPrice: Math.floor(10000 * getRandomNumber(70, 90) / 100), price: 10000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Chè đậu xanh", importPrice: Math.floor(15000 * getRandomNumber(70, 90) / 100), price: 15000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Xôi gà", importPrice: Math.floor(25000 * getRandomNumber(70, 90) / 100), price: 25000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Bánh cuốn nóng", importPrice: Math.floor(20000 * getRandomNumber(70, 90) / 100), price: 20000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Miến trộn", importPrice: Math.floor(25000 * getRandomNumber(70, 90) / 100), price: 25000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Cơm sườn chua ngọt", importPrice: Math.floor(35000 * getRandomNumber(70, 90) / 100), price: 35000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Bún đậu mắm tôm", importPrice: Math.floor(35000 * getRandomNumber(70, 90) / 100), price: 35000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Cháo gà", importPrice: Math.floor(25000 * getRandomNumber(70, 90) / 100), price: 25000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Nem chua rán", importPrice: Math.floor(15000 * getRandomNumber(70, 90) / 100), price: 15000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Sữa chua nếp cẩm", importPrice: Math.floor(18000 * getRandomNumber(70, 90) / 100), price: 18000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Chè thái", importPrice: Math.floor(20000 * getRandomNumber(70, 90) / 100), price: 20000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Lẩu tự chọn (1 người)", importPrice: Math.floor(70000 * getRandomNumber(70, 90) / 100), price: 70000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Nước ngọt các loại", importPrice: Math.floor(12000 * getRandomNumber(70, 90) / 100), price: 12000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 },
    { name: "Bánh mì trứng", importPrice: Math.floor(15000 * getRandomNumber(70, 90) / 100), price: 15000, image: "assets/images/meal.png", stock: getRandomNumber(10, 100), sold: 0 }
];
function generateEatTable() {
    const tableContainer = document.querySelector('.eat-table-container');
    if (!tableContainer) return;
    tableContainer.innerHTML = '';

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    thead.classList.add('eat-table-header');

    const headers = ['STT', 'Tên sản phẩm', 'Ảnh minh họa','Giá nhập', 'Giá bán', 'Đã bán', 'Số lượng tồn kho'];

    headers.forEach((item) => {
        const itemHeader = document.createElement('th');
        itemHeader.textContent = item;
        headerRow.appendChild(itemHeader);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);
    tableContainer.appendChild(table);
    
    const tbody = document.createElement('tbody');

    // Gán giá trị ngẫu nhiên cho sold từ 0 đến stock
    eatData.forEach(item => {
        item.sold = getRandomNumber(0, item.stock);
    });

    eatData.forEach((item, index) => {
        const row = document.createElement('tr');
        // STT
        const sttCell = document.createElement('td');
        sttCell.textContent = index + 1;
        row.appendChild(sttCell);
        
        // Tên sản phẩm
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        // Ảnh minh họa
        const imageCell = document.createElement('td'); 
        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.name;
        image.classList.add('service-image');
        imageCell.appendChild(image);
        row.appendChild(imageCell);

        // Giá nhập 
        const importPriceCell = document.createElement('td');
        importPriceCell.textContent = item.importPrice;
        row.appendChild(importPriceCell);

        // Giá bán
        const priceCell = document.createElement('td');
        priceCell.textContent = item.price;
        row.appendChild(priceCell);

        // Đã bán
        const soldCell = document.createElement('td');
        soldCell.textContent = item.sold;
        row.appendChild(soldCell);

        // Số lượng tồn kho
        const stockCell = document.createElement('td');
        stockCell.textContent = item.stock;
        row.appendChild(stockCell);

        tbody.appendChild(row);
    })

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

// Hàm tạo ngẫu nhiên số lượng tồn kho cho sản phẩm
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Tạo bảng quản lý sản phẩm trang phục
let wearData = [
        { name: "Áo đấu Manchester United 2025 Home", importPrice: Math.floor(1200000 * getRandomNumber(70, 90) / 100), price: 1200000, image: "assets/images/jersey.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Áo đấu Real Madrid 2025 Away", importPrice: Math.floor(1300000 * getRandomNumber(70, 90) / 100), price: 1300000, image: "assets/images/jersey.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Áo đấu Barcelona 2025 Third", importPrice: Math.floor(1250000 * getRandomNumber(70, 90) / 100), price: 1250000, image: "assets/images/jersey.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Quần short Adidas Performance", importPrice: Math.floor(450000 * getRandomNumber(70, 90) / 100), price: 450000, image: "assets/images/shorts.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Giày Nike Mercurial Vapor 15", importPrice: Math.floor(2500000 * getRandomNumber(70, 90) / 100), price: 2500000, image: "assets/images/boots.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Giày Adidas Predator Freak", importPrice: Math.floor(2400000 * getRandomNumber(70, 90) / 100), price: 2400000, image: "assets/images/boots.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Tất Nike Grip Strike", importPrice: Math.floor(200000 * getRandomNumber(70, 90) / 100), price: 200000, image: "assets/images/socks.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Áo khoác tập luyện Puma", importPrice: Math.floor(900000 * getRandomNumber(70, 90) / 100), price: 900000, image: "assets/images/jacket.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Áo đấu Liverpool 2025 Home", importPrice: Math.floor(1250000 * getRandomNumber(70, 90) / 100), price: 1250000, image: "assets/images/jersey.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Quần dài tập luyện Nike", importPrice: Math.floor(700000 * getRandomNumber(70, 90) / 100), price: 700000, image: "assets/images/pants.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Giày Puma Ultra 3.4", importPrice: Math.floor(2200000 * getRandomNumber(70, 90) / 100), price: 2200000, image: "assets/images/boots.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Áo đấu PSG 2025 Away", importPrice: Math.floor(1300000 * getRandomNumber(70, 90) / 100), price: 1300000, image: "assets/images/jersey.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Băng bảo vệ đầu gối Adidas", importPrice: Math.floor(300000 * getRandomNumber(70, 90) / 100), price: 300000, image: "assets/images/kneepad.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Găng tay thủ môn Nike", importPrice: Math.floor(800000 * getRandomNumber(70, 90) / 100), price: 800000, image: "assets/images/gloves.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Áo đấu Bayern Munich 2025 Third", importPrice: Math.floor(1350000 * getRandomNumber(70, 90) / 100), price: 1350000, image: "assets/images/jersey.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Tất dài Adidas AdiSock", importPrice: Math.floor(180000 * getRandomNumber(70, 90) / 100), price: 180000, image: "assets/images/socks.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Áo giữ nhiệt Under Armour", importPrice: Math.floor(600000 * getRandomNumber(70, 90) / 100), price: 600000, image: "assets/images/base.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Giày Adidas X Speedflow", importPrice: Math.floor(2300000 * getRandomNumber(70, 90) / 100), price: 2300000, image: "assets/images/boots.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Áo đấu Chelsea 2025 Home", importPrice: Math.floor(1250000 * getRandomNumber(70, 90) / 100), price: 1250000, image: "assets/images/jersey.png", stock: getRandomNumber(10, 100), sold: 0 },
        { name: "Quần short Nike Pro", importPrice: Math.floor(400000 * getRandomNumber(70, 90) / 100), price: 400000, image: "assets/images/shorts.png", stock: getRandomNumber(10, 100), sold: 0 }
    ];
function generateWearTable() {
    const tableContainer = document.querySelector('.wear-table-container');
    if (!tableContainer) return;
    tableContainer.innerHTML = '';

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    thead.classList.add('wear-table-header');

    const headers = ['STT', 'Tên sản phẩm', 'Ảnh minh họa', 'Giá nhập', 'Giá bán', 'Đã bán', 'Số lượng tồn kho'];
    headers.forEach((item)=> {
        const itemHeader = document.createElement('th');
        itemHeader.textContent = item;
        headerRow.appendChild(itemHeader);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);
    tableContainer.appendChild(table);
    
    const tbody = document.createElement('tbody');
    wearData.forEach(item => {
        item.sold = getRandomNumber(0, item.stock);
    });

    wearData.forEach((item, index) => {
        const row = document.createElement('tr');
        // STT
        const sttCell = document.createElement('td');
        sttCell.textContent = index + 1;
        row.appendChild(sttCell);

        // Tên sản phẩm
        const nameCell = document.createElement('td');  
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        // Ảnh minh họa
        const imageCell = document.createElement('td');
        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.name;
        image.classList.add('service-image');
        imageCell.appendChild(image);
        row.appendChild(imageCell); 

        // Giá nhập 
        const importPriceCell = document.createElement('td');
        importPriceCell.textContent = item.importPrice;
        row.appendChild(importPriceCell);

        // Giá bán
        const priceCell = document.createElement('td');
        priceCell.textContent = item.price;
        row.appendChild(priceCell); 
        
        // Đã bán
        const soldCell = document.createElement('td');
        soldCell.textContent = item.sold;
        row.appendChild(soldCell);

        // Số lượng tồn kho
        const stockCell = document.createElement('td');
        stockCell.textContent = item.stock;
        row.appendChild(stockCell);

        tbody.appendChild(row);
    })

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

// Tag 2 bảng sp
function setupTagService() {
    const tagEating = document.querySelector('.tag-eating');
    const tagWearing = document.querySelector('.tag-wearing');

    tagEating.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    })

    tagWearing.addEventListener('click', () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    })
}
function setupTagSale() {
    const tagBooking = document.querySelector('.tag-booking');
    const tagEating = document.querySelector('.tag-eating');
    const tagWearing = document.querySelector('.tag-wearing');
    const tagCalendar = document.querySelector('.tag-calendar');

    tagBooking.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    })

    tagEating.addEventListener('click', () => {
        window.scrollTo({
            top: 600,
            behavior: 'smooth'
        });
    })

    tagWearing.addEventListener('click', () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    })

    tagCalendar.addEventListener('click', () => {
        const calendarContainer = document.getElementById('calendar-container');
        const prevYearBtn = document.getElementById('prev-year');
        const nextYearBtn = document.getElementById('next-year');
        const currentYearElement = document.getElementById('current-year');
        const monthsGrid = document.querySelector('.months-grid');
        
        let currentYear = new Date().getFullYear();
        currentYearElement.textContent = currentYear;
        
        // Hiển thị lịch
        calendarContainer.classList.remove('hidden');
        renderCalendar();
        
        // Điều hướng năm trước
        prevYearBtn.addEventListener('click', function() {
            currentYear--;
            renderCalendar();
        });
        
        // Điều hướng năm sau
        nextYearBtn.addEventListener('click', function() {
            currentYear++;
            renderCalendar();
        });
        
        // Tạo lịch cho cả năm
        function renderCalendar() {
            currentYearElement.textContent = currentYear;
            monthsGrid.innerHTML = '';
            
            const today = new Date();
            const currentMonth = today.getMonth();
            
            // Mảng tên tháng
            const monthNames = [
                '1', '2', '3', '4', '5', '6',
                '7', '8', '9', '10', '11', '12'
            ];
            
            // Tạo nút cho từng tháng
            for (let month = 0; month < 12; month++) {
                const monthButton = document.createElement('button');
                monthButton.className = 'month-button';
                monthButton.textContent = monthNames[month];
                
                // Đánh dấu tháng hiện tại
                if (month === currentMonth && currentYear === today.getFullYear()) {
                    monthButton.classList.add('current-month');
                }
                
                // Xử lý sự kiện khi click vào tháng
                monthButton.addEventListener('click', function() {
                    // Chọn tháng và thực hiện hành động tương ứng
                    alert(`Bạn đã chọn tháng ${monthNames[month]} năm ${currentYear}`);
                    // Đóng lịch sau khi chọn
                    calendarContainer.classList.add('hidden');
                });
                
                monthsGrid.appendChild(monthButton);
            }
        }
        
    });

    // Đóng lịch khi click ra ngoài vùng lịch
    document.addEventListener('click', function(event) {
        const calendarContainer = document.getElementById('calendar-container');
        
        // Chỉ xử lý nếu lịch đang hiển thị
        if (!calendarContainer.classList.contains('hidden')) {
            // Nếu click không nằm trong calendar và không phải là nút calendar
            if (!event.target.closest('#calendar-container') && 
                !event.target.closest('.tag-calendar')) {
                calendarContainer.classList.add('hidden');
            }
        }
    });
}

// saleStats.html
function initializeSaleTable() {
    setupTagSale();
}

