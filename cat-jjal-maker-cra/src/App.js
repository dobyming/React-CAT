import logo from './logo.svg';
import React from "react";
import './App.css';
import Title from "./components/Title";
import MainCard from "./components/MainCard";


const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};


function InputCat({ updateMainCat }) {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  function handleInputChange(e) {
    const userValue = e.target.value;
    setErrorMessage(""); //영어+한글 순일때 한글만 지웠을때 에러메시지가 삭제될 수 있도록 초기화
    if (includesHangul(userValue)) {
      setErrorMessage('한글은 입력할 수 없습니다.'); //True면 한글은 입력할 수 없다는걸 명시
    }
    setValue(userValue.toUpperCase()) //Input값이 들어올때 대문자로 전환
  } //한글이 있는지 check 

  function handleFormSubmit(e) {
    e.preventDefault();
    if (value === '') {
      setErrorMessage("값을 입력하세요");
      return; //updateMainCat()까지 내려가지 않도록 방지
    }
    updateMainCat(value); //input값 전달 
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        value={value}
        onChange={handleInputChange} //input시 상태값이 변화하게
      />
      <button type="submit">생성</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};

function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{ width: "150px" }} />
    </li>
  );
}; //컴포넌트 만들기 (컴포넌트는 항상 대문자로 시작)
//props.img -> img 내부에 img를 들춰야하기 때문에 이렇게 작성
//JSX방식으로 태그내에 바로 CSS 적용 가능(inline styling)


function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>
  } //조건부 렌더링 

  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}; //cats 배열에 있는 이미지 URL들을 불러읽음 


//App: 최상위 컴포넌트 
const App = () => {
  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 = "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

  //refresh를 해도 생성한 N번째 고양이를 유지 
  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem('counter')
  }) //jsonLocalStorage에 한번만 접근하기 위해 사용한 코드
  const [catimg, setCatImg] = React.useState(CAT1); //CAT1으로 초기 설정
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem(['favorites']) || [];
  }); //뒤에[] 초기화는 map에 넘겨줄 favorites가 없으면 빈배열로 초기화

  const alreadyFavorite = favorites.includes(catimg);

  /* 사이트 진입 시 Open API call 해서 랜덤으로 고양이 사진 받아오기 */
  async function setInitialCat() {
    const newCat = await fetchCat('First cat');
    setCatImg(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []) //useEffect 역할: setInitialCat() 함수를 '1번만' 호출되게


  async function updateMainCat(value) {
    const newCat = await fetchCat(value); //input값 넘겨받기
    setCatImg(newCat);
    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter); //counter값을 local storage에 저장
      return nextCounter;
    }); //counter 지연 문제 해결 (setState)
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, catimg];
    setFavorites(nextFavorites); //JS문법-> favorites[CAT1,CAT2]에 CAT3를 추가한다.
    jsonLocalStorage.setItem('favorites', nextFavorites);
  }

  const counterTitle = counter === null ? "" : counter + '번째 '

  return (
    <div>
      <Title>{counterTitle}고양이 가라사대</Title>
      <InputCat updateMainCat={updateMainCat} />
      <MainCard img={catimg} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite} />
      <Favorites favorites={favorites} />
    </div>
  );
};


export default App;
