// Lấy ngày hiện tại
let currentDate = new Date();
let x=[]
// Lặp qua 10 ngày gần đây
for (let i = 0; i < 7; i++) {
  // Giảm một ngày từ ngày hiện tại (86400000 milliseconds là một ngày)
  let previousDate = new Date(currentDate.getTime() - i * 86400000);

  // Hiển thị thời gian trong định dạng mong muốn (ví dụ: "YYYY-MM-DD")
  let formattedDate = formatDate(previousDate);
  x.push(formattedDate)
}
export const formatDates=x.reverse();
// Hàm định dạng ngày thành chuỗi "YYYY-MM-DD"
function formatDate(date) {
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}
