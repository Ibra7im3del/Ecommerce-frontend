import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main>
      <h1>404</h1>

      <p>الصفحة غير موجودة</p>

      <Link to="/">الرجوع إلى الصفحة الرئيسية</Link>
    </main>
  );
}

export default NotFound;
