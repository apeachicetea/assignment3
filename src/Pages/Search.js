import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Search() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [autoSearchKeyword, setAutoSearchKeyword] = useState("");
  const [autoSearchList, setAutoSearchList] = useState([
    {
      sickCd: "C23",
      sickNm: "담낭의 악성 신생물",
    },
    {
      sickCd: "K81",
      sickNm: "담낭염",
    },
    {
      sickCd: "K82",
      sickNm: "담낭의 기타 질환",
    },
    {
      sickCd: "K87",
      sickNm: "달리 분류된 질환에서의 담낭, 담도 및 췌장의 장애",
    },
    {
      sickCd: "Q44",
      sickNm: "담낭, 담관 및 간의 선천기형",
    },
  ]);
  const [isInputClicked, setIsInputClicked] = useState(false);
  const [isAutoSearch, setIsAutoSearch] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const focusRef = useRef(null);
  const scrollRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAutoSearch) {
      return;
    }
    // api 호출하기
  }, [searchKeyword, isAutoSearch]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focusIndex]);

  const goToSearchPage = () => {
    if (searchKeyword.length === 0 || autoSearchKeyword === 0) return;
    navigate(`/sick/${isAutoSearch ? autoSearchKeyword : searchKeyword}`);
  };

  const KeyEvent = {
    Enter: () => {
      goToSearchPage();
    },
    ArrowDown: () => {
      if (autoSearchList.length === 0) {
        return;
      }
      if (listRef.current.childElementCount === focusIndex + 1) {
        setFocusIndex(() => 0);
        return;
      }
      if (focusIndex === -1) {
        setIsAutoSearch(true);
      }
      setFocusIndex((index) => index + 1);
      setAutoSearchKeyword(autoSearchList.results[focusIndex + 1].title);
    },
    ArrowUp: () => {
      if (focusIndex === -1) {
        return;
      }
      if (focusIndex === 0) {
        setAutoSearchKeyword("");
        setFocusIndex((index) => index - 1);
        setIsAutoSearch(false);
        return;
      }

      setFocusIndex((index) => index - 1);
      setAutoSearchKeyword(autoSearchList.results[focusIndex - 1].title);
    },
    Escape: () => {
      setAutoSearchKeyword("");
      setFocusIndex(-1);
      setIsAutoSearch(false);
    },
  };

  const handleInputChange = (e) => {
    if (isAutoSearch) {
      const enteredValue =
        e.nativeEvent.inputType === "deleteContentBackward"
          ? ""
          : e.nativeEvent.data;
      focusIndex >= 0 && setSearchKeyword(autoSearchKeyword + enteredValue);
      setIsAutoSearch(false);
      setFocusIndex(-1);
      return;
    }

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

      <ul ref={listRef}>
        {autoSearchList.map((sick, listIndex) => (
          <a href={`/sick/${sick.sickCd}`} key={sick.sickCd}>
            <li ref={listIndex === focusIndex ? focusRef : undefined}>
              {sick.sickNm}
            </li>
          </a>
        ))}
      </ul>
    </>
  );
}

export default Search;
