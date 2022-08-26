const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
    const heartIcon = alreadyFavorite ? "💖" : "🤍";
    return (
        <div className="main-card">
            <img src={img} alt="고양이" width="400" />
            <button onClick={onHeartClick}>{heartIcon}</button>
        </div>
    );
}; //컴포넌트 (화살표 함수방식) props.img 대신 {img}로 사용하여 구현 가능(ES6+ destructuring문법)

export default MainCard;