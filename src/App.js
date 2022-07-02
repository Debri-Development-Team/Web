import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Account from "./pages/Account/Account";
import Timetable from "./pages/Timetable/Timetable";
import TimeLine from "./pages/TimeLine/TimeLine";
import Menu from "./pages/Menu/Menu";
import SearchLecture from "./pages/SearchLecture/SearchLecture";
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="account" element={<Account />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="/" element={<Login />} />
          <Route path="timeline" element={<TimeLine />} />
          <Route path="search" element={<SearchLecture />} />
          <Route path="menu" element={<Menu />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
