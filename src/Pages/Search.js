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
    axios
      .get(`http://localhost:4000/sick?q=${searchKeyword}`)
      .then((res) => setAutoSearchList(res.data));
  }, [searchKeyword, isAutoSearch]);

  const containWord = autoSearchList.filter((el) =>
    el.sickNm.includes(searchKeyword)
  );

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
        setFocusIndex(() => 0);
        setAutoSearchKeyword(autoSearchList[0].sickNm);
        return;
      }
      setFocusIndex(focusIndex + 1);
      setAutoSearchKeyword(autoSearchList[focusIndex + 1].sickNm);
    },
    ArrowUp: () => {
      if (focusIndex === 0 || undefined) {
        setFocusIndex(() => listRef.current.childElementCount - 1);
        setAutoSearchKeyword(autoSearchList[autoSearchList.length - 1].sickNm);
        return;
      }
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

      {containWord && searchKeyword ? (
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
