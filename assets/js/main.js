// Khởi tạo các hàm khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    highlightActiveNavItem();
    const currentPage = window.location.pathname;
    if (currentPage.includes('index.html')) {
        setupMapDirections();
    }
    if (currentPage.includes('booking.html')) {
        initializeBookingCalendar();
    }
    if (currentPage.includes('opponent.html')) {
        initializeOpponentPosts();
    }
    if (currentPage.includes('services.html')) {
        initializeServices();
    }
});


//Chuyển màu item khi trang được truy cập
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

// index.html
//Thiết lập định vị đến sân bóng
function setupMapDirections() {
    const mapLink = document.querySelector('.gps-content a');
    if (mapLink) {
        const destinationAddress = "96A Đ. Trần Phú, P. Mộ Lao, Hà Đông, Hà Nội";
        mapLink.addEventListener('click', function(event) {
            event.preventDefault();
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const userLat = position.coords.latitude;
                        const userLng = position.coords.longitude;
                        const directionsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${destinationAddress}`;
                        window.open(directionsUrl, '_blank');
                    },
                    function(error) {
                        console.error('Lỗi khi lấy vị trí:', error);
                        if (error.code === error.PERMISSION_DENIED) {
                            alert("Bạn đã từ chối quyền truy cập vị trí. Vui lòng cho phép truy cập vị trí trong cài đặt trình duyệt để sử dụng tính năng này.");
                        } else {
                            alert("Không thể lấy vị trí của bạn. Đang chuyển hướng đến Google Maps...");
                        }
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinationAddress)}`, '_blank');
                    },
                    { 
                        timeout: 5000,          // 5s
                        enableHighAccuracy: true // Độ chính xác cao
                    }
                );
            } else {
                alert("Trình duyệt của bạn không hỗ trợ định vị. Đang chuyển hướng đến Google Maps...");
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinationAddress)}`, '_blank');
            }
        });
    } else {
        console.error("Không tìm thấy liên kết bản đồ (.gps-content a)");
    }
}

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
            const dateStr = formatDateYYYYMMDD(date);
            
            const isPastDate = date < today;
            
            // Kiểm tra xem khung giờ đã qua hay chưa (cho ngày hôm nay)
            const isToday = date.getDate() === now.getDate() && 
                            date.getMonth() === now.getMonth() && 
                            date.getFullYear() === now.getFullYear();
            
            // Lấy giờ từ chuỗi time (ví dụ: '05:00' => 5)
            const timeHour = parseInt(time.split(':')[0]);
            
            // Kiểm tra xem giờ đã qua chưa nếu là hôm nay
            const isPastTime = isToday && timeHour <= now.getHours();
            
            let availableSlots = 0;
            if (!isPastDate && !isPastTime) {
                availableSlots = 4;
            }
            
            const price = getPrice(time);
            
            if (!isPastDate && !isPastTime && availableSlots > 0) {
                cell.textContent = price;
                cell.classList.add('bookable');
                cell.dataset.date = dateStr;
                cell.dataset.time = time;
                cell.dataset.slots = availableSlots;

                // Thêm event listener cho mỗi ô có thể đặt
                cell.addEventListener('click', () => {
                    const bookingOverlay = document.getElementById('bookingOverlay');
                    
                    // Format date to display as dd/mm/yyyy
                    const [year, month, day] = dateStr.split('-');
                    const formattedDate = `${day}/${month}/${year}`;
                    
                    // Hiển thị thông tin lên form
                    document.getElementById('bookingDate').textContent = formattedDate;
                    document.getElementById('bookingTime').textContent = time;
                    document.getElementById('totalPrice').textContent = price;
                    
                    // Reset form
                    resetForm();
                    
                    // Hiển thị form đặt sân
                    bookingOverlay.style.display = 'flex';
                });
            }
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    tableContainer.appendChild(table);

    // Setup form event handlers
    setupFormEventHandlers();
}

function getPrice(time) {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour <= 8) {
        return '100.000đ';
    } else if (hour >= 9 && hour <= 12) {
        return '200.000đ';
    } else if (hour >= 13 && hour <= 17) {
        return '300.000đ';
    } else if (hour >= 18 && hour <= 24) {
        return '400.000đ';
    }
    return '';
}

function formatDateYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Tách riêng phần xử lý sự kiện của form
function setupFormEventHandlers() {
    const qrOverlay = document.getElementById('qrOverlay');
    const bookingOverlay = document.getElementById('bookingOverlay');
    const cancelBookingBtn = document.getElementById('cancelBooking');
    const confirmBookingBtn = document.getElementById('confirmBooking');
    const closeQrBtn = document.getElementById('closeQrBtn');
    const closeBookingBtn = document.getElementById('closeBookingBtn');

    // Thêm kiểm tra số điện thoại realtime
    const phoneInput = document.getElementById('bookingPhone');
    const phoneError = document.getElementById('phoneError');
    const phoneRegex = /^(0[3|5|7|8|9][0-9]{8}|(\+84|84)[3|5|7|8|9][0-9]{8})$/;

    phoneInput.addEventListener('input', function() {
        const phoneNumber = this.value.trim();
        if (phoneNumber === '') {
            phoneError.textContent = 'Vui lòng nhập số điện thoại';
        } else if (!phoneRegex.test(phoneNumber)) {
            phoneError.textContent = 'Số điện thoại không hợp lệ';
        } else {
            phoneError.textContent = '';
        }
    });

    // Đóng form khi click nút X
    if (closeBookingBtn) {
        closeBookingBtn.addEventListener('click', () => {
            bookingOverlay.style.display = 'none';
        });
    }

    // Đóng form khi click nút hủy
    cancelBookingBtn.addEventListener('click', () => {
        bookingOverlay.style.display = 'none';
    });

    // Đóng QR overlay khi click nút X
    if (closeQrBtn) {
        closeQrBtn.addEventListener('click', () => {
            qrOverlay.style.display = 'none';
        });
    } else {
        console.error('closeQrBtn not found');
    }

    // Xử lý khi click nút thanh toán
    confirmBookingBtn.addEventListener('click', () => {
        console.log("Thanh toán button clicked");
        const isFormValid = validateForm();
        console.log("Form validation result:", isFormValid);
        
        if (isFormValid) {
            const selectedField = document.querySelector('input[name="field"]:checked');
            const bookingName = document.getElementById('bookingName');
            const bookingPhone = document.getElementById('bookingPhone');
            console.log("Selected field:", selectedField);
            console.log("Name:", bookingName ? bookingName.value : "Not found");
            console.log("Phone:", bookingPhone ? bookingPhone.value : "Not found");

            if (selectedField) {
                const fieldValue = selectedField.value;
                const Name = bookingName.value;
                const Phone = bookingPhone.value;

                // Lấy thông tin giá tiền và xử lý để chỉ lấy số
                const priceText = document.getElementById('totalPrice').innerText;
                const price = priceText.replace(/\D/g, ''); // Loại bỏ tất cả các ký tự không phải số
                console.log("Price value:", price);
                
                // Lấy thời gian và ngày đặt sân để thêm vào addInfo
                const bookingTime = document.getElementById('bookingTime').innerText.substring(0, 2);
                const bookingDate = document.getElementById('bookingDate').innerText;
                console.log("Booking time:", bookingTime);
                console.log("Booking date:", bookingDate);
                
                // Cập nhật URL của mã QR với giá tiền thực tế
                const qrCodeImg = document.querySelector('.qr-code img');
                if (!qrCodeImg) {
                    console.error("QR code image element not found!");
                } else {
                    console.log("QR code image found");
                    const addInfo = `${Name} ${Phone} San ${fieldValue} ${bookingTime}h ${bookingDate}`;
                    const qrUrl = `https://img.vietqr.io/image/mbbank-0382802842-qr_only.png?amount=${price}&addInfo=${encodeURIComponent(addInfo)}&accountName=NGUYEN%20THU%20TRANG`;
                    console.log("Setting QR URL to:", qrUrl);
                    qrCodeImg.src = qrUrl;
                }
                
                console.log("Showing QR overlay");
                // Show QR overlay
                qrOverlay.style.display = 'flex';
                console.log("QR overlay display style set to:", qrOverlay.style.display);
                // Close booking form
                bookingOverlay.style.display = 'none';
            }
        }
    });

    // Đóng form khi click ra ngoài
    bookingOverlay.addEventListener('click', (e) => {
        if (e.target === bookingOverlay) {
            bookingOverlay.style.display = 'none';
        }
    });

    // Setup field selection handlers
    setupFieldSelectionHandlers();

    // Thiết lập kiểm tra số điện thoại theo định dạng Việt Nam
    setupPhoneValidation();
}

// Xử lý sự kiện chọn sân
function setupFieldSelectionHandlers() {
    // Chọn tất cả các field-option không bị disabled trong cả field-selection và field-selection-vertical
    const fieldOptions = document.querySelectorAll('.field-option:not(.disabled)');
    
    fieldOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                // Bỏ chọn tất cả các sân khác
                document.querySelectorAll('.field-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Chọn sân hiện tại
                this.classList.add('selected');
                const radioInput = this.querySelector('input[type="radio"]');
                radioInput.checked = true;
                
                // Clear error message if any
                document.getElementById('fieldError').textContent = '';
            }
        });
    });
}

// Xác thực form đặt sân
function validateForm() {
    let isValid = true;
    const name = document.getElementById('bookingName').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    const selectedField = document.querySelector('input[name="field"]:checked');
    
    // Xác thực tên
    if (name === '') {
        document.getElementById('nameError').textContent = 'Vui lòng nhập họ và tên';
        isValid = false;
    } else {
        document.getElementById('nameError').textContent = '';
    }
    
    // Xác thực số điện thoại (định dạng Việt Nam)
    if (phone === '') {
        document.getElementById('phoneError').textContent = 'Vui lòng nhập số điện thoại';
        isValid = false;
    } else if (!isValidPhone(phone)) {
        document.getElementById('phoneError').textContent = 'Số điện thoại không hợp lệ';
        isValid = false;
    } else {
        document.getElementById('phoneError').textContent = '';
    }
    
    // Xác thực chọn sân
    if (!selectedField) {
        document.getElementById('fieldError').textContent = 'Vui lòng chọn sân';
        isValid = false;
    } else {
        document.getElementById('fieldError').textContent = '';
    }
    
    return isValid;
}

// Kiểm tra định dạng số điện thoại Việt Nam
function isValidPhone(phone) {
    const PhoneRegex = /(^(0)[0-9]{9}$)|(^(84)[0-9]{9}$)|(^(\+84)[0-9]{9}$)/;
    return PhoneRegex.test(phone);
}

// Thêm sự kiện để kiểm tra số điện thoại khi người dùng đang nhập
function setupPhoneValidation() {
    const phoneInput = document.getElementById('bookingPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            const phone = this.value.trim();
            if (phone && !isValidPhone(phone)) {
                document.getElementById('phoneError').textContent = 'Số điện thoại không hợp lệ';
            } else {
                document.getElementById('phoneError').textContent = '';
            }
        });
    }
}

// Reset form
function resetForm() {
    document.getElementById('bookingName').value = '';
    document.getElementById('bookingPhone').value = '';
    document.getElementById('nameError').textContent = '';
    document.getElementById('phoneError').textContent = '';
    document.getElementById('fieldError').textContent = '';    
    // Bỏ chọn tất cả các sân
    document.querySelectorAll('.field-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    document.querySelectorAll('input[name="field"]').forEach(input => {
        input.checked = false;
    });
}

// opponent.html
// Biến để lưu thông tin bài đăng hiện tại đang xem
let currentPostData = null;
// Dữ liệu mẫu cho các bài post
let samplePosts = [
        {
            teamName: "FC Thủ Đô",
            memberCount: 7,
            matchType: "Nam",
            skillLevel: "Khá",
            matchTime: "2023-07-21T19:00",
            field: "none",
            phoneNumber: "0987654321",
            postPassword: "123456",
            postDescription: "Nhóm chúng tôi hiện có 7 thành viên đang tìm kiếm thêm 3 người nữa để tham gia cùng đội, nhằm chuẩn bị cho một trận đấu bóng đá. Chúng tôi là một đội chơi ở mức trình độ bán chuyên, với kinh nghiệm thi đấu khá ổn định và tinh thần đồng đội cao.Nhóm chúng tôi hiện có 7 thành viên đang tìm kiếm thêm 3 người nữa để tham gia cùng đội, nhằm chuẩn bị cho một trận đấu bóng đá. Chúng tôi là một đội chơi ở mức trình độ bán chuyên, với kinh nghiệm thi đấu khá ổn định và tinh thần đồng đội cao.",
            createDate: "15/06/2023 08:30"
        },
        {
            teamName: "Đại học Bách Khoa FC",
            memberCount: 12,
            matchType: "Nam",
            skillLevel: "Trung bình",
            matchTime: "2023-07-15T16:00",
            field: "B",
            phoneNumber: "0123456789",
            postPassword: "123456",
            postDescription: "Đội bóng sinh viên đại học cần tìm đối thủ để giao lưu vào cuối tuần. Chúng tôi có 12 thành viên, chơi theo phong cách kỹ thuật, tốc độ. Có thể đá sân 7 hoặc sân 11.",
            createDate: "12/06/2023 14:20"
        },
        {
            teamName: "ABC Software",
            memberCount: 10,
            matchType: "Nam",
            skillLevel: "Giỏi",
            matchTime: "2023-07-19T18:30",
            field: "A",
            phoneNumber: "0888123456",
            postPassword: "123456",
            postDescription: "Đội bóng công ty phần mềm ABC cần tìm đối giao hữu vào tối thứ 4 hàng tuần. Chúng tôi chơi sân 7, đã có kinh nghiệm thi đấu phong trào.",
            createDate: "10/06/2023 16:45"
        },
        {
            teamName: "Phượng Hoàng FC",
            memberCount: 9,
            matchType: "Nữ",
            skillLevel: "Mới chơi",
            matchTime: "2023-07-23T08:00",
            field: "C",
            phoneNumber: "0912345678",
            postPassword: "123456",
            postDescription: "Nhóm bạn thân cần tìm đối đá giao lưu vào sáng Chủ nhật. Chúng tôi là những người đam mê bóng đá, chơi với tinh thần vui vẻ, thoải mái.",
            createDate: "08/06/2023 09:10"
        },
        {
            teamName: "FC Láng Hạ",
            memberCount: 15,
            matchType: "Nam",
            skillLevel: "Chuyên nghiệp",
            matchTime: "2023-07-22T19:30",
            field: "D",
            phoneNumber: "0323456789",
            postPassword: "123456",
            postDescription: "CLB bóng đá khu phố đang tìm đối tác để giao hữu vào tối thứ 7 này. Đội chúng tôi có 15 thành viên, tuổi từ 25-35, trình độ khá, đã tham gia nhiều giải phong trào.",
            createDate: "05/06/2023 17:30"
        },
        {
            teamName: "Đại học Ngoại Thương FC",
            memberCount: 11,
            matchType: "Nam",
            skillLevel: "Khá",
            matchTime: "2023-07-18T17:00",
            field: "none",
            phoneNumber: "0936789123",
            postPassword: "123456",
            postDescription: "Đội bóng sinh viên Đại học Ngoại Thương tìm đối đá giao lưu. Chúng tôi có thể chơi sân 7 hoặc sân 11, ưu tiên các đội bóng sinh viên hoặc các đội có trình độ tương đương.Đội bóng sinh viên Đại học Ngoại Thương tìm đối đá giao lưu. Chúng tôi có thể chơi sân 7 hoặc sân 11, ưu tiên các đội bóng sinh viên hoặc các đội có trình độ tương đương.",
            createDate: "03/06/2023 10:15"
        }
    ];

// Hàm tạo các post tìm đối
function initializeOpponentPosts() {
    generatePosts();
    setupRegisterForm();
    setupPostDetailEvents();
}

// Tạo các post trong trang tìm đối
function generatePosts() {
    const postContainer = document.querySelector('.post-container');
    if (!postContainer) {
        console.error('Post container not found');
        return;
    }
    
    console.log(`Generating ${samplePosts.length} posts`);
    
    // Xóa hết nội dung hiện tại
    postContainer.innerHTML = '';
    
    // Tạo các post
    for (let i = 0; i < samplePosts.length; i++) {
        try {
            // Lấy dữ liệu từ mảng mẫu
            const postData = samplePosts[i];
            
            // Tạo ID ngẫu nhiên cho bài đăng
            const postId = new Date().getTime() + i;
            
            // Tạo container cho post
            const postCell = document.createElement('div');
            postCell.className = 'post-cell';
            postCell.dataset.postId = postId;
            
            // Tạo phần nội dung post
            const postItem = document.createElement('div');
            postItem.className = 'post-item';
            
            // Tạo phần text
            const postText = document.createElement('p');
            postText.className = 'post-text';
            
            // Định dạng thời gian hiển thị
            const matchDate = new Date(postData.matchTime);
            const formattedDate = matchDate.toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Tạo nội dung tóm tắt
            postText.textContent = `${postData.teamName} (${postData.memberCount} thành viên, trình độ ${postData.skillLevel.toLowerCase()}) đang tìm đối đá ${postData.matchType} vào lúc ${formattedDate}. ${postData.field !== 'none' ? `Sân đá: Sân ${postData.field}` : ''} ${postData.postDescription}`;
            
            // Tạo nút chi tiết
            const postButton = document.createElement('button');
            postButton.className = 'post-button';
            postButton.textContent = 'Chi tiết';
            
            // Thêm sự kiện cho nút chi tiết
            postButton.addEventListener('click', function() {
                showPostDetail(postData, postId);
            });
            
            // Ghép các phần tử lại với nhau
            postItem.appendChild(postText);
            postCell.appendChild(postItem);
            postCell.appendChild(postButton);
            
            // Lưu dữ liệu bài đăng vào data attribute để truy xuất sau này
            postCell.dataset.postData = JSON.stringify(postData);
            
            // Thêm vào container
            postContainer.appendChild(postCell);
            
        } catch (error) {
            console.error(`Error generating post ${i}:`, error);
        }
    }
    
    console.log(`${postContainer.children.length} posts displayed`);
}

// Thiết lập form đăng ký tìm đối
function setupRegisterForm() {
    const openRegisterBtn = document.getElementById('openRegisterForm');
    const registerOverlay = document.getElementById('registerOverlay');
    const closeFormBtn = document.getElementById('closeRegisterBtn');
    const cancelRegisterBtn = document.getElementById('cancelRegister');
    const confirmRegisterBtn = document.getElementById('confirmRegister');
    
    // Định dạng mặc định cho input thời gian
    const matchTimeInput = document.getElementById('matchTime');
    if (matchTimeInput) {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        // Định dạng giờ cho datetime-local input
        matchTimeInput.min = now.toISOString().slice(0, 16);
    }

    // Hiển thị form khi nhấn nút Đăng ký tìm đối
    if (openRegisterBtn) {
        openRegisterBtn.addEventListener('click', () => {
            console.log('Open register button clicked');
            registerOverlay.style.display = 'flex';
        });
    } else {
        console.error('openRegisterBtn not found');
    }
    
    // Đóng form khi nhấn nút X
    if (closeFormBtn) {
        closeFormBtn.addEventListener('click', () => {
            console.log('Close form button clicked');
            registerOverlay.style.display = 'none';
        });
    } else {
        console.error('closeFormBtn with ID closeRegisterBtn not found');
    }
    
    // Đóng form khi nhấn nút Hủy
    if (cancelRegisterBtn) {
        cancelRegisterBtn.addEventListener('click', () => {
            console.log('Cancel register button clicked');
            registerOverlay.style.display = 'none';
        });
    } else {
        console.error('cancelRegisterBtn not found');
    }

    // Xử lý sự kiện khi click vào option sân
    setupFieldSelectionHandlersForRegister();

    // Xử lý khi nhấn nút Đăng ký
    if (confirmRegisterBtn) {
        confirmRegisterBtn.addEventListener('click', () => {
            console.log('Confirm register button clicked');
            try {
                const isValid = validateRegisterForm();
                console.log('Form validation result:', isValid);
                
                if (isValid) {
                    // Thu thập dữ liệu từ form
                    const formData = collectFormData();
                    console.log('Collected form data:', formData);
                    
                    // Hiển thị thông báo thành công
                    window.alert('Đăng ký tìm đối thành công!');
                    
                    // Reset form
                    resetRegisterForm();
                    
                    // Đóng form
                    registerOverlay.style.display = 'none';
                    
                    // Thêm bài đăng mới vào mảng
                    samplePosts.push(formData);
                    console.log('Added new post to samplePosts array');
                    
                    // Tạo lại danh sách bài đăng
                    generatePosts();
                    console.log('Posts regenerated');
                }
            } catch (error) {
                console.error('Error in confirm register handler:', error);
            }
        });
    } else {
        console.error('confirmRegisterBtn not found');
    }
    
    // Đóng form khi click ra ngoài
    registerOverlay.addEventListener('click', (e) => {
        if (e.target === registerOverlay) {
            registerOverlay.style.display = 'none';
        }
    });
}

// Thiết lập sự kiện cho các option sân trong form đăng ký
function setupFieldSelectionHandlersForRegister() {
    const fieldOptions = document.querySelectorAll('.register-form .field-option');
    
    fieldOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radioInput = this.querySelector('input[type="radio"]');
            if (!radioInput.disabled) {
                radioInput.checked = true;
                
                // Cập nhật trạng thái selected cho UI
                fieldOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            }
        });
    });
}

// Xác thực form đăng ký
function validateRegisterForm() {
    let isValid = true;
    
    // Xác thực tên đội/nhóm
    const teamName = document.getElementById('teamName');
    const teamNameError = document.getElementById('teamNameError');
    if (!teamName.value.trim()) {
        teamNameError.textContent = 'Vui lòng nhập tên đội/nhóm';
        isValid = false;
    } else {
        teamNameError.textContent = '';
    }
    
    // Xác thực số lượng thành viên
    const memberCount = document.getElementById('memberCount');
    const memberCountError = document.getElementById('memberCountError');
    if (!memberCount.value || memberCount.value < 1) {
        memberCountError.textContent = 'Số lượng thành viên phải lớn hơn 0';
        isValid = false;
    } else {
        memberCountError.textContent = '';
    }
    
    // Xác thực hình thức
    const matchType = document.getElementById('matchType');
    const matchTypeError = document.getElementById('matchTypeError');
    if (!matchType.value) {
        matchTypeError.textContent = 'Vui lòng chọn hình thức';
        isValid = false;
    } else {
        matchTypeError.textContent = '';
    }
    
    // Xác thực trình độ
    const skillLevel = document.getElementById('skillLevel');
    const skillLevelError = document.getElementById('skillLevelError');
    if (!skillLevel.value) {
        skillLevelError.textContent = 'Vui lòng chọn trình độ';
        isValid = false;
    } else {
        skillLevelError.textContent = '';
    }
    
    // Xác thực thời gian
    const matchTime = document.getElementById('matchTime');
    const matchTimeError = document.getElementById('matchTimeError');
    if (!matchTime.value) {
        matchTimeError.textContent = 'Vui lòng chọn thời gian';
        isValid = false;
    } else {
        matchTimeError.textContent = '';
    }
    
    // Xác thực số điện thoại
    const phoneNumber = document.getElementById('phoneNumber');
    const phoneNumberError = document.getElementById('phoneNumberError');
    const phoneRegex = /^(0[3|5|7|8|9][0-9]{8}|(\+84|84)[3|5|7|8|9][0-9]{8})$/;
    if (!phoneNumber.value.trim()) {
        phoneNumberError.textContent = 'Vui lòng nhập số điện thoại';
        isValid = false;
    } else if (!phoneRegex.test(phoneNumber.value.trim())) {
        phoneNumberError.textContent = 'Số điện thoại không hợp lệ';
        isValid = false;
    } else {
        phoneNumberError.textContent = '';
    }
    
    // Xác thực mật khẩu
    const postPassword = document.getElementById('postPassword');
    const postPasswordError = document.getElementById('postPasswordError');
    if (!postPassword.value.trim()) {
        postPasswordError.textContent = 'Vui lòng nhập mật khẩu';
        isValid = false;
    } else if (postPassword.value.length < 6) {
        postPasswordError.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
        isValid = false;
    } else {
        postPasswordError.textContent = '';
    }
    return isValid;
}

// Thu thập dữ liệu từ form
function collectFormData() {
    const teamName = document.getElementById('teamName').value;
    const memberCount = document.getElementById('memberCount').value;
    const matchType = document.getElementById('matchType').value;
    const skillLevel = document.getElementById('skillLevel').value;
    const matchTime = document.getElementById('matchTime').value;
    const selectedField = document.querySelector('input[name="field"]:checked');
    const phoneNumber = document.getElementById('phoneNumber').value;
    const postPassword = document.getElementById('postPassword').value;
    const postDescription = document.getElementById('postDescription').value;
    
    return {
        teamName,
        memberCount,
        matchType,
        skillLevel,
        matchTime,
        field: selectedField ? selectedField.value : 'none',
        phoneNumber,
        postPassword,
        postDescription,
        createDate: new Date().toLocaleString()
    };
}

// Reset form về giá trị mặc định
function resetRegisterForm() {
    document.getElementById('teamName').value = '';
    document.getElementById('memberCount').value = '5';
    document.getElementById('matchType').value = '';
    document.getElementById('skillLevel').value = '';
    document.getElementById('matchTime').value = '';
    
    // Check if fieldNone exists first
    const fieldNone = document.getElementById('fieldNone');
    if (fieldNone) {
        fieldNone.checked = true;
    }
    
    document.getElementById('phoneNumber').value = '';
    document.getElementById('postPassword').value = '';
    document.getElementById('postDescription').value = '';
    
    // Reset các thông báo lỗi
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.textContent = '');
    
    // Reset trạng thái các option sân
    const fieldOptions = document.querySelectorAll('.register-form .field-option');
    fieldOptions.forEach(option => option.classList.remove('selected'));
    
    // Safely select and update the "none" field option
    const noneFieldOption = document.querySelector('.field-option[data-field="none"]');
    if (noneFieldOption) {
        noneFieldOption.classList.add('selected');
    }
}

// Hiển thị chi tiết bài đăng
function showPostDetail(postData, postId) {
    // Lưu thông tin bài đăng hiện tại để sử dụng sau này (xóa bài)
    currentPostData = {
        data: postData,
        id: postId
    };
    
    // Lấy các phần tử DOM
    const postDetailOverlay = document.getElementById('postDetailOverlay');
    const postDescriptionDetail = document.querySelector('.post-description-detail');
    const detailTeamName = document.getElementById('detailTeamName');
    const detailMemberCount = document.getElementById('detailMemberCount');
    const detailMatchType = document.getElementById('detailMatchType');
    const detailSkillLevel = document.getElementById('detailSkillLevel');
    const detailMatchTime = document.getElementById('detailMatchTime');
    const detailField = document.getElementById('detailField');
    const detailPhoneNumber = document.getElementById('detailPhoneNumber');
    const detailCreateDate = document.getElementById('detailCreateDate');
    
    postDescriptionDetail.textContent = postData.postDescription;

    // Kiểm tra nếu nội dung cần cuộn
    setTimeout(() => {
        // Sử dụng setTimeout để đảm bảo nội dung đã được render
        if (postDescriptionDetail.scrollHeight > postDescriptionDetail.clientHeight) {
            postDescriptionDetail.classList.add('scrollable');
        } else {
            postDescriptionDetail.classList.remove('scrollable');
        }
    }, 0);
    
    // Cập nhật thông tin chi tiết
    detailTeamName.textContent = postData.teamName;
    detailMemberCount.textContent = postData.memberCount;
    detailMatchType.textContent = postData.matchType;
    detailSkillLevel.textContent = postData.skillLevel;
    
    // Định dạng thời gian
    const matchDate = new Date(postData.matchTime);
    const formattedDate = matchDate.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    detailMatchTime.textContent = formattedDate;
    
    // Hiển thị sân
    detailField.textContent = postData.field !== 'none' ? `Sân ${postData.field}` : 'Không chọn sân';
    
    // Hiển thị số điện thoại
    detailPhoneNumber.textContent = postData.phoneNumber;
    
    // Hiển thị ngày tạo
    detailCreateDate.textContent = postData.createDate;
    
    // Hiển thị overlay
    postDetailOverlay.style.display = 'flex';
    
    // Reset form xóa bài
    document.getElementById('deletePostPassword').value = '';
    document.getElementById('deletePostError').textContent = '';
}

// Khởi tạo sự kiện cho form chi tiết bài đăng
function setupPostDetailEvents() {
    const postDetailOverlay = document.getElementById('postDetailOverlay');
    const closeDetailBtn = document.getElementById('closeDetailBtn');
    const closePostDetail = document.getElementById('closePostDetail');
    const deletePostBtn = document.getElementById('deletePostBtn');
    
    // Đóng form khi click nút X
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', () => {
            postDetailOverlay.style.display = 'none';
        });
    }
    
    // Đóng form khi click nút Đóng
    if (closePostDetail) {
        closePostDetail.addEventListener('click', () => {
            postDetailOverlay.style.display = 'none';
        });
    }
    
    // Đóng form khi click ra ngoài
    postDetailOverlay.addEventListener('click', (e) => {
        if (e.target === postDetailOverlay) {
            postDetailOverlay.style.display = 'none';
        }
    });
    
    // Xử lý khi click nút xóa bài đăng
    if (deletePostBtn) {
        deletePostBtn.addEventListener('click', deletePost);
    }
}

// Xóa bài đăng
function deletePost() {
    const passwordInput = document.getElementById('deletePostPassword');
    const errorMessage = document.getElementById('deletePostError');
    
    // Kiểm tra mật khẩu
    if (!passwordInput.value) {
        errorMessage.textContent = 'Vui lòng nhập mật khẩu';
        return;
    }
    
    // Kiểm tra mật khẩu có đúng không
    if (currentPostData && passwordInput.value === currentPostData.data.postPassword) {
        // Tìm bài đăng cần xóa
        const postToDelete = document.querySelector(`.post-cell[data-post-id="${currentPostData.id}"]`);
        if (postToDelete) {
            // Xóa bài đăng
            postToDelete.remove();
            
            // Đóng form chi tiết
            document.getElementById('postDetailOverlay').style.display = 'none';
            
            // Hiển thị thông báo thành công
            alert('Bài đăng đã được xóa thành công!');
        } else {
            errorMessage.textContent = 'Không tìm thấy bài đăng';
        }
    } else {
        errorMessage.textContent = 'Mật khẩu không đúng';
    }
}

// services.html
let cartData = [];
function initializeServices() {
    setupPaginationEat();
    setupPaginationWear();
    setupTagEat();
    setupTagWear();
    setupCart();
}

// Phân trang gọi đồ ăn uống
function setupPaginationEat() {
    const eatPage = document.getElementById('eat-page');

    const eatData = [
        {
            name: "Cơm gà xối mỡ",
            price: 35000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Bún chả",
            price: 30000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Phở bò tái nạm",
            price: 40000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Bánh mì thịt nguội",
            price: 25000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Cơm rang dưa bò",
            price: 30000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Bún bò Huế",
            price: 35000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Mỳ xào hải sản",
            price: 38000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Cà phê đen đá",
            price: 12000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Cà phê sữa đá",
            price: 15000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Trà chanh",
            price: 10000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Trà đào cam sả",
            price: 18000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Nước ép cam tươi",
            price: 20000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Sinh tố bơ",
            price: 25000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Bánh flan",
            price: 10000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Chè đậu xanh",
            price: 15000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Xôi gà",
            price: 25000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Bánh cuốn nóng",
            price: 20000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Miến trộn",
            price: 25000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Cơm sườn chua ngọt",
            price: 35000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Bún đậu mắm tôm",
            price: 35000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Cháo gà",
            price: 25000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Nem chua rán",
            price: 15000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Sữa chua nếp cẩm",
            price: 18000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Chè thái",
            price: 20000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Lẩu tự chọn (1 người)",
            price: 70000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Nước ngọt các loại",
            price: 12000,
            image: "assets/images/meal.png",
            quantity: 1
        },
        {
            name: "Bánh mì trứng",
            price: 15000,
            image: "assets/images/meal.png",
            quantity: 1
        }
    ];
    
    // Phân trang
    const itemsPerPage = 15;
    let currentPage = 1;
    const totalPages = Math.ceil(eatData.length / itemsPerPage);

    // Lấy các phần tử điều hướng trang cho EAT section
    const eatPaginationContainer = document.querySelector('.pagination-container');
    const eatUpButton = eatPaginationContainer.querySelector('.up-button');
    const eatDownButton = eatPaginationContainer.querySelector('.down-button');
    const eatPageNumber = eatPaginationContainer.querySelector('.page-number');

    // Cập nhật số trang hiển thị cho EAT section
    function updatePageNumber() {
        eatPageNumber.textContent = currentPage;
    }

    // Tải nội dung trang cho EAT section
    function loadPageContent(page) {
        eatPage.innerHTML = '';
        
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = eatData.slice(start, Math.min(end, eatData.length));
        
        pageItems.forEach(item => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';
            
            // Tạo container cho ảnh để đảm bảo chiếm tỷ lệ cố định
            const imageContainer = document.createElement('div');
            imageContainer.className = 'service-image-container';
            
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;
            img.onerror = function() {
                this.src = 'assets/images/image-placeholder.png'; // Ảnh thay thế khi không tải được
                this.onerror = null;
            };
            
            imageContainer.appendChild(img);
            serviceItem.appendChild(imageContainer);
            
            const content = document.createElement('div');
            content.className = 'service-content';
            
            const title = document.createElement('h3');
            title.textContent = item.name;
            title.title = item.name;
            
            const priceContainer = document.createElement('div');
            priceContainer.className = 'service-price';
            
            const price = document.createElement('p');
            price.textContent = new Intl.NumberFormat('vi-VN').format(item.price) + 'đ';
            
            const addButton = document.createElement('button');
            addButton.className = 'add-button';
            addButton.textContent = '+';
            
            priceContainer.appendChild(price);
            priceContainer.appendChild(addButton);
            
            content.appendChild(title);
            content.appendChild(priceContainer);
            
            serviceItem.appendChild(content);
            
            eatPage.appendChild(serviceItem);
        });
    }

    // Load trang đầu tiên
    loadPageContent(currentPage);
    updatePageNumber();

    // Các sự kiện nút điều hướng cho EAT section
    eatUpButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadPageContent(currentPage);
            updatePageNumber();
        }
    });

    eatDownButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadPageContent(currentPage);
            updatePageNumber();
        }
    });

    // Thêm sản phẩm vào giỏ hàng
    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceItem = this.closest('.service-item');
            const itemName = serviceItem.querySelector('.service-content h3').textContent;
            const itemPrice = serviceItem.querySelector('.service-price p').textContent;
            const itemImage = serviceItem.querySelector('.service-image-container img').src;

            const product = {
                name: itemName,
                price: itemPrice,
                image: itemImage,
                quantity: 1
            }

            const exitIndex = cartData.findIndex(item => item.name === itemName);
            if(exitIndex !== -1) {
                cartData[exitIndex].quantity += 1;
            }else {
                cartData.push(product);
            }
            updateCartDisplay();
        });
    });
}

// Phân trang thuê đồ
function setupPaginationWear() {
    const wearPage = document.getElementById('wear-page');

    const wearData = [
        {
            name: "Giày đá bóng Nike Tiempo",
            price: 150000,
            image: "assets/images/GiayTheThao.png",
            quantity: 1
        },
        {
            name: "Giày đá bóng Adidas Copa",
            price: 120000,
            image: "assets/images/GiayTheThao.png",
            quantity: 1
        },
        {
            name: "Giày đá bóng Puma Future",
            price: 135000,
            image: "assets/images/GiayTheThao.png",
            quantity: 1
        },
        {
            name: "Áo đấu câu lạc bộ",
            price: 80000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Áo đấu Manchester United",
            price: 90000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Áo đấu Liverpool",
            price: 90000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Áo đấu Barcelona",
            price: 90000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Áo thủ môn",
            price: 95000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Quần đá bóng Nike",
            price: 60000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Găng tay thủ môn",
            price: 120000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Bóng đá size 5",
            price: 150000,
            image: "assets/images/ball2.png",
            quantity: 1
        },
        {
            name: "Bóng đá size 4",
            price: 125000,
            image: "assets/images/ball2.png",
            quantity: 1
        },
        {
            name: "Tất thể thao cao cấp",
            price: 25000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Vớ đá bóng dài",
            price: 30000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Balo thể thao",
            price: 50000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Bình nước thể thao",
            price: 35000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Băng đô thể thao",
            price: 15000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Đầu gối bảo vệ",
            price: 45000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Nẹp cổ chân",
            price: 40000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Túi đựng giày",
            price: 55000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Đệm bảo vệ ống quyển",
            price: 35000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Dụng cụ đánh dấu sân",
            price: 25000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        },
        {
            name: "Cờ góc sân",
            price: 50000,
            image: "assets/images/soccerBall.png",
            quantity: 1
        }
    ];    

    // Phân trang
    const itemsPerPage = 15;
    let currentPage = 1;
    const totalPages = Math.ceil(wearData.length / itemsPerPage);

    // Lấy các phần tử điều hướng trang cho WEAR section
    const wearPaginationContainer = document.querySelector('.pagination-container-02');
    const wearUpButton = wearPaginationContainer.querySelector('.up-button');
    const wearDownButton = wearPaginationContainer.querySelector('.down-button');
    const wearPageNumber = wearPaginationContainer.querySelector('.page-number');

    // Cập nhật số trang hiển thị cho WEAR section
    function updatePageNumber() {
        wearPageNumber.textContent = currentPage;
    }

    // Tải nội dung trang cho WEAR section
    function loadPageContent(page) {
        wearPage.innerHTML = '';
        
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = wearData.slice(start, Math.min(end, wearData.length));
        
        pageItems.forEach(item => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';
            
            // Tạo container cho ảnh để đảm bảo chiếm tỷ lệ cố định
            const imageContainer = document.createElement('div');
            imageContainer.className = 'service-image-container';
            
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;
            img.onerror = function() {
                this.src = 'assets/images/image-placeholder.png'; // Ảnh thay thế khi không tải được
                this.onerror = null;
            };
            
            imageContainer.appendChild(img);
            serviceItem.appendChild(imageContainer);
            
            const content = document.createElement('div');
            content.className = 'service-content';
            
            const title = document.createElement('h3');
            title.textContent = item.name;
            title.title = item.name;
            
            const priceContainer = document.createElement('div');
            priceContainer.className = 'service-price';
            
            const price = document.createElement('p');
            price.textContent = new Intl.NumberFormat('vi-VN').format(item.price) + 'đ';
            
            const addButton = document.createElement('button');
            addButton.className = 'add-button';
            addButton.textContent = '+';
            
            priceContainer.appendChild(price);
            priceContainer.appendChild(addButton);
            
            content.appendChild(title);
            content.appendChild(priceContainer);
            
            serviceItem.appendChild(content);
            
            wearPage.appendChild(serviceItem);
        });
    }

    // Load trang đầu tiên
    loadPageContent(currentPage);
    updatePageNumber();

    // Các sự kiện nút điều hướng cho WEAR section
    wearUpButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadPageContent(currentPage);
            updatePageNumber();
        }
    });

    wearDownButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadPageContent(currentPage);
            updatePageNumber();
        }
    });

    // Thêm sản phẩm vào giỏ hàng
    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceItem = this.closest('.service-item');
            const itemName = serviceItem.querySelector('.service-content h3').textContent;
            const itemPrice = serviceItem.querySelector('.service-price p').textContent;
            const itemImage = serviceItem.querySelector('.service-image-container img').src;

            const product = {
                name: itemName,
                price: itemPrice,
                image: itemImage,
                quantity: 1
            }

            const exitIndex = cartData.findIndex(item => item.name === itemName);
            if(exitIndex !== -1) {
                cartData[exitIndex].quantity += 1;
            }else {
                cartData.push(product);
            }
            updateCartDisplay();
        });
    });
}

function updateCartDisplay() {
    const productList = document.querySelector('.product-list');
    const totalQuantityElem = document.getElementById('total-quantity');
    const totalPriceElem = document.getElementById('total-price');
    
    // Xóa nội dung cũ
    productList.innerHTML = '';
    
    // Biến lưu tổng số lượng và tổng tiền
    let totalQuantity = 0;
    let totalPrice = 0;
    
    // Hiển thị từng sản phẩm trong giỏ hàng
    cartData.forEach((item, index) => {
        // Tính toán thành tiền cho sản phẩm
        const priceValue = parseFloat(item.price.replace(/[^\d]/g, ''));
        const itemTotal = priceValue * item.quantity;
        
        // Cập nhật tổng số lượng và tổng tiền
        totalQuantity += item.quantity;
        totalPrice += itemTotal;
        
        // Tạo HTML cho sản phẩm
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        // Phần thông tin sản phẩm (hình ảnh, tên, giá)
        const productInfo = document.createElement('div');
        productInfo.className = 'product-info';
        
        const productImage = document.createElement('img');
        productImage.className = 'product-image';
        productImage.src = item.image;
        productImage.alt = item.name;
        
        const productDetails = document.createElement('div');
        productDetails.className = 'product-details';
        
        const productName = document.createElement('div');
        productName.className = 'product-name';
        productName.textContent = item.name;
        
        const productPrice = document.createElement('div');
        productPrice.className = 'product-price';
        productPrice.textContent = item.price;
        
        productDetails.appendChild(productName);
        productDetails.appendChild(productPrice);
        
        productInfo.appendChild(productImage);
        productInfo.appendChild(productDetails);
        
        // Phần điều khiển số lượng
        const quantityControl = document.createElement('div');
        quantityControl.className = 'quantity-control';
        
        const decreaseBtn = document.createElement('div');
        decreaseBtn.className = 'quantity-btn';
        decreaseBtn.textContent = '−';
        decreaseBtn.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
                updateCartDisplay();
            }
        });
        
        const quantityInput = document.createElement('input');
        quantityInput.className = 'quantity-input';
        quantityInput.type = 'number';
        quantityInput.min = '1';
        quantityInput.value = item.quantity;
        quantityInput.addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value);
            if (newQuantity && newQuantity > 0) {
                item.quantity = newQuantity;
            } else {
                e.target.value = item.quantity;
            }
            updateCartDisplay();
        });
        
        const increaseBtn = document.createElement('div');
        increaseBtn.className = 'quantity-btn';
        increaseBtn.textContent = '+';
        increaseBtn.addEventListener('click', () => {
            item.quantity++;
            updateCartDisplay();
        });
        
        // Nút xóa sản phẩm
        const removeBtn = document.createElement('div');
        removeBtn.className = 'product-remove';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
        removeBtn.addEventListener('click', () => {
            cartData.splice(index, 1);
            updateCartDisplay();
        });
        
        quantityControl.appendChild(decreaseBtn);
        quantityControl.appendChild(quantityInput);
        quantityControl.appendChild(increaseBtn);
        quantityControl.appendChild(removeBtn);
        
        // Thêm các thành phần vào sản phẩm
        productItem.appendChild(productInfo);
        productItem.appendChild(quantityControl);
        
        // Thêm sản phẩm vào danh sách
        productList.appendChild(productItem);
    });
    
    // Cập nhật tổng số lượng và tổng tiền
    totalQuantityElem.textContent = totalQuantity;
    totalPriceElem.textContent = new Intl.NumberFormat('vi-VN').format(totalPrice) + '₫';
}

function setupTagEat() {
    const eatBtn = document.getElementById('eat-btn');
    eatBtn.addEventListener('click', function() {
        // Cuộn trang lên đầu
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function setupTagWear() {
    const wearBtn = document.getElementById('wear-btn');
    wearBtn.addEventListener('click', function() {
        // Cuộn xuống phần dưới của trang
        window.scrollTo({
            top: document.body.scrollHeight, // Cuộn đến cuối trang
            behavior: 'smooth'
        });
    });
}

function setupCart() {
    const cartBtn = document.getElementById('cart-btn');
    const cartPage = document.getElementById('cart-page');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const paymentButton = document.querySelector('.payment-button');
    const locationButtons = document.querySelectorAll('.location-button');
    
    // Xử lý sự kiện khi chọn địa điểm
    locationButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Bỏ active tất cả các nút
            locationButtons.forEach(btn => btn.classList.remove('active'));
            
            // Đặt active cho nút được chọn
            this.classList.add('active');
            
            // Cập nhật giá trị cho input ẩn
            document.getElementById('selected-location').value = this.getAttribute('data-value');
            
            // Xóa thông báo lỗi nếu có
            document.getElementById('locationError').textContent = '';
        });
    });
    
    // Hiển thị giỏ hàng khi nhấp vào nút giỏ hàng
    cartBtn.addEventListener('click', function() {
        if (cartData.length > 0) {
            cartPage.classList.add('show');
            cartOverlay.style.display = 'block';
            cartBtn.classList.add('active');
        } else {
            // Thông báo "Vui lòng thêm sản phẩm vào giỏ hàng!"
            const alertAddProduct = document.createElement('div');
            alertAddProduct.className = 'alert-add-product';

            const alertText = document.createElement('p');
            alertText.textContent = 'Vui lòng thêm sản phẩm vào giỏ hàng!';

            const alertIcon = document.createElement('i');
            alertIcon.className = 'fas fa-exclamation-triangle';
            alertIcon.style.color = '#d84a02';
            alertIcon.style.marginRight = '8px';

            alertAddProduct.appendChild(alertIcon);
            alertAddProduct.appendChild(alertText);

            document.body.appendChild(alertAddProduct);
            alertAddProduct.style.display = 'flex';
            
            setTimeout(() => {
                alertAddProduct.style.display = 'none';
                document.body.removeChild(alertAddProduct);
            }, 2000);
        }
    });

    // Đóng giỏ hàng khi nhấp vào nút đóng
    closeCartBtn.addEventListener('click', function() {
        cartPage.classList.remove('show');
        cartOverlay.style.display = 'none';
        cartBtn.classList.remove('active');
    });
    
    // Đóng giỏ hàng khi nhấp vào lớp phủ
    cartOverlay.addEventListener('click', function() {
        cartPage.classList.remove('show');
        cartOverlay.style.display = 'none';
        cartBtn.classList.remove('active');
    });
    
    // Xử lý thông báo lỗi khi nhập liệu
    const customerName = document.getElementById('customer-name');
    const customerPhone = document.getElementById('customer-phone');
    
    customerName.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            document.getElementById('customerNameError').textContent = '';
        }
    });
    
    customerPhone.addEventListener('input', function() {
        const phone = this.value.trim();
        if (phone === '') {
            document.getElementById('customerPhoneError').textContent = '';
        } else if (!isValidPhone(phone)) {
            document.getElementById('customerPhoneError').textContent = 'Số điện thoại không hợp lệ';
        } else {
            document.getElementById('customerPhoneError').textContent = '';
        }
    });
    
    // Xử lý thanh toán
    if (paymentButton) {
        paymentButton.addEventListener('click', function() {
            let isValid = true;
            
            // Kiểm tra họ tên
            const customerName = document.getElementById('customer-name').value.trim();
            if (!customerName) {
                document.getElementById('customerNameError').textContent = 'Vui lòng nhập họ và tên';
                isValid = false;
            } else {
                document.getElementById('customerNameError').textContent = '';
            }
            
            // Kiểm tra số điện thoại
            const customerPhone = document.getElementById('customer-phone').value.trim();
            if (!customerPhone) {
                document.getElementById('customerPhoneError').textContent = 'Vui lòng nhập số điện thoại';
                isValid = false;
            } else if (!isValidPhone(customerPhone)) {
                document.getElementById('customerPhoneError').textContent = 'Số điện thoại không hợp lệ';
                isValid = false;
            } else {
                document.getElementById('customerPhoneError').textContent = '';
            }
            
            // Kiểm tra địa điểm phục vụ
            const selectedLocation = document.getElementById('selected-location').value;
            if (!selectedLocation) {
                document.getElementById('locationError').textContent = 'Vui lòng chọn địa điểm phục vụ';
                isValid = false;
            } else {
                document.getElementById('locationError').textContent = '';
            }
            
            // Nếu thông tin hợp lệ, tiến hành thanh toán
            if (isValid) {
                // Hiển thị mã QR
                const cartQR = document.getElementById('cart-qr-Overlay');
                const cartOverlay = document.querySelector('.cart-overlay');
                // Cập nhật URL của mã QR với giá tiền thực tế
                const cartQRCodeImg = document.querySelector('.cart-qr-code img');
                const totalPrice = document.getElementById('total-price').textContent.replace(/\D/g, '');
                if (!cartQRCodeImg) {
                    console.error("QR code image element not found!");
                } else {
                    console.log("QR code image found");
                    const addInfo = `${customerName} ${customerPhone} ${selectedLocation} ${new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
                    const qrUrl = `https://img.vietqr.io/image/mbbank-0382802842-qr_only.png?amount=${totalPrice}&addInfo=${encodeURIComponent(addInfo)}&accountName=NGUYEN%20THU%20TRANG`;
                    console.log("Setting QR URL to:", qrUrl);
                    cartQRCodeImg.src = qrUrl;
                }

                cartOverlay.style.display = 'block';
                cartQR.style.display = 'block';  
                // Xóa giỏ hàng sau khi thanh toán
                cartData = [];
                updateCartDisplay();
                // Đóng mã QR
                const closeQrBtn = document.getElementById('closeQrBtn');
                closeQrBtn.addEventListener('click', function() {
                    cartQR.style.display = 'none';
                    cartOverlay.style.display = 'none';
                });

                // Đóng form giỏ hàng
                cartPage.classList.remove('show');
                cartBtn.classList.remove('active');
                
                // Reset form
                document.getElementById('customer-name').value = '';
                document.getElementById('customer-phone').value = '';
                document.getElementById('selected-location').value = '';
                locationButtons.forEach(btn => btn.classList.remove('active'));
            }
        });
    }
}
