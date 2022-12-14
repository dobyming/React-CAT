const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
    const heartIcon = alreadyFavorite ? "๐" : "๐ค";
    return (
        <div className="main-card">
            <img src={img} alt="๊ณ ์์ด" width="400" />
            <button onClick={onHeartClick}>{heartIcon}</button>
        </div>
    );
}; //์ปดํฌ๋ํธ (ํ์ดํ ํจ์๋ฐฉ์) props.img ๋์  {img}๋ก ์ฌ์ฉํ์ฌ ๊ตฌํ ๊ฐ๋ฅ(ES6+ destructuring๋ฌธ๋ฒ)

export default MainCard;