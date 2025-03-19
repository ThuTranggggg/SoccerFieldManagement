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
        window.location.href = '/admin/login.html';
    });

    // Xử lý khi click vào option Hòm thư
    mailboxOption.addEventListener('click', function() {
        const mailboxPopup = document.querySelector('.mailbox-popup');
        const overlay = document.querySelector('.overlay');
        const mailboxContent = document.querySelector('.mailbox-content');
        
        // Dữ liệu mẫu cho các thư
        const mailItems = [
            {
                id: 1,
                title: 'Đề xuất cải thiện chất lượng sân',
                date: '20/03/2024',
                preview: 'Tôi thấy sân bóng của quý khách rất tốt, tuy nhiên có một số đề xuất để cải thiện chất lượng...',
                isRead: false
            },
            {
                id: 2,
                title: 'Phản hồi về dịch vụ',
                date: '19/03/2024',
                preview: 'Cảm ơn quý khách đã phục vụ chúng tôi. Dịch vụ rất tốt và chuyên nghiệp...',
                isRead: true
            },
            {
                id: 3,
                title: 'Đề xuất thêm dịch vụ',
                date: '18/03/2024',
                preview: 'Tôi muốn đề xuất thêm một số dịch vụ mới để phục vụ khách hàng tốt hơn...',
                isRead: false
            },
            {
                id: 4,
                title: 'Phản hồi về nhân viên',
                date: '17/03/2024',
                preview: 'Nhân viên phục vụ rất nhiệt tình và chuyên nghiệp. Tôi rất hài lòng...',
                isRead: true
            }
        ];

        // Xóa nội dung cũ
        mailboxContent.innerHTML = '';

        // Thêm các thư mới
        mailItems.forEach(mail => {
            const mailElement = document.createElement('div');
            mailElement.className = `mail-item ${mail.isRead ? '' : 'unread'}`;
            mailElement.innerHTML = `
                <div class="mail-title">${mail.title}</div>
                <div class="mail-date">${mail.date}</div>
                <div class="mail-preview">${mail.preview}</div>
            `;

            // Xử lý click vào thư
            mailElement.addEventListener('click', function() {
                if (!mail.isRead) {
                    mailElement.classList.remove('unread');
                    mail.isRead = true;
                }
                // Ở đây có thể thêm code để hiển thị nội dung chi tiết của thư
                alert('Nội dung thư: ' + mail.preview);
            });

            mailboxContent.appendChild(mailElement);
        });

        // Hiển thị popup và overlay
        mailboxPopup.style.display = 'flex';
        overlay.style.display = 'block';

        // Xử lý đóng popup
        const closeButtons = mailboxPopup.querySelectorAll('.close-popup');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                mailboxPopup.style.display = 'none';
                overlay.style.display = 'none';
            });
        });

        // Đóng popup khi click vào overlay
        overlay.addEventListener('click', function() {
            mailboxPopup.style.display = 'none';
            overlay.style.display = 'none';
        });

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
                    window.location.href = '/admin/bookingStats.html';
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
// Sửa lại công thức để xử lý đúng khi ngày hiện tại là Chủ Nhật
const currentDay = currentWeekStart.getDay(); // 0 = CN, 1 = T2, ..., 6 = T7
currentWeekStart.setDate(currentWeekStart.getDate() - (currentDay === 0 ? 6 : currentDay - 1)); // Set to Monday of current week

// Khởi tạo lịch đặt sân
function initializeBookingCalendar() {
    generateBookingTable();
    updateCalendarHeader();
    setupCalendarNavigation();
    editBookingTable();
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
    const startMonth = currentWeekStart.getMonth() + 1; // Tháng 1 = 0
    const endMonth = endOfWeek.getMonth() + 1;
    const year = currentWeekStart.getFullYear();
    let dateRangeText;
    if (startMonth === endMonth) {
        dateRangeText = `${monthNames[startMonth - 1]} năm ${year}`;
    } else {
        dateRangeText = `${monthNames[startMonth - 1]} - ${monthNames[endMonth - 1]} năm ${year}`;
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
            const todayDay = today.getDay();
            currentWeekStart.setDate(today.getDate() - (todayDay === 0 ? 6 : todayDay - 1));
            generateBookingTable();
            updateCalendarHeader();
        });
    }
    
    //Tuần trước đó
    const prevButton = document.querySelector('.nav-button.prev');
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentWeekStart.setDate(currentWeekStart.getDate() - 7);
            generateBookingTable();
            updateCalendarHeader();
        });
    }
    
    //Tuần tiếp theo
    const nextButton = document.querySelector('.nav-button.next');
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentWeekStart.setDate(currentWeekStart.getDate() + 7);
            generateBookingTable();
            updateCalendarHeader();
        });
    }

    // Nút chỉnh sửa
    const editButton = document.querySelector('.edit-button');
    const popup = document.querySelector('.edit-popup');
    const overlay = document.querySelector('.overlay');
    
    if (editButton && popup) {
        // Xử lý mở popup
        editButton.onclick = () => {
            editBookingTable();
            popup.style.display = 'block';
            overlay.style.display = 'block';
        };

        // Xử lý đóng popup khi click vào nút close
        const closeButton = popup.querySelector('.close-popup');
        if (closeButton) {
            closeButton.onclick = () => {
                popup.style.display = 'none';
                overlay.style.display = 'none';
            };
        }

        // Xử lý đóng popup khi click ra ngoài
        overlay.onclick = (event) => {
            if (event.target === overlay) {
                popup.style.display = 'none';
                overlay.style.display = 'none';
            }
        };
    }
}

// Hàm định dạng ngày tháng
// function formatDateYYYYMMDD(date) {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
// }

let datas = [
    [2, 4, 1, 3, 0, 2, 1],
    [0, 2, 4, 2, 1, 3, 0],
    [3, 1, 0, 4, 2, 1, 3],
    [1, 3, 2, 1, 4, 0, 2],
    [4, 0, 3, 2, 1, 4, 0],
    [2, 4, 1, 0, 3, 2, 4],
    [0, 2, 4, 3, 1, 0, 3],
    [3, 1, 0, 2, 4, 3, 1],
    [1, 3, 2, 4, 0, 1, 2],
    [4, 0, 3, 1, 2, 4, 0],
    [2, 4, 1, 3, 0, 2, 3],
    [0, 2, 4, 0, 3, 1, 4],
    [3, 1, 0, 2, 4, 0, 2],
    [1, 3, 2, 4, 1, 3, 1],
    [4, 0, 3, 1, 2, 4, 3],
    [2, 4, 1, 0, 3, 2, 0],
    [0, 2, 4, 3, 1, 0, 4],
    [3, 1, 0, 2, 4, 3, 2],
    [1, 3, 2, 4, 0, 1, 3],
    [4, 0, 3, 1, 2, 4, 1]
];
let inform = [
    {
        field: 'A',
        time: '19:00',
        date: '20/03/2025',
        name: 'Nguyễn Văn A',
        phone: '0909090909',
        price: '400000'
    }
];

// Tạo bảng đặt sân
function generateBookingTable() {
    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;
    tableContainer.innerHTML = '';

    // Tạo tiêu đề
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    thead.classList.add('booking-table-header');

    // Tạo ô tiêu đề "Giờ" ở góc trên bên trái
    const timeHeader = document.createElement('th');
    timeHeader.textContent = "Giờ";
    headerRow.appendChild(timeHeader);

    // Tạo header cho các ngày trong tuần
    const weekdayNames = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
    weekdayNames.forEach((day, index) => {
        const dayHeader = document.createElement('th');
        dayHeader.textContent = day;
        dayHeader.id = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][index];
        headerRow.appendChild(dayHeader);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Tạo nội dung bảng
    const tbody = document.createElement('tbody');
    const hours = ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'];
    
    // Tạo hàng cho mỗi giờ
    hours.forEach((hour, hourIndex) => {
        const row = document.createElement('tr');
        
        // Tạo ô chỉ giờ (cột đầu tiên)
        const timeCell = document.createElement('td');
        timeCell.textContent = hour;
        row.appendChild(timeCell);
        
        // Tạo các ô cho mỗi ngày trong tuần
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const cell = document.createElement('td');
            const value = datas[hourIndex][dayIndex];
            
            // Thêm đánh dấu hình tròn nếu có giá trị
            if (value > 0) {
                const indicator = document.createElement('div');
                indicator.className = 'booking-indicator';
                indicator.style.backgroundColor = getColor(value);
                cell.appendChild(indicator);
                cell.classList.add('bookable');
                
                // Thêm sự kiện click cho ô có đặt sân
                cell.addEventListener('click', () => {
                    showBookingInfo(hour, dayIndex, value);
                });
            }
            
            row.appendChild(cell);
        }
        
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

// Hàm hiển thị thông tin đặt sân
function showBookingInfo(time, dayIndex, value) {
    const bookingInfo = document.querySelector('.booking-info');
    const bookingInfoHeader = bookingInfo.querySelector('.booking-info-header');
    // const bookingInfoContent = document.createElement('div');
    // bookingInfoContent.classList.add('booking-info-content');
    const overlay = document.querySelector('.overlay');

    // Lấy ngày từ dayIndex
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + dayIndex);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    
    // Hiển thị popup và overlay
    bookingInfo.style.display = 'block';
    overlay.style.display = 'block';

    // Cập nhật tiêu đề
    bookingInfoHeader.textContent = `${time} - ${formattedDate}`;
    
    // Thêm thông tin booking theo số lượng
    for (let i = 0; i < value; i++) {
        const content = document.createElement('div');
        content.classList.add('booking-info-content');
        content.innerHTML = `
            <p><strong>Sân:</strong> ${String.fromCharCode(65 + i)}</p>
            <p><strong>Tên:</strong> Nguyễn Văn ${String.fromCharCode(65 + i)}</p>
            <p><strong>SĐT:</strong> 090909090${i + 1}</p>
            <p><strong>Giá:</strong> 400000 VNĐ</p>
        `;
        bookingInfo.appendChild(content);
    }

    // Xử lý đóng popup khi click vào nút close
    const closeButton = bookingInfo.querySelector('.close-popup');
    if (closeButton) {
        closeButton.onclick = () => {
            bookingInfo.style.display = 'none';
            overlay.style.display = 'none';
        };
    }

    // Xử lý đóng popup khi click ra ngoài
    overlay.onclick = (event) => {
        if (event.target === overlay) {
            bookingInfo.style.display = 'none';
            overlay.style.display = 'none';
        }
    };
}

function getColor(value) {
    if (value === 0) return '#FFFFFF';
    if (value === 1) return '#FFBA92';
    if (value === 2) return '#F38D52';
    if (value === 3) return '#ED6F26';
    return '#C04600';
}

// Nút sửa thông tin cho đặt sân
function editBookingTable() {
    const popup = document.querySelector('.edit-popup');
    const popupContentTime = document.querySelector('.popup-content-time');
    const popupContentDay = document.querySelector('.popup-content-day');
    
    // Xóa nội dung cũ
    popupContentTime.innerHTML = '';
    popupContentDay.innerHTML = '';
    
    // Tạo bảng thời gian mở sân
    const table = document.createElement('table');
    table.style.width = '100%';
    
    const thead = document.createElement('thead');
    thead.style.position = 'sticky';
    thead.style.top = '0';
    thead.style.zIndex = '1';
    
    const headerRow = document.createElement('tr');
    thead.classList.add('popup-table-header');

    const headers = ['Chọn', 'Thời gian', 'Giá'];
    const times = ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'];

    headers.forEach((item) => {
        const itemHeader = document.createElement('th');
        itemHeader.textContent = item;
        headerRow.appendChild(itemHeader);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    
    times.forEach((time) => {
        const row = document.createElement('tr');
        
        const selectCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.width = '25px';
        checkbox.style.height = '25px';
        selectCell.style.backgroundColor = 'white';
        selectCell.appendChild(checkbox);
        row.appendChild(selectCell);
        
        const timeCell = document.createElement('td');
        timeCell.textContent = time;
        row.appendChild(timeCell);
        
        const priceCell = document.createElement('td');
        const priceInput = document.createElement('input');
        priceInput.type = 'text';
        priceInput.value = '200000';
        priceInput.style.width = '100%';
        priceInput.style.padding = '5px';
        priceInput.style.border = '1px solid #ddd';
        priceInput.style.borderRadius = '4px';
        priceCell.appendChild(priceInput);
        row.appendChild(priceCell);
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    popupContentTime.appendChild(table);

    // Tạo bảng ngày nghỉ
    const dayTable = document.createElement('table');
    dayTable.style.width = '100%';
    
    const dayThead = document.createElement('thead');
    dayThead.style.position = 'sticky';
    dayThead.style.top = '0';
    dayThead.style.zIndex = '1';
    dayThead.classList.add('popup-table-header');
    
    const dayHeaderRow = document.createElement('tr');
    
    const dayHeaders = ['STT', 'Ngày nghỉ', 'Xóa'];
    dayHeaders.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        dayHeaderRow.appendChild(th);
    });
    
    dayThead.appendChild(dayHeaderRow);
    dayTable.appendChild(dayThead);
    
    const dayTbody = document.createElement('tbody');
    dayTbody.id = 'day-off-tbody';
    dayTable.appendChild(dayTbody);
    
    // Thêm một hàng mặc định
    addDayOffRow(dayTbody);
    
    popupContentDay.appendChild(dayTable);
    
    // Thêm nút lưu
    const saveButton = document.createElement('button');
    saveButton.className = 'save-button';
    saveButton.textContent = 'Lưu';
    popup.appendChild(saveButton);
    
    // Xử lý sự kiện lưu
    saveButton.onclick = function() {
        // Lưu thời gian mở sân
        const timeRows = tbody.querySelectorAll('tr');
        const selectedTimes = [];
        timeRows.forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            const time = row.querySelector('td:nth-child(2)').textContent;
            const price = row.querySelector('input[type="text"]').value;
            if (checkbox.checked) {
                selectedTimes.push({ time, price });
            }
        });

        // Lưu ngày nghỉ
        const dayOffRows = dayTbody.querySelectorAll('tr');
        const dayOffs = [];
        dayOffRows.forEach(row => {
            const dateInput = row.querySelector('input');
            if (dateInput.value.trim() !== '') {
                dayOffs.push(dateInput.value);
            }
        });

        // Sắp xếp ngày nghỉ theo thứ tự
        dayOffs.sort((a, b) => {
            const dateA = parseDate(a);
            const dateB = parseDate(b);
            return dateA - dateB;
        });

        // Cập nhật giao diện
        dayTbody.innerHTML = '';
        dayOffs.forEach((date, index) => {
            addDayOffRow(dayTbody, date, index + 1);
        });

        // Thêm một hàng trống nếu cần
        if (dayOffs.length === 0) {
            addDayOffRow(dayTbody);
        }

        alert('Đã lưu thông tin thành công!');
    };
}

// Hàm thêm hàng mới cho ngày nghỉ
function addDayOffRow(tbody, date = '', index = null) {
    const rows = tbody.querySelectorAll('tr');
    const newIndex = index || rows.length + 1;
    
    const row = document.createElement('tr');
    
    // Cột STT
    const indexCell = document.createElement('td');
    indexCell.textContent = newIndex;
    row.appendChild(indexCell);
    
    // Cột ngày nghỉ
    const dateCell = document.createElement('td');
    const dateInput = document.createElement('input');
    dateInput.type = 'text';
    dateInput.placeholder = 'dd/mm/yyyy';
    dateInput.value = date;
    dateInput.style.width = '100%';
    dateInput.style.padding = '5px';
    dateInput.style.border = '1px solid #ddd';
    dateInput.style.borderRadius = '4px';
    
    // Định dạng input ngày tháng
    dateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) {
            value = value.substring(0, 8);
        }
        
        if (value.length > 4) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4);
        } else if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        
        e.target.value = value;
    });

    // Xử lý phím Enter
    dateInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (dateInput.value.trim() !== '') {
                addDayOffRow(tbody);
            }
        }
    });
    
    dateCell.appendChild(dateInput);
    row.appendChild(dateCell);
    
    // Cột xóa
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.style.backgroundColor = 'transparent';
    deleteButton.style.border = 'none';
    deleteButton.style.color = 'red';
    deleteButton.style.cursor = 'pointer';
    deleteButton.style.fontSize = '16px';
    deleteButton.onclick = function() {
        if (rows.length > 1) {
            tbody.removeChild(row);
            updateRowIndexes(tbody);
        } else {
            dateInput.value = '';
            dateInput.focus();
        }
    };
    
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);
    
    tbody.appendChild(row);
    if (!date) {
        dateInput.focus();
    }
}

// Cập nhật STT sau khi xóa
function updateRowIndexes(tbody) {
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        row.querySelector('td:first-child').textContent = index + 1;
    });
}

// Hàm parse date từ format dd/mm/yyyy thành đối tượng Date
function parseDate(dateStr) {
    if (!dateStr || dateStr.trim() === '') return null;
    
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Tháng trong JS: 0-11
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    
    return new Date(year, month, day);
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
// Gán giá trị ngẫu nhiên cho sold từ 0 đến stock
eatData.forEach(item => {
    item.sold = getRandomNumber(0, item.stock);
});
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
wearData.forEach(item => {
    item.sold = getRandomNumber(0, item.stock);
});
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
    generateBookingChart();
    generateEatChart();
    generateWearChart();
}

// Vẽ biểu đồ đặt sân
function generateBookingChart() {
    const labels = [];
    const slots = [];

    for (let i =1; i<=30; i++) {
        labels.push(i);
        slots.push(getRandomNumber(0, 80));
    }

    // Tạo biểu đồ
    new Chart(document.getElementById('profitBookingChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Số lượt đặt sân',
                data: slots,
                backgroundColor: 'rgb(255, 157, 118)',
                borderColor: 'rgb(23, 135, 139)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    stepSize: 10,
                    max: 80,
                    ticks: {
                        color: 'rgb(255, 255, 255)'
                    },
                    title: {
                        display: true,
                        text: 'Số lượt đặt sân',
                        color: 'rgb(255, 255, 255)'
                    }
                },
                x: {
                    ticks: {
                        color: 'rgb(255, 255, 255)'
                    },
                    title: {
                        display: true,
                        text: 'Ngày',
                        color: 'rgb(255, 255, 255)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Biểu đồ số lượt đặt sân',
                    color: 'rgb(255, 255, 255)',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
    
    // booking-result
    const bookingResult = document.querySelector('.booking-result');
    if (!bookingResult) return;
    bookingResult.innerHTML = '';

    // Tạo tiêu đề
    const bookingTitle = document.createElement('h3');
    bookingTitle.textContent = 'Tháng x';
    bookingTitle.style.textAlign = 'center';
    bookingTitle.style.marginTop = '20px';
    bookingResult.appendChild(bookingTitle);

    // Tổng doanh thu
    const totalBookingRevenue = slots.reduce((sum, slot) => sum + slot, 0)*200000;
    const revenueContent = document.createElement('p');
    revenueContent.textContent = `Tổng doanh thu: ${totalBookingRevenue.toLocaleString('vi-VN')} VNĐ`;
    bookingResult.appendChild(revenueContent);

    // Tổng số lượt đặt sân
    const totalBooking = slots.reduce((sum, slot) => sum + slot, 0);
    const bookingContent = document.createElement('p');
    bookingContent.textContent = `Tổng số lượt đặt sân: ${totalBooking}`;
    bookingResult.appendChild(bookingContent);

    // Ngày bán nhiều nhất
    const maxBookingDay = labels[slots.indexOf(Math.max(...slots))];
    const maxBookingDayContent = document.createElement('p');
    maxBookingDayContent.textContent = `Ngày bán nhiều nhất: ${maxBookingDay}/x/2025 - ${slots[maxBookingDay-1]} lượt`;
    bookingResult.appendChild(maxBookingDayContent);

    // Ngày bán ít nhất
    const minBookingDay = labels[slots.indexOf(Math.min(...slots))];
    const minBookingDayContent = document.createElement('p');
    minBookingDayContent.textContent = `Ngày bán ít nhất: ${minBookingDay}/x/2025 - ${slots[minBookingDay-1]} lượt`;
    bookingResult.appendChild(minBookingDayContent);
}

// Vẽ biểu đồ bán đồ ăn
function generateEatChart() {
    const labels = [];
    const profitRates = [];

    // Gán giá trị ngẫu nhiên cho sold từ 0 đến stock
    eatData.forEach(item => {
        item.profitRate = ((item.price - item.importPrice)*100 / item.importPrice).toFixed(2);
    });

    eatData.sort((a, b) => b.profitRate - a.profitRate);
    eatData.forEach(item => {
        labels.push(item.name);
        profitRates.push(item.profitRate);
    });
    const color = 'rgb(246, 254, 255)';

    // Tạo biểu đồ
     setupChart(labels, profitRates, 'profitEatingChart', color, 'đồ ăn');
     setupResult('.eating-result', eatData);
}

// Vẽ biểu đồ bán trang phục
function generateWearChart() {
    const labels = [];
    const profitRates = [];

    wearData.forEach(item => {
        item.profitRate = ((item.price - item.importPrice)*100 / item.importPrice).toFixed(2);
    });

    wearData.sort((a, b) => b.profitRate - a.profitRate);
    wearData.forEach(item => {
        labels.push(item.name);
        profitRates.push(item.profitRate);
    });

    const color = 'rgb(60, 60, 60)';

    setupChart(labels, profitRates, 'profitWearChart', color, 'trang phục');
    setupResult('.wearing-result', wearData);
}
    
// Hàm tạo biểu đồ
function setupChart(labels, profit, chartId, color, name) {
    const ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{ 
                data: profit,
                label: 'lãi suất(%)',
                backgroundColor: 'rgb(255, 157, 118)',
                borderColor: 'rgb(23, 135, 139)',
                borderWidth: 1
             }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    stepSize: 10,
                    max: 100,
                    ticks: {
                        color: color
                    },
                    title: {
                        display: true,
                        text: 'lãi suất(%)',
                        color: color
                    }
                },
                x: {
                    ticks: {
                        color: color
                    },
                    title: {
                        display: true,
                        text: 'sản phẩm',
                        color: color
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Biểu đồ lãi suất sản phẩm ${name}`,
                    color: color,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// Bảng result
function setupResult(resultClass, data) {
    // Tạo mục kết quả eating-result
    const eatingResult = document.querySelector(resultClass);
    if (!eatingResult) return;
    eatingResult.innerHTML = '';
    
    const eatingTitle = document.createElement('h3');
    eatingTitle.textContent = 'Tháng x';
    eatingTitle.style.textAlign = 'center';
    eatingTitle.style.marginTop = '20px';
    eatingResult.appendChild(eatingTitle);

    // Tổng doanh thu
    const totalEatingRevenue = data.reduce((sum, item) => sum + item.price * item.sold, 0);
    const revenueContent = document.createElement('p');
    revenueContent.textContent = `Tổng doanh thu: ${totalEatingRevenue.toLocaleString('vi-VN')} VNĐ`;
    eatingResult.appendChild(revenueContent);

    // Vốn
    const totalEatingCost = data.reduce((sum, item) => sum + item.importPrice * item.sold, 0);
    const costContent = document.createElement('p');
    costContent.textContent = `Tổng vốn: ${totalEatingCost.toLocaleString('vi-VN')} VNĐ`;
    eatingResult.appendChild(costContent);

    // Lãi
    const profitContent = document.createElement('p');
    const profit = totalEatingRevenue - totalEatingCost;
    profitContent.textContent = `Lãi: ${profit.toLocaleString('vi-VN')} VNĐ`;
    eatingResult.appendChild(profitContent);

    // Tỷ lệ lãi
    const profitRateContent = document.createElement('p');
    profitRateContent.textContent = `Tỷ lệ lãi: ${((profit) * 100 / totalEatingCost).toFixed(2)}%`;
    eatingResult.appendChild(profitRateContent);
}
