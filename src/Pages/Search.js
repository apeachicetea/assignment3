import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

function Search() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [autoSearchKeyword, setAutoSearchKeyword] = useState("");
  const [autoSearchList, setAutoSearchList] = useState([]);
  const [isInputClicked, setIsInputClicked] = useState(false);
  const [isAutoSearch, setIsAutoSearch] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const listRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAutoSearch) {
      return;
    }

    console.log(autoSearchList);

    // 그냥 처음에 쿼리 하나도 안주고 다 받아서 로컬에 저장해
    const data = JSON.parse(localStorage.getItem("searchList"));

    if (!data) {
      axios.get(`http://localhost:4000/sick`).then((res) => {
        localStorage.setItem("searchList", JSON.stringify(res.data));
        setAutoSearchList(res.data);
        console.info("calling api");
      });

      // 그리고 일정기간 지나면 로컬스토리지 없애기

      // 없을때는 요청을 해서 다시 로컬스토리지에 저장하기
    }
  }, [isAutoSearch]);

  useEffect(() => {
    // 그리고 쿼리가 있을때마다 로컬에서 꺼내다 쓰기
    if (searchKeyword) {
      const filteredData = autoSearchList.filter((el) =>
        el.sickNm.includes(searchKeyword)
      );
      console.log("filteredData : ", filteredData);
      if (filteredData.length) {
        setAutoSearchList(filteredData);
      }
    }
  }, [searchKeyword]);

  const goToSearchPage = () => {
    if (searchKeyword.length === 0 || autoSearchKeyword === 0) return;

    const keyword = isAutoSearch ? autoSearchKeyword : searchKeyword;

    const sickCd = autoSearchList.filter((el) => el.sickNm === keyword)[0]
      .sickCd;

    navigate(`/detail/${sickCd}`, {
      state: {
        data: sickCd,
      },
    });
  };

  const KeyEvent = {
    Enter: () => {
      goToSearchPage();
    },
    ArrowDown: (e) => {
      if (listRef.current.childElementCount === focusIndex + 1) {
        setIsAutoSearch(true);
        setFocusIndex(() => 0);
        setAutoSearchKeyword(autoSearchList[0].sickNm);
        return;
      }
      setIsAutoSearch(true);
      setFocusIndex(focusIndex + 1);
      setAutoSearchKeyword(autoSearchList[focusIndex + 1].sickNm);
    },
    ArrowUp: () => {
      if (focusIndex === 0 || undefined) {
        setIsAutoSearch(true);
        setFocusIndex(() => listRef.current.childElementCount - 1);
        setAutoSearchKeyword(autoSearchList[autoSearchList.length - 1].sickNm);
        return;
      }
      setIsAutoSearch(true);
      setFocusIndex(focusIndex - 1);
      setAutoSearchKeyword(autoSearchList[focusIndex - 1].sickNm);
    },
    Escape: () => {
      setAutoSearchKeyword("");
      setFocusIndex(-1);
      setIsAutoSearch(false);
    },
  };

  const handleInputChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleKeyUp = (e) => {
    if (KeyEvent[e.key]) KeyEvent[e.key]();
  };

  return (
    <>
      <input
        type="text"
        placeholder={isInputClicked ? "" : "질환명을 입력해주세요."}
        value={isAutoSearch ? autoSearchKeyword : searchKeyword}
        onChange={handleInputChange}
        onKeyUp={handleKeyUp}
        onFocus={() => {
          setIsInputClicked(true);
        }}
        onBlur={() => {
          setIsInputClicked(false);
        }}
      />
      <button>검색</button>

      {searchKeyword ? (
        <ul ref={listRef}>
          {autoSearchList.map((sick, listIndex) => {
            return (
              <a href={`/detail/${sick.sickCd}`} key={sick.sickCd}>
                <li className={listIndex === focusIndex ? "focused" : ""}>
                  {sick.sickNm}
                </li>
              </a>
            );
          })}
        </ul>
      ) : null}
      {autoSearchList.length === 0 && searchKeyword ? "검색어가 없음" : null}
    </>
  );
}

export default Search;
